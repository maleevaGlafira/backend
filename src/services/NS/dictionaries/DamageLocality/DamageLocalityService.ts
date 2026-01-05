// services/DamageLocalityService.ts

import { firebirdDb } from "../../../../db/FirebirdDb";
import { getDamageLocalitiesQuery } from "../queries";
import { DamageLocalityItem } from "../../../../types/dictionaries";
import { TDictionaryService } from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

export class DamageLocalityService
  implements TDictionaryService<DamageLocalityItem>
{
  private db = firebirdDb;
  private data: DamageLocalityItem[] = [];

  public net = "NS";
  public component = "DamageLocalityService";

  public async getData(): Promise<DamageLocalityItem[]> {
    if (this.data.length == 0) {
      const items = await this.db.executeSelect<{
        ID: number;
        NAME_RU: string;
        NAME_UKR: string;
        CLASSNUMBER: number | null;
      }>(getDamageLocalitiesQuery);

      this.data = items.map((el) => mapDamageLocality(el));
    }
    return this.data;
  }

  public getItemById(id: number | null): DamageLocalityItem | null {
    if (!id) return null;
    if (this.data.length == 0) {
      return null;
    }
    const item = this.data.find((el) => el.id == id);
    return item ?? null;
  }
}

function mapDamageLocality(row: {
  ID: number;
  NAME_RU: string;
  NAME_UKR: string;
  CLASSNUMBER: number | null;
}): DamageLocalityItem {
  return {
    id: row.ID,
    name_ru: row.NAME_RU ? row.NAME_RU.trim() : "",
    name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : "",
    classNumber: row.CLASSNUMBER ?? null,
  };
}
