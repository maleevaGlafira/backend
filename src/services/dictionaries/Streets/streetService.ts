import { firebirdDb } from "../../../db/FirebirdDb";
import { getStreetsQuery } from "../../NS/dictionaries/queries";
import { streetItem } from "../../../types/dictionaries";
import { TDictionaryService } from "../BaseDictionary/BaseDictionaryService";
import { publicDecrypt } from "crypto";

export class StreetsService implements TDictionaryService<streetItem> {
  private db = firebirdDb;
  public net = "All";
  public component = "StreetsService";
  private streets: streetItem[] = [];

  public async getData(): Promise<streetItem[]> {
    if (this.streets.length == 0) {
      const streets = await this.db.executeSelect<{
        ID: number;
        NAME_UKR: string;
        NAME_RU: string;
        ST_NAME_UKR: string | null;
        ST_NAME_RU: string | null;
      }>(getStreetsQuery);
      this.streets = streets.map((street) => streetMap(street));
    }
    return this.streets;
  }
  public getItemById(id: number | null): streetItem | null {
    if (!id) return null;

    if (this.streets.length == 0) return null;
    const item = this.streets.find((el) => el.id == id);
    return item ?? null;
  }
}

function streetMap(row: {
  ID: number;
  NAME_UKR: string;
  NAME_RU: string;
  ST_NAME_UKR: string | null;
  ST_NAME_RU: string | null;
}): streetItem {
  return <streetItem>{
    id: row.ID,
    name_ukr:
      (row.ST_NAME_UKR ? row.ST_NAME_UKR.trim() : "") +
      " " +
      row.NAME_UKR.trim(),
    name_ru:
      (row.ST_NAME_RU ? row.ST_NAME_RU.trim() : "") + " " + row.NAME_RU.trim(),
    street_urk: row.NAME_UKR,
    street_ru: row.NAME_RU,
    type_ukr: row.ST_NAME_UKR,
    type_ru: row.ST_NAME_RU,
  };
}
