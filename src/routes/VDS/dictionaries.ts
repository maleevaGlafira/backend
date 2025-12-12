import { Router } from "express";

import { vdsDictionariesController } from "../../controllers/VDS/dictionaries/vdsDictionariesControler";

const router = Router();
router.get("/DamagePlaces", vdsDictionariesController.getDamagePlace);
router.get("/DamageTypes", vdsDictionariesController.getDamageType);
router.get("/MessageTypes", vdsDictionariesController.getMessagetype);
router.get("/Applicants", vdsDictionariesController.getApplicant);
router.get("/Districts", vdsDictionariesController.getDistricts);

export default router;
