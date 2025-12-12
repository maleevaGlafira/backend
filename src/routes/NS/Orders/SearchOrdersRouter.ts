import { Router } from "express";
import { OrdersController } from "../../../controllers/NS/orders/nsOrderSearchController";
//  ../controllers/ordersController";

const router = Router();

router.get("/", OrdersController.getOrders);

export default router;
