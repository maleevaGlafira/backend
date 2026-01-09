import { Request, Response } from "express";
import { OrdersSearchService } from "../../../services/NS/orderSearch/orderSearchService";
import {
  OrderUniSearchFilters,
  resultOrderList,
} from "../../../types/NS/orders/orderTypes";
import logger from "../../../config/logger";
import { query } from "mssql";

let regionIds: number[] | undefined;

function rawIds(raw: string | undefined): number[] | undefined {
  if (raw) {
    if (Array.isArray(raw)) return raw;
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

  private static extractFilters(source: any): OrderUniSearchFilters {
    const regionIds = rawIds(source.regionIds);

    const orderNumberRaw = source.orderNumber;
    const orderNumber =
      orderNumberRaw != null ? Number(orderNumberRaw) : undefined;

    return {
      orderNumber: isNaN(orderNumber as number) ? 0 : orderNumber,
      isClosed: source.isClosed,
      dateFrom: source.dateFrom as string | undefined,
      dateTo: source.dateTo as string | undefined,
      dateClosedFrom: source.dateClosedFrom as string | undefined,
      dateClosedTo: source.dateClosedTo as string | undefined,

      regionIds,
      streetsIds: rawIds(source.streetsIds),
      houseNum: source.houseNum as string | undefined,

      organizationIds: rawIds(source.organizationIds),
      damageTypeIds: rawIds(source.damageTypeIds),
      damagePlaceIds: rawIds(source.damagePlaceIds),
      damageLocalityIds: rawIds(source.damageLocalityIds),
      addDamageLocalityIds: rawIds(source.addDamageLocalityIds),
      messageTypesIds: rawIds(source.messageTypesIds),

      brigadierIds: rawIds(source.brigadierIds),
      officialIds: rawIds(source.officialIds),
      officialClosedIds: rawIds(source.officialClosedIds),

      tubeMaterialIds: rawIds(source.tubeMaterialIds),
      tubeDiameterIds: rawIds(source.tubeDiameterIds),
      LastExwTypeIds: rawIds(source.LastExwTypeIds),

      page: source.page ? Number(source.page) : 1,
      limit: source.limit ? Number(source.limit) : 50,
    };
  }

  private static async getData(
    source: any,
    isPost: boolean = false
  ): Promise<resultOrderList> {
    const filters = OrdersController.extractFilters(source);

    logger.info("Filters for search orders:", filters);

    const result = await service.getOrders(filters, isPost);

    return {
      success: true,
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      filter: result.filter,
      data: result.data,
    };
  }

  public static async getOrders(req: Request, res: Response): Promise<void> {
    logger.info("GET /api/ns/SearchOrders: ", {
      context: OrdersController.context,
      query: req.query,
    });
    const query = req.query;
    try {
      const result = await OrdersController.getData(query);
      res.json(result);
    } catch (error) {
      logger.error("GET /api/ns/SearchOrders: error", error as Error, {
        context: OrdersController.context,
      });

      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  public static async postReceiveOrders(
    req: Request,
    res: Response
  ): Promise<void> {
    logger.info("POST /api/ns/SearchOrders", {
      context: OrdersController.context,
      body: req.body,
    });

    try {
      const result = await OrdersController.getData(req.body, true);
      res.json(result);
    } catch (error) {
      logger.error("Error in POST /api/ns/SearchOrders", error as Error, {
        context: OrdersController.context,
      });

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
