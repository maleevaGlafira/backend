import winston from "winston";
import path from "path";
import fs from "fs";

const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error", // Только ошибки и выше
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      tailable: true, // Новые логи в конец файла
    }),
    // Логирование всех информационных сообщений и выше в общий файл
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"), // Изменено на combined.log
      level: "info", // Все, что >= info
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
    // Логирование в консоль (только для dev)
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug", // Уровень логов для консоли
      format: winston.format.combine(
        winston.format.colorize(), // Цветной вывод
        winston.format.simple() // Простой формат для консоли
      ),
    }),
  ],
  // Опция для обработки необработанных исключений
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],
  // Опция для обработки отказов промисов
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "rejections.log"),
    }),
  ],
});

// Если не production, дополнительно выводим в консоль все уровни до debug
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "debug", // Позволяет видеть debug-сообщения в разработке
    })
  );
}

export default logger;
