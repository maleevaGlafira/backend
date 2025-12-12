import { Router } from "express";
import { DictionariesController } from "../../controllers/dictionaries/dictionariesController";

//  ../controllers/ordersController";

const router = Router();
// GET /api/dictionary/regions
router.get("/regions", DictionariesController.getRegions);
// GET /api/dictionary/streets
router.get("/streets", DictionariesController.getStreets);
// GET /api/dictionary/officials
router.get("/officials", DictionariesController.getOfficials);
//GET /api/dictionaries/brigadier
router.get("/brigadiers", DictionariesController.getBrigadier);
//GET /api/dictionaries/reus
router.get("/reus", DictionariesController.getReu);
//GET /api/dictionaries/organisations
router.get("/organisations", DictionariesController.getOrganisation);
//GET /api/dictionaries/typeWorks
router.get("/typeWorks", DictionariesController.getOrganisation);
export default router;
