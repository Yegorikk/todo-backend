import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/index.js';

const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'No authorization token' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth; 