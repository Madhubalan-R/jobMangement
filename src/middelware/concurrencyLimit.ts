import { Request, Response, NextFunction } from 'express';
import getClientIp from '../utils/getClintIp';

const concurrentRequests: { [key: string]: number } = {};
const MAX_CONCURRENT_REQUESTS = 20;

const concurrencyLimit = (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);

  if (!concurrentRequests[ip]) {
    concurrentRequests[ip] = 0;
  }

  if (concurrentRequests[ip] >= MAX_CONCURRENT_REQUESTS) {
    return res.status(429).json({ error: 'Too many concurrent requests. Please try again later.' });
  }

  concurrentRequests[ip]++;
  
  res.on('finish', () => {
    concurrentRequests[ip]--;
  });

  next();
};

export default concurrencyLimit;
