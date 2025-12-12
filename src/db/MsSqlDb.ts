import sql from "mssql";
import dotenv from "dotenv";
import logger from "../config/logger"; // Импортируем логгер
import { error } from "console";

dotenv.config();

/**
 * Класс для управления пулом соединений и выполнения запросов к базе данных MS SQL.
 * Использует `mssql` драйвер.
 *
 * Примечание: `mssql` драйвер отлично работает с пулом соединений,
 * что значительно эффективнее, чем открывать и закрывать соединение для каждого запроса.
 * Пул управляется внутри класса.
 */
export class MsSqlDb {
  private config: sql.config;
  private pool: sql.ConnectionPool | null = null;
  private logger = logger;

  constructor() {
    this.config = {
      user: process.env.MS_SQL_USER,
      password: process.env.MS_SQL_PASSWORD,
      server: process.env.MS_SQL_SERVER || "localhost",
      database: process.env.MS_SQL_DATABASE,
      options: {
        encrypt: false, // Set to true for Azure SQL Database
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
      },
    };

    // Базовая проверка конфигурации
    if (
      !this.config.server ||
      !this.config.database ||
      !this.config.user ||
      !this.config.password
    ) {
      this.logger.error(
        "MsSqlDb: Missing required connection parameters in .env",
        { component: "MsSqlDb" }
      );

      throw new Error("MS SQL connection parameters are not fully configured.");
    }
  }

  /**
   * Инициализирует и возвращает пул соединений MS SQL.
   * Если пул уже существует и подключен, возвращает его.
   * @returns Promise<sql.ConnectionPool> - Promise, который разрешается объектом пула.
   */
  public async getPool(): Promise<sql.ConnectionPool> {
    try {
      if (this.pool && this.pool.connected) {
        this.logger.debug("MsSqlDb: MS SQL pool already connected.", {
          component: "MsSqlDb",
        });
        return this.pool;
      }
      this.logger.info("MsSqlDb: MS SQL pool already connected.", {
        component: "MsSqlDb",
      });
      this.pool = await sql.connect(this.config);
      this.pool.on("error", (err) => {
        console.error("MsSqlDb: MS SQL pool error:", err);
        this.logger.error("MsSqlDb: MS SQL connected successfully!", {
          component: "MsSqlDb",
          error: err,
        });
        // Здесь можно реализовать логику повторного подключения или уведомления
      });

      return this.pool;
    } catch (err: unknown) {
      // <-- ИЗМЕНЕНИЕ ЗДЕСЬ
      this.logger.error("MsSqlDb: MS SQL Connection Failed!", {
        error: err,
        component: "MsSqlDb",
      });
      // Проверяем, является ли err экземпляром Error, чтобы безопасно получить .message
      if (err instanceof Error) {
        throw new Error(`MS SQL connection failed: ${err.message}`);
      } else {
        // Если это не Error, то возвращаем общее сообщение или преобразуем в строку
        throw new Error(`MS SQL connection failed: An unknown error occurred`);
      }
    }
  }

  /**
   * Закрывает пул соединений MS SQL.
   */
  public async closePool(): Promise<void> {
    try {
      if (this.pool && this.pool.connected) {
        await this.pool.close();
        this.pool = null;

        this.logger.info("MsSqlDb: MS SQL pool closed.", {
          component: "MsSqlDb",
        });
      }
    } catch (err: unknown) {
      // <-- ИЗМЕНЕНИЕ ЗДЕСЬ
      this.logger.error("MsSqlDb: Error closing MS SQL pool:", {
        component: "MsSqlDb",
        error: err,
      });

      // Проверяем, является ли err экземпляром Error, чтобы безопасно получить .message
      if (err instanceof Error) {
        throw new Error(`MS SQL pool close failed: ${err.message}`);
      } else {
        // Если это не Error, то возвращаем общее сообщение или преобразуем в строку
        throw new Error(`MS SQL pool close failed:: An unknown error occurred`);
      }
    }
  }

