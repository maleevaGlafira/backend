// services/DamageTypeService.ts

import { firebirdDb } from "../../../../db/FirebirdDb";
import { getDamageTypesQuery } from "../queries";
import { DamageTypeItem } from "../../../../types/dictionaries";
import { TDictionaryService } from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

export class DamageTypeService implements TDictionaryService<DamageTypeItem> {
  private db = firebirdDb;
  private data: DamageTypeItem[] = [];
  public net = "NS";
  public component = "DamageTypeService";

  public async getData(): Promise<DamageTypeItem[]> {
    if (this.data.length == 0) {
      const items = await this.db.executeSelect<{
        ID: number;
        NAME_RU: string;
        NAME_UKR: string;
      }>(getDamageTypesQuery);

      this.data = items.map((el) => mapDamageType(el));
    }
    return this.data;
  }

  public getItemById(id: number | null): DamageTypeItem | null {
    if (!id) return null;
    if (this.data.length == 0) {
      return null;
    }
    const item = this.data.find((el) => el.id == id);
    return item ?? null;
  }
}

function mapDamageType(row: {
  ID: number;
  NAME_RU: string;
  NAME_UKR: string;
}): DamageTypeItem {
  return {
    id: row.ID,
    name_ru: row.NAME_RU ? row.NAME_RU.trim() : "",
    name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : "",
  };
}
