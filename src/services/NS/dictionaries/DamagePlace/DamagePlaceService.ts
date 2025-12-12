// services/DamagePlaceService.ts

import { firebirdDb } from "../../../../db/FirebirdDb";
import { getDamagePlacesQuery } from "../queries";
import { DamagePlaceItem } from "../../../../types/dictionaries";
import { TDictionaryService } from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

export class DamagePlaceService implements TDictionaryService<DamagePlaceItem> {
  private db = firebirdDb;
  private data: DamagePlaceItem[] = [];
  public net = "NS";
  public component = "DamageLocalityService";

  public async getData(): Promise<DamagePlaceItem[]> {
    if (this.data.length == 0) {
      const items = await this.db.executeSelect<{
        ID: number;
        NAME_RU: string;
        NAME_UKR: string;
        CHACK_DIAM: number | null; // ← уточните точное имя колонки!
      }>(getDamagePlacesQuery);

      this.data = items.map((el) => mapDamagePlace(el));
    }
    return this.data;
  }
}

function mapDamagePlace(row: {
  ID: number;
  NAME_RU: string;
  NAME_UKR: string;
  CHACK_DIAM: number | null;
}): DamagePlaceItem {
  return {
    id: row.ID,
    name_ru: row.NAME_RU ? row.NAME_RU.trim() : "",
    name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : "",
    chackDiam: row.CHACK_DIAM, // ← соответствие имени из БД
  };
}
