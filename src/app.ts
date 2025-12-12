import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Для обработки CORS
import helmet from "helmet"; // Для безопасности HTTP-заголовков
import cookieParser from "cookie-parser"; // Для работы с куками
import fs from "fs";
import path from "path";
import i18n from "i18n";

import { errorHandler, AppError } from "./middleware/errorHandler";
import logger from "./config/logger";

import { msSqlDb } from "./db/MsSqlDb";
import { firebirdDb } from "./db/FirebirdDb"; // Теперь это класс с пулом

import { loadMainCache } from "./services/dictionaries/reference.cache";
import { LoadVDSCache } from "./services/VDS/dictionaries/vdsReference.cache";
import { LoadNSCache } from "./services/NS/dictionaries/NsReferences.chache";

import testRoutes from "./routes/testRouter";
import userRouter from "./routes/userRouter";
import dictionaryRouter from "./routes/dictionaries/dictionaryRouter";
import nsDictionaryRouter from "./routes/NS/dictionaries/dictionaryRouter";
import nsOrderRouter from "./routes/NS/Orders/SearchOrdersRouter";

import vdsDictionaries from "./routes/VDS/dictionaries";
import ordersVDSRouter from "./routes/VDS/Orders/SearchOrdersRouter";

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173", // Vite/Vue dev server
  "http://127.0.0.1:5500", // Live Server (VS Code)
  // Добавьте другие, если нужно, например: 'https://ваш-фронтенд.com'
];

// --- Настройка i18n ---
i18n.configure({
  locales: ["uk", "en"], // Доступные языки
  defaultLocale: "uk", // Язык по умолчанию
  directory: path.join(__dirname, "../locales"), // Путь к директории с переводами
  objectNotation: false, // Позволяет использовать вложенные объекты в файлах переводов (неактуально для простых строк, но полезно)
  updateFiles: false, // Если true, i18n будет добавлять новые ключи в файлы локалей при их использовании
  cookie: "lang", // Имя куки для хранения выбранного языка (опционально)
  queryParameter: "lang", // Имя параметра запроса для установки языка (например, /api?lang=uk)
  // header: "accept-language" // i18n может автоматически определять язык из заголовка Accept-Language
  header: false as unknown as string,
});

// --- Middleware ---
app.use(i18n.init);

// 1. CORS (Cross-Origin Resource Sharing)
// Важно настроить для взаимодействия Frontend и Backend на разных портах/доменах
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Замените на домен вашего Frontend в production!
//     credentials: true, // Разрешает передачу куки и заголовков авторизации
//   })
// );
// app.use(
//   cors({
//     origin: "http://127.0.0.1:5500", // Замените на домен вашего Frontend в production!
//     credentials: true, // Разрешает передачу куки и заголовков авторизации
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      // Разрешаем запросы без origin (например, мобильные приложения, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Разрешено
      } else {
        callback(new Error("Not allowed by CORS")); // Запрещено
      }
    },
    credentials: true,
  })
);

// 2. Helmet для установки безопасных HTTP-заголовков
app.use(helmet());

// 3. Парсер JSON-тела запросов
app.use(express.json());

// 4. Парсер куки
app.use(cookieParser());

// ---  маршруты   ---

app.use("/test", testRoutes);
app.use("/users", userRouter);
app.use("/api/dictionary", dictionaryRouter);
app.use("/api/ns/dictionary", nsDictionaryRouter);
app.use("/api/ns/SearchOrders", nsOrderRouter);

app.use("/api/vds/dictionary", vdsDictionaries);
app.use("/api/vds/SearchOrders", ordersVDSRouter);

// --- Обработка 404 ошибок (должна идти перед глобальным обработчиком ошибок) ---
app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Resource not found: ${req.originalUrl}`, 404, "NOT_FOUND")
  );
});

// --- Обработка ошибок (Middleware) ---
app.use(errorHandler);

app.use((req, res, next) => {
  logger.info(
    `Входящий запрос: ${req.method} ${req.url}  Язык: ${(req as any).locale}`
  );
  next();
});

// Загрузка SSL-сертификатов
const options = {
  key: fs.readFileSync(path.join(__dirname, "../cert/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "../cert/server.crt")),
  securityVersion: "TLSv1.2",
};

// --- Запуск сервера ---
const startServer = async () => {
  try {
    // Попытка подключиться к MS SQL при старте
    await msSqlDb.getPool(); // Просто пытаемся получить пул, чтобы проверить соединение
    await loadMainCache();
    await LoadNSCache();
    await LoadVDSCache();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access frontend at http://localhost:5173`); // Напоминание для Frontend
    });
  } catch (dbError) {
    console.error(
      "Failed to connect to one or more databases on startup:",
      dbError
    );

    process.exit(1); // Завершаем процесс, если не удалось подключиться к БД
  }
};

startServer();

// Обработка сигнала завершения процесса для корректного закрытия соединений с БД
process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server and DB connections");
  await msSqlDb.closePool(); // Закрываем пул MS SQL
  await firebirdDb.closeAllConnections(); // Закрываем все соединения Firebird из пула
  process.exit(0);
});
