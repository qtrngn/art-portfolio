import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken'; 

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) throw new Error('Missing JWT_SECRET');
const SECRET: Secret = rawSecret;

const DEFAULT_TTL: number = Number(process.env.JWT_EXPIRES_IN ?? 3600) || 3600;

export function sign(
  payload: object,
  expiresIn: number = DEFAULT_TTL
): string {
  const opts: SignOptions = { expiresIn };   
  return jwt.sign(payload, SECRET, opts);
}

export type TokenPayload<T extends object = {}> = JwtPayload & T;

export function verify<T extends object = {}>(token: string): TokenPayload<T> {
  const decoded = jwt.verify(token, SECRET); 
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload'); 
  }
  return decoded as TokenPayload<T>;
}
