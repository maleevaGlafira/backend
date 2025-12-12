import fb from "node-firebird";
import dotenv from "dotenv";
import logger from "../config/logger";
import { rows } from "mssql";

dotenv.config();

// Определяем интерфейс для соединения в пуле
interface PooledConnection extends fb.Database {
  isBusy: boolean;
  lastUsed: number;
}

/**
 * Класс для управления пулом соединений и выполнения запросов к базе данных Firebird.
 * Реализует простой пул соединений, поскольку драйвер `firebird` не имеет встроенного.
 *
 * Примечание: Для более сложной и отказоустойчивой реализации пула может потребоваться
 * сторонняя библиотека или более продвинутая логика, например, с учетом "возраста" соединения.
 */
export class FirebirdDb {
  private options: fb.Options;
  private pool: PooledConnection[] = [];
  private maxPoolSize: number; // Максимальное количество соединений в пуле
  private connectionTimeout: number; // Таймаут для неиспользуемых соединений в мс
  private acquireTimeout: number; // Таймаут для получения соединения из пула
  private logger = logger;

  constructor(
    maxPoolSize: number = 10,
    connectionTimeout: number = 60000,
    acquireTimeout: number = 5000
  ) {
    this.options = {
      host: process.env.FIREBIRD_HOST,
      port: parseInt(process.env.FIREBIRD_PORT || "3050"),
      database: process.env.FIREBIRD_DATABASE,
      user: process.env.FIREBIRD_USER,
      password: process.env.FIREBIRD_PASSWORD,
      // charset: 'UTF8', // Раскомментируйте, если требуется конкретная кодировка
    };

    this.maxPoolSize = maxPoolSize;
    this.connectionTimeout = connectionTimeout;
    this.acquireTimeout = acquireTimeout;

    if (
      !this.options.database ||
      !this.options.user ||
      !this.options.password
    ) {
      this.logger.error(
        "FirebirdDb: Missing required connection parameters in .env",
        { component: FirebirdDb }
      );

      throw new Error(
        "Firebird connection parameters are not fully configured."
      );
    }

    // Запуск очистки пула по таймеру
    setInterval(() => this.cleanupPool(), this.connectionTimeout / 2); // Проверять каждые полтаймаута
  }

  /**
   * Создает новое соединение к базе данных Firebird.
   * @returns Promise<PooledConnection> - Promise, который разрешается объектом соединения.
   */
  private async createConnection(): Promise<PooledConnection> {
    this.logger.info(
      "`FirebirdDb: Creating new connection to ${this.options.host}:${this.options.port}/${this.options.database}`"
    );

    return new Promise((resolve, reject) => {
      fb.attach(this.options, (err: Error | null, connection: fb.Database) => {
        if (err) {
          this.logger.error("FirebirdDb: New connection failed!", {
            component: "FirebirdDb",
            error: err,
          });

          return reject(
            new Error(`Firebird connection failed: ${err.message}`)
          );
        }
        this.logger.info("FirebirdDb: New connection created successfully!");

        const pooledConn: PooledConnection = Object.assign(connection, {
          isBusy: false,
          lastUsed: Date.now(),
        });
        resolve(pooledConn);
      });
    });
  }

  /**
   * Получает соединение из пула. Если нет свободных, создает новое (до maxPoolSize).
   * @returns Promise<PooledConnection> - Promise, который разрешается объектом соединения.
   */
  public async getConnection(): Promise<PooledConnection> {
    const startTime = Date.now();
    while (Date.now() - startTime < this.acquireTimeout) {
      // Поиск свободного соединения
      let connection = this.pool.find((conn) => !conn.isBusy);

      if (connection) {
        connection.isBusy = true;
        connection.lastUsed = Date.now();
        this.logger.debug(
          `FirebirdDb: Reusing connection from pool. Pool size: ${this.pool.length}`,
          { component: "FirebirdDb" }
        );

        return connection;
      }

      // Если пул не достиг максимального размера, создаем новое соединение
      if (this.pool.length < this.maxPoolSize) {
        connection = await this.createConnection();
        connection.isBusy = true;
        connection.lastUsed = Date.now();
        this.pool.push(connection);
        this.logger.debug(
          `FirebirdDb: Created new connection for use. Pool size: ${this.pool.length}`,
          { component: "FirebirdDb" }
        );

        return connection;
      }

      // Если все соединения заняты и пул полон, ждем немного
      await new Promise((resolve) => setTimeout(resolve, 100)); // Ждем 100ms
    }
    throw new Error(
      `FirebirdDb: Failed to acquire connection within ${this.acquireTimeout}ms. Max pool size reached or all connections busy.`
    );
  }

  /**
   * Освобождает соединение, возвращая его в пул.
   * @param connection - Объект соединения Firebird.
   */
  public releaseConnection(connection: PooledConnection): void {
    if (connection) {
      connection.isBusy = false;
      connection.lastUsed = Date.now();
      console.log("FirebirdDb: Connection released to pool.");
    } else {
      // Если соединение неактивно, удаляем его из пула
      this.pool = this.pool.filter((c) => c !== connection);
      this.logger.debug(
        "FirebirdDb: Invalid connection removed from pool during release."
      );
    }
  }

