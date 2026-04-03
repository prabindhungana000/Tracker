import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { authenticateAccessToken } from '../services/authUsers';
import { hasSupabaseServerConfig } from '../lib/supabase';

export interface AuthTokenPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
  username: string;
  supabaseUserId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

function readBearerToken(authorization?: string) {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim();
}

function readLegacyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as AuthTokenPayload | string;

    if (typeof decoded === 'string' || !decoded.userId) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verify Supabase access token and attach the linked app user to the request.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = readBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Missing authorization token',
      });
    }

    const legacyUser = readLegacyToken(token);

    if (legacyUser) {
      req.user = legacyUser;
      next();
      return;
    }

    if (!hasSupabaseServerConfig()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    req.user = await authenticateAccessToken(token);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = readBearerToken(req.headers.authorization);

    if (token) {
      const legacyUser = readLegacyToken(token);

      if (legacyUser) {
        req.user = legacyUser;
      } else if (hasSupabaseServerConfig()) {
        req.user = await authenticateAccessToken(token);
      }
    }
  } catch (error) {
    // Silently fail - user will stay undefined
  }

  next();
}
