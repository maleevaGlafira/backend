import { Request, Response } from "express";
import { DamageLocalityService } from "../../../services/NS/dictionaries/DamageLocality/DamageLocalityService";

import { DamagePlaceService } from "../../../services/NS/dictionaries/DamagePlace/DamagePlaceService";
import { DamageTypeService } from "../../../services/NS/dictionaries/DamaType/DamageTypeService";

import logger from "../../../config/logger";

// Создаём инстансы сервисов (можно использовать DI, но для простоты — напрямую)
const damageLocalityService = new DamageLocalityService();
const damagePlaceService = new DamagePlaceService();
const damageTypeService = new DamageTypeService();

export class nsDictionariesController {
  static context = "nsDictionariesController";
  // GET /api/NS/dictionaries/damage-localities
  public static async getDamageLocalities(req: Request, res: Response) {
    logger.info("GET /api/NS/dictionaries/damage-localities: ", {
      context: nsDictionariesController.context,
    });
    try {
      const items = await damageLocalityService.getData();
      res.json(items);
    } catch (error) {
      console.error("Error fetching damage localities:", error);
      res.status(500).json({ error: "Failed to load damage localities" });
    }
  }

  // GET /api/NS/dictionaries/damage-places
  public static async getDamagePlaces(req: Request, res: Response) {
    logger.info("GET /api/NS/dictionaries/damage-places: ", {
      context: nsDictionariesController.context,
    });
    try {
      const items = await damagePlaceService.getData();
      res.json(items);
    } catch (error) {
      console.error("Error fetching damage places:", error);
      res.status(500).json({ error: "Failed to load damage places" });
    }
  }

  // GET /api/dictionaries/damage-types
  public static async getDamageTypes(req: Request, res: Response) {
    logger.info("GET /api/NS/dictionaries/damage-types: ", {
      context: nsDictionariesController.context,
    });
    try {
      const items = await damageTypeService.getData();
      res.json(items);
    } catch (error) {
      console.error("Error fetching damage types:", error);
      res.status(500).json({ error: "Failed to load damage types" });
    }
  }
}
