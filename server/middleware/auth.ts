import { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/jwt';

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


