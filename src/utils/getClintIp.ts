import { Request } from 'express';

const getClientIp = (req: Request): string => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0].trim();
  } else if (Array.isArray(xForwardedFor)) {
   return xForwardedFor[0].trim();
  }
    return req.socket.remoteAddress || req.ip || '';
};

export default getClientIp;
