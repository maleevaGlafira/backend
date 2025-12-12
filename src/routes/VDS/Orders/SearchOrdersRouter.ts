import { Router } from "express";
import { VdsOrdersController } from "../../../controllers/VDS/orders/vdsOrdersSearchController";

const ordersVDSRouter = Router();

/**
 * @route   POST /api/orders-vds/search
 * @desc    Поиск нарядов аварийных работ с фильтрацией
 * @body    OrdersFilter (см. интерфейс)
 * @access  Public (или защищён middleware, если нужно)
 */
ordersVDSRouter.post("/search", VdsOrdersController.searchOrdersVDS);

export default ordersVDSRouter;
