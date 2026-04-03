import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

import prisma from '../lib/prisma';
import { getSupabaseServerClient } from '../lib/supabase';

type LocalUser = {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  supabaseUserId: string | null;
};

const USERNAME_LIMIT = 24;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readMetadataValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeUsername(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalized.slice(0, USERNAME_LIMIT);
}

function deriveUsername(user: SupabaseAuthUser) {
  const metadata = (user.user_metadata || {}) as Record<string, unknown>;

  const candidates = [
    readMetadataValue(metadata.username),
    readMetadataValue(metadata.user_name),
    readMetadataValue(metadata.preferred_username),
    readMetadataValue(metadata.full_name),
    user.email ? user.email.split('@')[0] : '',
    `user_${user.id.slice(0, 8)}`,
  ];

  for (const candidate of candidates) {
    const username = sanitizeUsername(candidate);

    if (username) {
      return username;
    }
  }

  return `user_${user.id.slice(0, 8)}`;
}

async function resolveUniqueUsername(baseUsername: string, currentUserId?: string) {
  const safeBase = sanitizeUsername(baseUsername) || 'foodjourney_user';

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = attempt === 0 ? '' : `_${attempt + 1}`;
    const trimmedBase = safeBase.slice(0, Math.max(1, USERNAME_LIMIT - suffix.length));
    const username = `${trimmedBase}${suffix}`;
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!existingUser || existingUser.id === currentUserId) {
      return username;
    }
  }

  return `${safeBase.slice(0, USERNAME_LIMIT - 7)}_${Date.now().toString(36).slice(-6)}`;
}

async function syncSupabaseUser(user: SupabaseAuthUser): Promise<LocalUser> {
  if (!user.email) {
    throw new Error('Authenticated Supabase user is missing an email address.');
  }

  const email = normalizeEmail(user.email);
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ supabaseUserId: user.id }, { email }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      supabaseUserId: true,
    },
  });

  if (existingUser) {
    const username = existingUser.username
      ? existingUser.username
      : await resolveUniqueUsername(deriveUsername(user), existingUser.id);

    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email,
        username,
        supabaseUserId: user.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        supabaseUserId: true,
      },
    });
  }

  const username = await resolveUniqueUsername(deriveUsername(user));

  return prisma.user.create({
    data: {
      email,
      username,
      supabaseUserId: user.id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      supabaseUserId: true,
    },
  });
}

export async function authenticateAccessToken(accessToken: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new Error(error?.message || 'Invalid or expired token');
  }

  const localUser = await syncSupabaseUser(data.user);

  return {
    userId: localUser.id,
    email: localUser.email,
    username: localUser.username,
    supabaseUserId: data.user.id,
  };
}
