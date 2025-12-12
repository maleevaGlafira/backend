import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Внутренняя ошибка сервера";

  logger.error({
    status,
    message,
    url: req.url,
    method: req.method,
    stack: err.stack,
  });

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
};

// Пример кастомной ошибки
export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}
