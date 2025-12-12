import { Request, Response, NextFunction } from "express";
import logger from "../config/logger"; // Импортируем наш настроенный логгер

// Расширяем интерфейс Error для включения опционального свойства status
interface CustomError extends Error {
  status?: number;
  code?: string; // Часто бывает в ошибках БД
}

/**
 * Глобальный обработчик ошибок Express.
 * Логирует ошибку и отправляет соответствующий ответ клиенту.
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Определяем статус ошибки: если есть в ошибке, иначе 500 (Internal Server Error)
  const status = err.status || 500;
  // Определяем сообщение ошибки: если есть в ошибке, иначе общее сообщение
  const message = err.message || "Внутренняя ошибка сервера";

  // Логируем ошибку с помощью Winston
  logger.error({
    // Метаданные ошибки для Winston
    message: `[${req.method} ${req.originalUrl}] - ${message}`, // Форматируем сообщение для лога
    status: status,
    code: err.code, // Если есть код ошибки
    url: req.originalUrl, // Полный URL запроса
    method: req.method,
    ip: req.ip, // IP адрес клиента
    stack: err.stack, // Стек вызовов
    timestamp: new Date().toISOString(), // Точная метка времени
  });

  // Отправляем ответ клиенту
  res.status(status).json({
    error: {
      message: message,
      status: status,
      // В production не стоит отправлять стек вызовов клиенту!
      // stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    },
  });
};

/**
 * Пользовательский класс ошибки для удобного выброса ошибок с конкретным статусом.
 */
export class AppError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.status = status;
    this.name = "AppError"; // Имя ошибки
    this.code = code;
    // Корректно устанавливаем прототип для сохранения цепочки наследования
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
