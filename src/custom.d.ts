import * as express from 'express';

declare global {
  namespace Express {
   interface Request {
    accessToken?: string;
    tokenExpiresAt?: number;
  }
}
}
