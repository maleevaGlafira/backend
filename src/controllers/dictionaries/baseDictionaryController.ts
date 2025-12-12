import { Response, Request } from "express";
import logger from "../../config/logger";
import { getDataFunction } from "../../services/dictionaries/BaseDictionary/BaseDictionaryService";
import { TBaseDictionaryService } from "../../services/dictionaries/BaseDictionary/BaseDictionaryService";

export class BaseDictionariesController {
  static context = "vdsDictionariesController";

  // Загальний метод для отримання словників
  protected static async fetchDictionary(
    req: Request,
    res: Response,
    dictionary: TBaseDictionaryService
  ) {
    logger.info(
      `GET /api/${dictionary.net}/dictionaries/${dictionary.component}: `,
      {
        context: `${dictionary.net}DictionariesController`,
      }
    );
    try {
      const items = await dictionary.getData();
      res.json(items);
    } catch (error) {
      console.error(`Error fetching ${dictionary.component}:`, error);
      res.status(500).json({ error: `Failed to load ${dictionary.component}` });
    }
  }
}
