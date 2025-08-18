import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

// LOAD AND VALIDATE SECRET 
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) throw new Error("Missing JWT_SECRET");
const SECRET: Secret = rawSecret;

// ACCOUNT WILL AUTO LOGOUT IN 1 HOUR
const DEFAULT_TTL: number = Number(process.env.JWT_EXPIRES_IN ?? 3600) || 3600;

export function sign(payload: object, expiresIn: number = DEFAULT_TTL): string {
  const opts: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET, opts);
}

// VERIFY A JWT AND RETURN TYPED OBJECT
export type TokenPayload<T extends object = {}> = JwtPayload & T;

export function verify<T extends object = {}>(token: string): TokenPayload<T> {
  const decoded = jwt.verify(token, SECRET);
  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }
  return decoded as TokenPayload<T>;
}
