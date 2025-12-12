// userService.ts

import { FbUser, IUserService, AuthUser, LoginRequest } from "../../types/user"; // Припустимо, типи знаходяться у types.ts
import logger from "../../config/logger";
import { firebirdDb } from "../../db/FirebirdDb";
import {
  GET_ALL_USERS_QUERY,
  GET_USER_BY_CREDENTIALS_QUERY,
} from "./userQueries";

import { mapFbUserToAuthUser } from "./userMapper";

class UserService implements IUserService {
  private readonly context = "UserService";

  /**
   * Отримує список усіх користувачів.
   */
  public async getAllUsers(): Promise<AuthUser[]> {
    logger.info("Запит на отримання всіх користувачів.", {
      compontent: "UserService",
    });
    try {
      const users = await firebirdDb.executeSelect<FbUser>(GET_ALL_USERS_QUERY);
      logger.info(users[0].ID);
      const authUsers = users.map((user) => {
        return mapFbUserToAuthUser(user);
      });
      return authUsers;
    } catch (error) {
      logger.error("Помилка в getAllUsers.", {
        error,
        compontent: "UserService",
      });
      throw new Error("Помилка БД при отриманні користувачів.");
    }
  }

  /**
   * Отримує одного користувача за ID та паролем для авторизації.
   * @note У реальному додатку `password` має бути хешованим (наприклад, bcrypt) і порівнюватися з хешем у базі.
   */
  public async getUserByCredentials(
    loginReq: LoginRequest
  ): Promise<AuthUser | null> {
    logger.info(`Спроба авторизації для користувача ID: ${loginReq.userId}.`, {
      compontent: "UserService",
    });
    try {
      const users = await firebirdDb.executeSelect<FbUser>(
        GET_USER_BY_CREDENTIALS_QUERY,
        [loginReq.userId, loginReq.password]
      );

      if (users.length === 1) {
        logger.info(`Користувач ID: ${loginReq.userId} успішно знайдений.`, {
          context: this.context,
        });
        const authUser = mapFbUserToAuthUser(users[0]);
        return authUser;
      }

      logger.warn(
        `Користувача ID: ${loginReq.userId} не знайдено або невірний пароль.`,
        { context: this.context }
      );
      return null; // Користувача не знайдено
    } catch (error) {
      logger.error(
        `Помилка в getUserByCredentials для ID: ${loginReq.userId}.`,
        {
          error,
          componenet: "UserService",
        }
      );
      throw new Error("Помилка БД під час авторизації.");
    }
  }
}

export const userService = new UserService();
