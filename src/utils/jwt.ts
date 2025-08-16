import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET = env.jwtSecret!;

export function createAccessJwt(user: User) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
}

export function createRefreshJwt(user: User) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
