import { ReuItem } from "../../../types/dictionaries";
import {
  DictionaryService,
  TDictionaryService,
} from "../BaseDictionary/BaseDictionaryService";
import { getReu } from "../queries";

export class ReuServices
  extends DictionaryService<ReuItem>
  implements TDictionaryService<ReuItem>
{
  public net = "All";
  public component = "ReuServices";
  protected mapItem(row: {
    ID: number;
    NAME_RU: string;
    NAME_UKR: string;
    KOD: number;
  }): ReuItem {
    return {
      id: row.ID,
      name_ru: row.NAME_RU ? row.NAME_RU.trim() : null,
      name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : null,
      kod: row.KOD,
    };
  }

  public async getDictionary(query: string): Promise<ReuItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<ReuItem[]> {
    return this.getDictionary(getReu);
  }
}
