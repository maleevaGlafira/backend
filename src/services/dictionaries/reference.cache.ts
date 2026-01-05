import { BrigadiersService } from "./BrigadiersService/BrigadiersService";
import { OrganisatrionService } from "./Organsation/OrganisationService";
import { RegionsService } from "./Regions/RegionsService";
import { StreetsService } from "./Streets/streetService";
import { TypeWorkService } from "./TypeWorks/TypeWorkService";
import { OfficialsService } from "./officials/OfficialsService";
import { TubeDiametersService } from "./TubeDiameters/TubeDiametersService";
import { WorkersService } from "./WorkersService/WorkersService";
import logger from "../../config/logger";
import {
  BrigadierItem,
  DamageLocalityItem,
  DamagePlaceItem,
  DictionaryItem,
  ExcavationTypeItem,
  MessageTypesItem,
  RegionItem,
  streetItem,
  TubeDiametersItem,
  WorkerItem,
} from "../../types/dictionaries";
import { DamageLocalityService } from "../NS/dictionaries/DamageLocality/DamageLocalityService";
import { DamagePlaceService } from "../NS/dictionaries/DamagePlace/DamagePlaceService";
import { DamageTypeService } from "../NS/dictionaries/DamaType/DamageTypeService";
import { MessageTypesService } from "../NS/dictionaries/MessageTypes/MessageTypeService";
import { ApplicantService } from "../VDS/dictionaries/Applicant/ApplicantService";
import { DamagePlaceService as vdsDamagePlaceService } from "../VDS/dictionaries/DamagePlace/DamagePlaceService";
import { DamageTypeService as vdsDamageTypeService } from "../VDS/dictionaries/DamageType/DamageTypeService";
import { MessageTypeService as vdsMessageTypeService } from "../VDS/dictionaries/MessageType/MessageTypeService";
import { DistrictsService } from "../VDS/dictionaries/District/DistrictService";

import {
  nsDamageLocality,
  nsDamagePlace,
  nsDamageType,
  nsExcavationTypes,
  nsMessageTypes,
  nsSoil,
  nsTubeDiameters,
  nsTubeMaterial,
} from "../NS/dictionaries/NsReferences.chache";

export const regions = new RegionsService();
export const streets = new StreetsService();
export const officials = new OfficialsService();
export const brigadiers = new BrigadiersService();
export const organisations = new OrganisatrionService();
export const reus = new RegionsService();
export const typeWorks = new TypeWorkService();
export const tubeDiameters = new TubeDiametersService();
export const workers = new WorkersService();

// export const nsDamageLocality = new DamageLocalityService();
// export const nsDamagePlace = new DamagePlaceService();
// export const nsDamageType = new DamageTypeService();
// export const nsMessageTypes = new MessageTypesService();
// export const nsTubeDiameters = new TubeDiametersService();

export const vdsApplicant = new ApplicantService();
export const vdsDamagePlace = new vdsDamagePlaceService();
export const vdsDamageType = new vdsDamageTypeService();
export const vdsMessageType = new vdsMessageTypeService();
export const vdsDistrict = new DistrictsService();

export const mainCache = {
  regions: [] as RegionItem[],
  streets: [] as streetItem[],
  officials: [] as DictionaryItem[],
  brigadiers: [] as BrigadierItem[],
  organizations: [] as DictionaryItem[],
  reus: [] as DictionaryItem[],
  typeWorks: [] as DictionaryItem[],
  tubeDiameters: [] as TubeDiametersItem[],
  workers: [] as WorkerItem[],
  nsDamagePlace: [] as DamagePlaceItem[],
  nsDamageLocality: [] as DamageLocalityItem[],
  nsDamageType: [] as DictionaryItem[],
  nsMessageType: [] as MessageTypesItem[],
  nsSoil: [] as DictionaryItem[],
  nsTubeMaterial: [] as DictionaryItem[],
  nsExcavationTypes: [] as ExcavationTypeItem[],

  vdsApplicants: [] as DictionaryItem[],
  vdsDamagePlaces: [] as DictionaryItem[],
  vdsDamageTypes: [] as DictionaryItem[],
  vdsMessageTypes: [] as MessageTypesItem[],
  vdsDistricts: [] as DictionaryItem[],

  updatedAt: new Date(0), // начальное значение
};

