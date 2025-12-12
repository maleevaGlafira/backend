import { Request, Response } from "express";
import { OrdersSearchService } from "../../../services/NS/orderSearch/orderSearchService";
import { resultOrderList } from "../../../types/NS/orders/orderTypes";
import logger from "../../../config/logger";
import { query } from "mssql";

let regionIds: number[] | undefined;

function rawIds(raw: string | undefined): number[] | undefined {
  if (raw) {
    // поддерживаем и CSV формат ("1,2,3"), и одиночное число
    regionIds = raw
      .split(",")
      .map((id) => Number(id.trim()))
      .filter(Boolean);
    return regionIds;
  }
  return undefined;
}

const service = new OrdersSearchService();

export class OrdersController {
  public static context = "OrdersController";
  public static async getOrders(req: Request, res: Response): Promise<void> {
    logger.info("GET /api/ns/SearchOrders: ", {
      context: OrdersController.context,
      query: req.query,
    });
    try {
      const rawRegion = req.query.regionId as string | undefined;
      regionIds = rawIds(rawRegion);
      const orderNumber = Number(req.query.orderNumber);
      const filters = {
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        dateClosedFrom: req.query.dateClosedFrom as string,
        dateClosedTo: req.query.dateClosedTo as string,
        orderNumber: orderNumber,
        regionIds: regionIds,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 50,
      };
      logger.info(filters);

      const result = await service.getOrders(filters);
      res.json({
        success: true,
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        filter: result.filter,
        data: result.data,
      });
    } catch (error) {
      logger.error("GET /api/ns/SearchOrders: error", error as Error, {
        context: OrdersController.context,
      });

      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}
