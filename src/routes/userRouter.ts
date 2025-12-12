// userRouter.ts

import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AuthResponse, LoginRequest, AuthUser } from "../types/user";
import { authMiddleware } from "../middleware/authMiddleware";

import { userService } from "../services/users/userService";
import logger from "../config/logger";
import { config } from "../config/env";

// Секретний ключ для підпису токена (У реальному додатку зберігайте у .env)
const JWT_SECRET = config.JWT_SECRET;

/**
 * Створює роутер для роботи з користувачами.
 */
function createUserRouter(): Router {
  const router = Router();
  const context = "UserRouter";

  // --- 1. GET /users (Отримання всіх користувачів) ---
  router.get("/", async (req: Request, res: Response) => {
    logger.info("GET /users: Запит на список користувачів.", { context });

    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      logger.error("GET /users: Критична помилка.", error as Error, {
        context,
      });
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // --- 2. POST /users/login (Авторизація) ---
  router.post("/login", async (req: Request, res: Response) => {
    const auth: LoginRequest = req.body;

    if (!auth.userId || !auth.password) {
      return res
        .status(400)
        .json({ message: res.__("Please provide username and password") });
    }

    logger.info(`POST /users/login: Спроба входу для ID: ${auth.userId}.`, {
      context,
    });

    try {
      const user = await userService.getUserByCredentials(auth);

      if (user) {
        // Формуємо об'єкт користувача для відповіді (без пароля)
        const userResponse: AuthUser = user;

        logger.info(`POST /users/login: Успішний вхід ID: ${auth.userId}.`, {
          context,
        });

        const payload = userResponse;
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        return res.json(<AuthResponse>{
          message: res.__("User successfully authorized"),
          token: token,
          user: userResponse,
        });
      } else {
        // Невдала авторизація
        logger.warn(
          `POST /users/login: Невдала спроба входу для ID: ${auth.userId}.`,
          { context }
        );
        return res
          .status(401)
          .json({ message: `${res.__("Invalid password")}}` });
      }
    } catch (error) {
      logger.error(
        `POST /users/login: Критична помилка для ID: ${auth.userId}.`,
        error as Error,
        { context }
      );
      res.status(500).json({ message: `${res.__("Authorization error")}}` });
    }
  });

  router.get("/verify", authMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).user; // Пользователь из authMiddleware
    res.json({
      user,
      token: req.headers.authorization?.split(" ")[1],
    } as AuthResponse);
  });

  router.post("/logout", authMiddleware, (req: Request, res: Response) => {
    logger.info(`Користувач ${(req as any).user?.name} вийшов з системи`);
    res.json({ message: `${res.__("Logout successful")}` });
  });

  return router;
}
const userRouter = createUserRouter();
export default userRouter;