  /**
   * Выполняет SELECT-запрос с параметрами.
   * @param query - SQL-запрос.
   * @param params - Массив параметров для запроса.
   * @returns Promise<T[]> - Promise, который разрешается массивом объектов (строк результата).
   */
  public async executeSelect<T>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    let connection: PooledConnection | null = null;
    try {
      connection = await this.getConnection();
      // this.logger.info(`FirebirdDb select query ${query} ${params}`);
      const result = await new Promise<T[]>((resolve, reject) => {
        connection!.query(query, params, (err: Error | null, rows: T[]) => {
          if (err) {
            this.logger.error("FirebirdDb: Error executing SELECT query!", {
              params,
              query,
              component: "FirebirdDb",
              error: err,
            });
            return reject(
              new Error(`Firebird SELECT query failed: ${err.message}`)
            );
          } else {
            this.logger.info("Firebird SELECT query executed successfully", {
              component: "FirebirdDb",
              selQuery: query,
            });
          }
          resolve(rows);
        });
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Firebird SELECT query failed: ${error.message}`);
      } else {
        throw new Error(
          `Firebird SELECT query failed: An unknown error occurred`
        );
      }
    } finally {
      if (connection) {
        this.releaseConnection(connection);
      }
    }
  }

  /**
   * Выполняет INSERT, UPDATE, DELETE-запрос с параметрами.
   * @param query - SQL-запрос.
   * @param params - Массив параметров для запроса.
   * @returns Promise<void> - Promise, который разрешается после успешного выполнения.
   */
  public async executeNonQuery(
    query: string,
    params: any[] = []
  ): Promise<void> {
    let connection: PooledConnection | null = null;
    try {
      connection = await this.getConnection();
      await new Promise<void>((resolve, reject) => {
        connection!.query(query, params, (err: Error | null, result: any) => {
          if (err) {
            this.logger.error(
              "FirebirdDb: Error executing non-query (INSERT/UPDATE/DELETE)!",
              { component: "FirebirdDb", error: err }
            );
            return reject(
              new Error(`Firebird non-query failed: ${err.message}`)
            );
          }
          this.logger.info("FirebirdDb: Non-query executed successfully.", {
            query: query,
          });

          resolve();
        });
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Firebird non-query failed: ${error.message}`);
      } else {
        throw new Error(`Firebird non-query failed: An unknown error occurred`);
      }
    } finally {
      if (connection) {
        this.releaseConnection(connection);
      }
    }
  }

  /**
   * Выполняет хранимую процедуру с параметрами.
   * @param procedureName - Имя хранимой процедуры.
   * @param params - Массив параметров для хранимой процедуры.
   * @returns Promise<T[]> - Promise, который разрешается массивом результатов, если процедура возвращает данные.
   */
  public async executeStoredProcedure<T>(
    procedureName: string,
    params: any[] = []
  ): Promise<T[]> {
    let connection: PooledConnection | null = null;
    try {
      connection = await this.getConnection();
      const result = await new Promise<T[]>((resolve, reject) => {
        const placeholders = params.map(() => "?").join(",");
        const query = `EXECUTE PROCEDURE ${procedureName} ${
          placeholders ? placeholders : ""
        }`; // Добавляем заглушки только если есть параметры
        connection!.query(query, params, (err: Error | null, rows: T[]) => {
          if (err) {
            this.logger.error(
              `FirebirdDb: Error executing stored procedure "${procedureName}"!`,
              { error: err, params }
            );
            return reject(
              new Error(`Firebird stored procedure failed: ${err.message}`)
            );
          }
          resolve(rows);
        });
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Firebird stored procedure failed: ${error.message}`);
      } else {
        throw new Error(
          `Firebird stored procedure failed: An unknown error occurred`
        );
      }
    } finally {
      if (connection) {
        this.releaseConnection(connection);
      }
    }
  }

  /**
   * Закрывает все соединения в пуле. Вызывается при завершении работы приложения.
   */
  public async closeAllConnections(): Promise<void> {
    this.logger.info("FirebirdDb: Closing all connections in the pool...");
    const closePromises = this.pool.map((conn) => {
      return new Promise<void>((resolve, reject) => {
        if (conn) {
          conn.detach((err: Error | null) => {
            if (err) {
              console.error(
                "FirebirdDb: Error detaching pooled connection!",
                err
              );
              return reject(err);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
    await Promise.allSettled(closePromises); // Ждем завершения всех попыток закрытия
    this.pool = []; // Очищаем пул
    this.logger.info("FirebirdDb: All connections in pool closed.");
    console.log("FirebirdDb: All connections in pool closed.");
  }

  /**
   * Очищает пул от старых и неактивных соединений.
   */
  private cleanupPool(): void {
    const now = Date.now();
    const oldPoolSize = this.pool.length;
    this.pool = this.pool.filter((conn) => {
      // Если соединение занято или использовалось недавно, оставляем его
      if (conn.isBusy || now - conn.lastUsed < this.connectionTimeout) {
        return true;
      }
      // Если соединение неактивно и истек таймаут, закрываем его и удаляем
      if (conn) {
        conn.detach((err: Error | null) => {
          if (err)
            this.logger.error(
              "FirebirdDb: Error detaching idle connection during cleanup:",
              { component: "FirebirdDb", error: err }
            );
          else
            console.log("FirebirdDb: Idle connection detached during cleanup.");
        });
      }
      return false;
    });
    if (this.pool.length < oldPoolSize) {
      this.logger.info(
        `FirebirdDb: Cleaned up ${
          oldPoolSize - this.pool.length
        } idle connections.`
      );
    }
  }
}

// Экспортируем экземпляр класса
export const firebirdDb = new FirebirdDb();
