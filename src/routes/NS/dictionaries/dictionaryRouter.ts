import { Router } from "express";
import { nsDictionariesController } from "../../../controllers/NS/dictionaries/nsDictionariesController";

//  ../controllers/ordersController";

const router = Router();
// GET /api/NS/dictionaries/damage-localities
router.get("/damage-localities", nsDictionariesController.getDamageLocalities);
// GET /api/NS/dictionaries/damage-places
router.get("/damage-places", nsDictionariesController.getDamagePlaces);
// GET /api/NS/dictionaries/damage-types
router.get("/damage-types", nsDictionariesController.getDamageTypes);

export default router;
