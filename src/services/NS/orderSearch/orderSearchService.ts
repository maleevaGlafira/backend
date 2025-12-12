import { firebirdDb } from "../../../db/FirebirdDb";
import { QueryWithParams } from "../../services/helpTypes";
import { buildOrdersQuery } from "./ordersSearchQueries";
import logger from "../../../config/logger";
import {
  Order,
  OrderUniSearchFilters,
} from "../../../types/NS/orders/orderTypes";

function orderMapper(o: Order): Order {
  return { ...o, netType: "NS" };
}

export class OrdersSearchService {
  private db = firebirdDb;

  public async getOrders(filters: OrderUniSearchFilters): Promise<{
    total: number;
    data: Order[];
    filter: any;
  }> {
    logger.info("Get orders ns seaqrch ", {
      compontent: "OrdersSearchService",
    });
    try {
      const queryParams = buildOrdersQuery(filters);

      const [data, totalResult] = await Promise.all([
        this.db.executeSelect<Order>(queryParams.sql, [...queryParams.params]),
        this.db.executeSelect<{ TOTAL: number }>(queryParams.countSql, [
          ...queryParams.params,
        ]),
      ]);

      return {
        total: totalResult[0]?.TOTAL ?? 0,
        data: data.map((o) => orderMapper(o)),
        filter: queryParams.newFilter,
      };
    } catch (err) {
      logger.error("Get Ns orders from base ", err, { context: "getOrders" });
      throw err;
    }
  }
}
