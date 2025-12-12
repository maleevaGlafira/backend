import {
  DictionaryService,
  TDictionaryService,
} from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

import { DictionaryItem } from "../../../../types/dictionaries";
import { getDistricts } from "../../queries";

export class DistrictsService
  extends DictionaryService<DictionaryItem>
  implements TDictionaryService<DictionaryItem>
{
  public net = "VDS";
  public component = "DistrictsService";
  public async getDictionary(query: string): Promise<DictionaryItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<DictionaryItem[]> {
    return this.getDictionary(getDistricts);
  }
}
