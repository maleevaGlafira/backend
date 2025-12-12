import { Router, Request, Response, NextFunction } from "express";
import { msSqlDb } from "../db/MsSqlDb";
import { firebirdDb } from "../db/FirebirdDb";
import { AppError } from "../middleware/errorHandler";

// Создаем новый экземпляр роутера
const router = Router();

// --- Тестовые маршруты (удалить после проверки) ---

router.get("/", (req: Request, res: Response) => {
  console.log("Текущая локаль:", req.locale);
  console.log("Доступные переводы (uk):", require("../../locales/uk.json"));
  res.send(`Backend is running! || ${res.__("Test error")}`);
});

router.get(
  "/test-mssql",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await msSqlDb.executeSelect<{ CurrentDateTime: Date }>(
        "SELECT GETDATE() AS CurrentDateTime"
      );
      res.json({ status: "MS SQL Connected", data: result[0] });
    } catch (err: unknown) {
      console.error("Error in /test-mssql:", err);
      res.status(500).json({
        error: "MS SQL connection failed",
        details: err instanceof Error ? err.message : "Unknown error",
      });
      next(new AppError("MS SQL connection failed", 500, "DB_MSSQL_ERROR"));
    }
  }
);

router.get(
  "/test-firebird",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await firebirdDb.executeSelect<{
        current_timestamp: Date;
      }>("SELECT current_timestamp  FROM RDB$DATABASE");
      res.json({ status: "Firebird Connected", data: result[0] });
    } catch (err: unknown) {
      next(
        new AppError(
          "Failed to connect to Firebird or execute query",
          500,
          "DB_FIREBIRD_ERROR"
        )
      );
    }
  }
);

// Пример маршрута с ошибкой
router.get("/test-error", (req: Request, res: Response, next: NextFunction) => {
  // Имитируем ошибку
  const error = new AppError(res.__("Test error"), 400, "TEST_ERROR");
  next(error); // Передаем ошибку в глобальный обработчик
});

// Экспортируем роутер, чтобы его можно было использовать в основном файле сервера
export default router;
