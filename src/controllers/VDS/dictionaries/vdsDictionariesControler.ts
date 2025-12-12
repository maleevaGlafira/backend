import { Request, Response } from "express";
import {
  vdsApplicant,
  vdsDamagePlace,
  vdsMessageTypes,
  vdsDamageType,
  vdsDistricts,
} from "../../../services/VDS/dictionaries/vdsReference.cache";

import { DictionaryItem } from "../../../types/dictionaries";
import { BaseDictionariesController } from "../../dictionaries/baseDictionaryController";

export class vdsDictionariesController extends BaseDictionariesController {
  static context = "vdsDictionariesController";

  // // Загальний метод для отримання словників
  // private static async fetchDictionary(
  //   req: Request,
  //   res: Response,

  //   getDataFn: getDataFunction,
  //   net: string,
  //   dictionaryName: string
  // ) {
  //   logger.info(`GET /api/${net}/dictionaries/${dictionaryName}: `, {
  //     context: `${net}DictionariesController`,
  //   });
  //   try {
  //     const items = await getDataFn();
  //     res.json(items);
  //   } catch (error) {
  //     console.error(`Error fetching ${dictionaryName}:`, error);
  //     res.status(500).json({ error: `Failed to load ${dictionaryName}` });
  //   }
  // }

  // GET /api/VDS/dictionaries/Applicants
  public static async getApplicant(req: Request, res: Response) {
    await vdsDictionariesController.fetchDictionary(req, res, vdsApplicant);
  }
  // GET /api/VDS/dictionaries/DamagePlaces

  public static async getDamagePlace(req: Request, res: Response) {
    await vdsDictionariesController.fetchDictionary(req, res, vdsDamagePlace);
  }

  // GET /api/VDS/dictionaries/DamageTypes
  public static async getDamageType(req: Request, res: Response) {
    await vdsDictionariesController.fetchDictionary(req, res, vdsDamageType);
  }

  // GET /api/VDS/dictionaries/Districts
  public static async getDistricts(req: Request, res: Response) {
    await vdsDictionariesController.fetchDictionary(req, res, vdsDistricts);
  }

  // GET /api/VDS/dictionaries/Messagetypes
  public static async getMessagetype(req: Request, res: Response) {
    const func = async function (): Promise<DictionaryItem[]> {
      return await vdsMessageTypes.getData();
    };
    await vdsDictionariesController.fetchDictionary(req, res, vdsMessageTypes);
  }
  //   // GET /api/VDS/dictionaries/Applicants
  //   public static async getApplicant(req: Request, res: Response) {
  //     logger.info("GET /api/VDS/dictionaries/Applicants: ", {
  //       context: nsDictionariesController.context,
  //     });
  //     try {
  //       const items = await vdsApplicant.getData();
  //       res.json(items);
  //     } catch (error) {
  //       console.error("Error fetching damage localities:", error);
  //       res.status(500).json({ error: "Failed to load applicant" });
  //     }
  //   }

  //   public static async getDamagePlace(req: Request, res: Response) {
  //     logger.info("GET /api/VDS/dictionaries/DamagePlaces: ", {
  //       context: nsDictionariesController.context,
  //     });
  //     try {
  //       const items = await vdsDamagePlace.getData();
  //       res.json(items);
  //     } catch (error) {
  //       console.error("Error fetching damage localities:", error);
  //       res.status(500).json({ error: "Failed to load damage places" });
  //     }
  //   }
}
