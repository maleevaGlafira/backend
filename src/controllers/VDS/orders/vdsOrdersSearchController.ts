import { Request, Response } from "express";
import { OrdersFilter } from "../../../types/VDS/orders/ordersTypes";
import { OrdersVDSSearchService } from "../../../services/VDS/orders/ordersVdsSearchService";
import logger from "../../../config/logger";

// Создаём экземпляр сервиса (в реальном проекте лучше внедрять через DI)
const ordersSearchService = new OrdersVDSSearchService();
export class VdsOrdersController {
  public static context = "VdsOrdersController";
  public static async searchOrdersVDS(req: Request, res: Response) {
    logger.info("post /api/vds/SearchOrders: ", {
      context: VdsOrdersController.context,
    });
    try {
      const filter = req.body as OrdersFilter;

      // Валидация обязательных полей (даты)
      if (!filter.dateComingFrom) {
        logger.error("Поля dateComingFrom і dateComingTo обов'язкові.", {
          context: VdsOrdersController.context,
        });
        return res.status(400).json({
          error: "Поля dateComingFrom і dateComingTo обов'язкові.",
          details: 'Формат: "dd.mm.yyyy" или "dd.mm.yyyy HH:mm"',
        });
      }

      // Выполняем поиск
      console.log("Start search");
      const result = await ordersSearchService.search(filter);

      // Успешный ответ
      logger.info("Result OK", {
        context: VdsOrdersController.context,
      });
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error?.message);
      logger.error("Помилка пошуку нарядів:", {
        error,
        context: VdsOrdersController.context,
      });

      // Ошибки парсинга даты или SQL — возвращаем 400
      if (
        error.message?.includes("формат дати") ||
        error.message?.includes("Invalid date")
      ) {
        return res.status(400).json({
          error: "Невірний формат дати",
          details: error.message,
        });
      }

      // Любая другая ошибка — 500
      return res.status(500).json({
        error: "Внутрішня помилка серверу",
      });
    }
  }
}
