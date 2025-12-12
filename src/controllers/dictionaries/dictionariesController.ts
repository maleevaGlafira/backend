import { Request, Response } from "express";

import { RegionsService } from "../../services/dictionaries/Regions/RegionsService";
import { StreetsService } from "../../services/dictionaries/Streets/streetService";
import { OfficialsService } from "../../services/dictionaries/officials/OfficialsService";
import logger from "../../config/logger";

import {
  regions,
  streets,
  officials,
  brigadiers,
  reus,
  organisations,
  typeWorks,
} from "../../services/dictionaries/reference.cache";
import { BaseDictionariesController } from "./baseDictionaryController";

const streetService = new StreetsService();

export class DictionariesController extends BaseDictionariesController {
  static context = "DictionariesController";
  // GET /api/dictionaries/regions
  public static async getRegions(req: Request, res: Response) {
    logger.info("GET /api/dictionaries/regions: ", {
      context: DictionariesController.context,
    });
    const items = await regions.getData();
    res.json(items);
  }

  // GET /api/dictionaries/streets
  public static async getStreets(req: Request, res: Response) {
    logger.info("GET /api/dictionaries/streets: ", {
      context: DictionariesController.context,
    });
    try {
      const items = await streetService.getData();
      res.json(items);
    } catch (error) {
      console.error("Error fetching damage localities:", error);
      res.status(500).json({ error: "Failed to load streets" });
    }
  }

  // GET /api/dictionaries/officials:
  public static async getOfficials(req: Request, res: Response) {
    logger.info("GET /api/dictionaries/officials: ", {
      context: DictionariesController.context,
    });
    try {
      const items = await officials.getData();
      res.json(items);
    } catch (error) {
      console.error("Error fetching damage localities:", error);
      res.status(500).json({ error: "Failed to load officials" });
    }
  }

  // GET /api/dictionaries/brigadiers
  public static async getBrigadier(req: Request, res: Response) {
    await DictionariesController.fetchDictionary(req, res, brigadiers);
  }

  // GET /api/dictionaries/reus
  public static async getReu(req: Request, res: Response) {
    await DictionariesController.fetchDictionary(req, res, reus);
  }

  // GET /api/dictionaries/organisations
  public static async getOrganisation(req: Request, res: Response) {
    await DictionariesController.fetchDictionary(req, res, organisations);
  }

  // GET /api/dictionaries/typeWorks
  public static async getTypeWorks(req: Request, res: Response) {
    await DictionariesController.fetchDictionary(req, res, typeWorks);
  }
}
