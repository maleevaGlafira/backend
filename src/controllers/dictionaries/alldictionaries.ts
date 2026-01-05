import { Response, Request } from "express";
import {
  regions,
  streets,
  officials,
  brigadiers,
  reus,
  organisations,
  typeWorks,
  tubeDiameters,
  workers,
} from "../../services/dictionaries/reference.cache";
import {
  vdsApplicant,
  vdsDamagePlace,
  vdsDamageType,
  vdsDistricts,
  vdsMessageTypes,
} from "../../services/VDS/dictionaries/vdsReference.cache";
import {
  nsDamageLocality,
  nsDamagePlace,
  nsDamageType,
  nsExcavationTypes,
  nsMessageTypes,
  nsSoil,
  nsTubeDiameters,
  nsTubeMaterial,
} from "../../services/NS/dictionaries/NsReferences.chache";
import {
  AllDictionariesResponse,
  DictionaryData,
} from "../../types/dictionaries";
import logger from "../../config/logger";

export class AllDictionariesController {
  static context = "allDictionariesController";
  // Группируем источники данных по категориям
  private static dictionarySources = {
    common: [
      { key: "regions", fetch: regions.getData.bind(regions) },
      { key: "streets", fetch: streets.getData.bind(streets) },
      { key: "officials", fetch: officials.getData.bind(officials) },
      { key: "brigadiers", fetch: brigadiers.getData.bind(brigadiers) },
      {
        key: "organizations",
        fetch: organisations.getData.bind(organisations),
      },
      { key: "reus", fetch: reus.getData.bind(reus) },
      { key: "typeWorks", fetch: typeWorks.getData.bind(typeWorks) },
      {
        key: "tubeDiameters",
        fetch: tubeDiameters.getData.bind(tubeDiameters),
      },
      {
        key: "workers",
        fetch: workers.getData.bind(workers),
      },
    ],
    vds: [
      { key: "vdsApplicants", fetch: vdsApplicant.getData.bind(vdsApplicant) },
      {
        key: "vdsDamagePlaces",
        fetch: vdsDamagePlace.getData.bind(vdsDamagePlace),
      },
      {
        key: "vdsDamageTypes",
        fetch: vdsDamageType.getData.bind(vdsDamageType),
      },
      {
        key: "vdsMessageTypes",
        fetch: vdsMessageTypes.getData.bind(vdsMessageTypes),
      },
      { key: "vdsDistricts", fetch: vdsDistricts.getData.bind(vdsDistricts) },
    ],
    ns: [
      {
        key: "nsDamageLocalities",
        fetch: nsDamageLocality.getData.bind(nsDamageLocality),
      },
      {
        key: "nsDamagePlaces",
        fetch: nsDamagePlace.getData.bind(nsDamagePlace),
      },
      { key: "nsDamageTypes", fetch: nsDamageType.getData.bind(nsDamageType) },
      {
        key: "nsMessageTypes",
        fetch: nsMessageTypes.getData.bind(nsMessageTypes),
      },
      {
        key: "nsTubeDiameters",
        fetch: nsTubeDiameters.getData.bind(nsTubeDiameters),
      },
      {
        key: "nsSoil",
        fetch: nsSoil.getData.bind(nsSoil),
      },
      {
        key: "nsTuneMaterials",
        fetch: nsTubeMaterial.getData.bind(nsTubeMaterial),
      },
      {
        key: "nsExcavationTypes",
        fetch: nsExcavationTypes.getData.bind(nsExcavationTypes),
      },
    ],
  };

  // Вспомогательный метод для параллельной загрузки одной группы
  private static async loadGroup(
    group: typeof AllDictionariesController.dictionarySources.common
  ) {
    const promises = group.map(({ key, fetch }) =>
      fetch()
        .then((data) => ({ key, data }))
        .catch((error) => ({ key, error }))
    );

    const results = await Promise.all(promises);

    const data: DictionaryData = {};
    const errors: string[] = [];

    for (const result of results) {
      if ("error" in result) {
        errors.push(`Failed to load ${result.key}: ${result.error.message}`);
        data[result.key] = []; // fallback на пустой массив
      } else {
        data[result.key] = result.data;
      }
    }

    return { data, errors };
  }

  // GET /api/dictionaries/all
  public static async getAll(req: Request, resp: Response) {
    logger.info("get /api/dictionaries/all", {
      context: AllDictionariesController.context,
    });

    try {
      // Загружаем все группы параллельно
      const [common, vds, ns] = await Promise.all([
        AllDictionariesController.loadGroup(
          AllDictionariesController.dictionarySources.common
        ),
        AllDictionariesController.loadGroup(
          AllDictionariesController.dictionarySources.vds
        ),
        AllDictionariesController.loadGroup(
          AllDictionariesController.dictionarySources.ns
        ),
      ]);

      // Собираем все ошибки
      const allErrors = [...common.errors, ...vds.errors, ...ns.errors];

      if (allErrors.length > 0) {
        logger.warn("Partial failure while loading dictionaries", {
          errors: allErrors,
        });
        // Можно решить: возвращать 206 Partial Content или всё равно 200 с данными + предупреждением
      }

      const result: AllDictionariesResponse = {
        common: common.data,
        vds: vds.data,
        ns: ns.data,
      };
      resp.json(result);
    } catch (error: any) {
      logger.error("Unexpected error in getAll dictionaries", {
        error: error.message,
        stack: error.stack,
        context: AllDictionariesController.context,
      });

      resp.status(500).json({ error: "Failed to load dictionaries" });
    }
  }
}
