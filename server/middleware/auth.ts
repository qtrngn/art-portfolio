import { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/jwt';

// EXPECT A TOKEN IN THE AUTHENTICATION HEADER
// VERIFIES THE JWT AND ATTACHES THE USERID TO THE REQUEST OBJECT
export function auth(req: Request, res: Response, next: NextFunction) {
  const h = req.header('Authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = verify<{ userId: number }>(token);
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


