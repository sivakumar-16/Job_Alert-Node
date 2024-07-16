import { Request, Response, NextFunction } from 'express';
import { getLatestToken, refreshToken } from '../Services/services';

interface CustomRequest extends Request {
  accessToken?: string;
  tokenExpiresAt?: number;
}

export const refreshTokenMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = await getLatestToken();

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not found' });
    }

    const currentTime = Date.now();
    if (currentTime >= token.expires_in) {
      const { accessToken, tokenExpiresAt } = await refreshToken(token.refresh_token);
      req.accessToken = accessToken;
      req.tokenExpiresAt = tokenExpiresAt;
    } else {
      req.accessToken = token.access_token;
      req.tokenExpiresAt = token.expires_in;
    }

    next();
  } catch (error) {
    console.error('Error in token middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