class MainDictionariesCache {
  // Определяем порядок и ключи для гибкости
  private static mainDictionaries = [
    { key: "regions", fetch: regions.getData.bind(regions) },
    { key: "streets", fetch: streets.getData.bind(streets) },
    { key: "officials", fetch: officials.getData.bind(officials) },
    { key: "brigadiers", fetch: brigadiers.getData.bind(brigadiers) },
    { key: "organizations", fetch: organisations.getData.bind(organisations) },
    { key: "reus", fetch: reus.getData.bind(reus) },
    { key: "typeWorks", fetch: typeWorks.getData.bind(typeWorks) },
    { key: "tubeDiameters", fetch: tubeDiameters.getData.bind(tubeDiameters) },
    { key: "workers", fetch: workers.getData.bind(workers) },

    { key: "nsDamagePlace", fetch: nsDamagePlace.getData.bind(nsDamagePlace) },
    {
      key: "nsDamageLocality",
      fetch: nsDamageLocality.getData.bind(nsDamageLocality),
    },
    { key: "nsDamageType", fetch: nsDamageType.getData.bind(nsDamageType) },
    {
      key: "nsMessageType",
      fetch: nsMessageTypes.getData.bind(nsMessageTypes),
    },
    {
      key: "nsSoil",
      fetch: nsSoil.getData.bind(nsSoil),
    },
    {
      key: "nsTubeMaterial",
      fetch: nsTubeMaterial.getData.bind(nsTubeMaterial),
    },
    {
      key: "nsExcavationTypes",
      fetch: nsExcavationTypes.getData.bind(nsExcavationTypes),
    },
    {
      key: "vdsApplicant",
      fetch: vdsApplicant.getData.bind(vdsApplicant),
    },
    {
      key: "vdsDamagePlace",
      fetch: vdsDamagePlace.getData.bind(vdsDamagePlace),
    },
    {
      key: "vdsDamageType",
      fetch: vdsDamageType.getData.bind(vdsDamageType),
    },
    {
      key: "vdsMessageType",
      fetch: vdsMessageType.getData.bind(vdsMessageType),
    },
    {
      key: "vdsDistrict",
      fetch: vdsDistrict.getData.bind(vdsDistrict),
    },
  ] as const;

  // Вспомогательная функция для загрузки с обработкой ошибок
  private static async loadWithFallback(
    fetch: () => Promise<any>,
    key: string
  ) {
    try {
      return await fetch();
    } catch (error) {
      logger.error(`Failed to load dictionary "${key}"`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return []; // fallback — пустой массив, чтобы приложение не падало
    }
  }

  static async loadMainCache(): Promise<void> {
    logger.info("Starting to load main dictionaries cache");

    try {
      const promises = MainDictionariesCache.mainDictionaries.map(
        ({ key, fetch }) =>
          MainDictionariesCache.loadWithFallback(fetch, key).then((data) => ({
            key,
            data,
          }))
      );

      const results = await Promise.all(promises);

      // Заполняем кэш
      for (const { key, data } of results) {
        // Типобезопасно присваиваем (благодаря as const выше)
        (mainCache as any)[key] = data;
      }

      mainCache.updatedAt = new Date();

      logger.info("Main dictionaries cache successfully loaded", {
        updatedAt: mainCache.updatedAt.toISOString(),
        counts: {
          regions: mainCache.regions.length,
          streets: mainCache.streets.length,
          officials: mainCache.officials.length,
          brigadiers: mainCache.brigadiers.length,
          organizations: mainCache.organizations.length,
          reus: mainCache.reus.length,
          typeWorks: mainCache.typeWorks.length,
          tubeDiameters: mainCache.tubeDiameters.length,
        },
      });
    } catch (error) {
      // Этот catch сработает только при критической ошибке (например, Promise.all rejected из-за unhandled)
      logger.error("Critical error while loading main cache", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }
}

export async function loadMainCache() {
  MainDictionariesCache.loadMainCache();
}
