import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';
import { AppError } from '../middleware/errorHandler';
import { AuthUser } from "../types/user"
import { config } from '../config/env';

const JWT_SECRET = config.JWT_SECRET; // Замените на ваш секретный ключ

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError('Токен не предоставлен', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    (req as any).user = decoded; // Добавляем пользователя в запрос
    next();
  } catch (error) {
    logger.error('Ошибка проверки токена:', error);
    throw new AppError('Недействительный токен', 401);
  }
};