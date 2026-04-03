import express from 'express';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../lib/prisma';
import {
  authMiddleware,
  type AuthTokenPayload,
} from '../middleware/auth';
import {
  loginSchema,
  registerSchema,
  validateRequest,
} from '../middleware/validation';

const router = express.Router();
const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

type SerializableUser = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string) {
  return username.trim();
}

function createAuthToken(user: {
  id: string;
  email: string;
  username: string;
}) {
  const expiresIn = (
    process.env.JWT_EXPIRES_IN || '7d'
  ) as jwt.SignOptions['expiresIn'];

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn,
    }
  );
}

function serializeUser(user: {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}): SerializableUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
  };
}

function getUniqueFieldError(error: any) {
  const target = Array.isArray(error.meta?.target) ? error.meta.target : [];

  if (target.includes('email')) {
    return {
      field: 'email',
      error: 'An account with this email already exists.',
    };
  }

  if (target.includes('username')) {
    return {
      field: 'username',
      error: 'That username is already taken.',
    };
  }

  return {
    field: undefined,
    error: 'That account already exists.',
  };
}

router.post('/register', validateRequest(registerSchema), async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const username = normalizeUsername(req.body.username);
  const password = req.body.password;

  try {
    const [emailOwner, usernameOwner] = await Promise.all([
      prisma.user.findUnique({
        where: { email },
        select: { id: true },
      }),
      prisma.user.findUnique({
        where: { username },
        select: { id: true },
      }),
    ]);

    if (emailOwner) {
      return res.status(409).json({
        success: false,
        field: 'email',
        error: 'An account with this email already exists.',
      });
    }

    if (usernameOwner) {
      return res.status(409).json({
        success: false,
        field: 'username',
        error: 'That username is already taken.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        token: createAuthToken(user),
        user: serializeUser(user),
      },
    });
  } catch (error: any) {
    if (
      error?.code === 'P2002'
    ) {
      const duplicate = getUniqueFieldError(error);

      return res.status(409).json({
        success: false,
        field: duplicate.field,
        error: duplicate.error,
      });
    }

    console.error('Auth register error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to create account right now.',
    });
  }
});

router.post('/login', validateRequest(loginSchema), async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    return res.json({
      success: true,
      data: {
        token: createAuthToken(user),
        user: serializeUser(user),
      },
    });
  } catch (error: any) {
    console.error('Auth login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to sign in right now.',
    });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const userId = (req.user as AuthTokenPayload).userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    return res.json({
      success: true,
      data: {
        user: serializeUser(user),
      },
    });
  } catch (error: any) {
    console.error('Auth me error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to load account details.',
    });
  }
});

export default router;