  /**
   * Выполняет SELECT-запрос с параметрами.
   * @param query - SQL-запрос.
   * @param params - Объект с именованными параметрами для запроса.
   * @returns Promise<T[]> - Promise, который разрешается массивом объектов (строк результата).
   */
  public async executeSelect<T>(
    query: string,
    params?: { [key: string]: any }
  ): Promise<T[]> {
    try {
      const pool = await this.getPool();
      const request = pool.request();

      if (params) {
        for (const key in params) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            request.input(key, params[key]);
          }
        }
      }

      const result = await request.query(query);
      return result.recordset as T[];
    } catch (err: unknown) {
      // <-- ИЗМЕНЕНИЕ ЗДЕСЬ
      console.error("MsSqlDb: Error executing SELECT query:", err);
      this.logger.error("MsSqlDb: Error executing SELECT query:", {
        component: "MsSqlDb",
        error: err,
      });
      // Проверяем, является ли err экземпляром Error, чтобы безопасно получить .message
      if (err instanceof Error) {
        throw new Error(
          `MsSqlDb: Error executing SELECT query:: ${err.message}`
        );
      } else {
        // Если это не Error, то возвращаем общее сообщение или преобразуем в строку
        throw new Error(`MS SQL pool close failed:: An unknown error occurred`);
      }
    }
  }

  /**
   * Выполняет INSERT, UPDATE, DELETE-запрос с параметрами.
   * @param query - SQL-запрос.
   * @param params - Объект с именованными параметрами для запроса.
   * @returns Promise<number> - Promise, который разрешается количеством затронутых строк.
   */
  public async executeNonQuery(
    query: string,
    params?: { [key: string]: any }
  ): Promise<number> {
    try {
      const pool = await this.getPool();
      const request = pool.request();

      if (params) {
        for (const key in params) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            request.input(key, params[key]);
          }
        }
      }

      const result = await request.query(query);
      this.logger.info(
        "MsSqlDb: Non-query executed successfully, rows affected:",
        { result: result.rowsAffected[0] }
      );

      return result.rowsAffected[0];
    } catch (err: unknown) {
      // <-- ИЗМЕНЕНИЕ ЗДЕСЬ
      this.logger.error(
        "MsSqlDb: Error executing non-query (INSERT/UPDATE/DELETE)!",
        { component: "MsSqlDb", error: err }
      );

      // Проверяем, является ли err экземпляром Error, чтобы безопасно получить .message
      if (err instanceof Error) {
        throw new Error(
          `"MsSqlDb: Error executing non-query (INSERT/UPDATE/DELETE)!:: ${err.message}`
        );
      } else {
        // Если это не Error, то возвращаем общее сообщение или преобразуем в строку
        throw new Error(
          `"MsSqlDb: Error executing non-query (INSERT/UPDATE/DELETE)!"`
        );
      }
    }
  }

  /**
   * Выполняет хранимую процедуру с параметрами.
   * @param procedureName - Имя хранимой процедуры.
   * @param params - Объект с именованными параметрами для хранимой процедуры.
   * @returns Promise<T[]> - Promise, который разрешается массивом результатов, если процедура возвращает данные.
   */
  public async executeStoredProcedure<T>(
    procedureName: string,
    params?: { [key: string]: any }
  ): Promise<T[]> {
    try {
      const pool = await this.getPool();
      const request = pool.request();

      if (params) {
        for (const key in params) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            request.input(key, params[key]);
          }
        }
      }

      const result = await request.execute(procedureName);
      return result.recordset as T[];
    } catch (err: unknown) {
      // <-- ИЗМЕНЕНИЕ ЗДЕСЬ
      console.error("MsSqlDb: Error executing stored procedure ", err);
      this.logger.error("MsSqlDb: Error executing stored procedure", {
        component: "MsSqlDb",
        error: err,
      });
      // Проверяем, является ли err экземпляром Error, чтобы безопасно получить .message
      if (err instanceof Error) {
        throw new Error(
          `"MsSqlDb: Error executing stored procedure :: ${err.message}`
        );
      } else {
        // Если это не Error, то возвращаем общее сообщение или преобразуем в строку
        throw new Error(`"MsSqlDb: Error executing stored procedure "`);
      }
    }
  }
}

// Экземпляр для удобства, если требуется синглтон
export const msSqlDb = new MsSqlDb();
