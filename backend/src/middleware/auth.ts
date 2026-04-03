import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthTokenPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
  username: string;
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

/**
 * Verify JWT token and attach user to request
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as AuthTokenPayload | string;

    if (typeof decoded === 'string' || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
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
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as AuthTokenPayload | string;

      if (typeof decoded !== 'string' && decoded.userId) {
        req.user = decoded;
      }
    }
  } catch (error) {
    // Silently fail - user will be undefined
  }

  next();
}
