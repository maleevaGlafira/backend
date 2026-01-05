import { Router } from "express";
import { DictionariesController } from "../../controllers/dictionaries/dictionariesController";
import { AllDictionariesController } from "../../controllers/dictionaries/alldictionaries";
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
router.get("/typeWorks", DictionariesController.getTypeWorks);
//GET /api/dictionaries/all;
router.get("/all", AllDictionariesController.getAll);

export default router;
