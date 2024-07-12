import { Request, Response, NextFunction } from 'express';
import tokenService from '../service/zohoServices';

interface CustomRequest extends Request {
  accessToken?: string; 
  tokenExpiresAt?:number;
}

export const refreshTokenMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
 try{
   const token = await tokenService.getToken();
   console.log("token is ",token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized token' });
  }

  const currentTime = Date.now();
  if (currentTime >= token.tokenExpiresAt) {
      const { accessToken, tokenExpiresAt } = await tokenService.refreshToken(token.refreshToken);
      req.accessToken = accessToken;
      req.tokenExpiresAt = tokenExpiresAt;
  } else {
    req.accessToken = token.accessToken;
    req.tokenExpiresAt = token.tokenExpiresAt;
  }

  next();
}
catch(error){
  console.error('Error in Refresh token',error);
  res.status(500).json({error:"internal server error"});
}
};
