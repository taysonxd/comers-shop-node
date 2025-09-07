import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET = env.jwtSecret;

export function createAccessJwt(user: { id: string; email: string }) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d', algorithm: "HS256" });
}

export function createRefreshJwt(user: { id: string; email: string }) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d', algorithm: "HS256" });
}

export function verifyJwt(token: string, algorithms: jwt.Algorithm = "HS256") {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: [ algorithms ] });    
  } catch (error: unknown) {    
    return null;
  }
}
