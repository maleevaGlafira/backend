import {
  DictionaryService,
  TDictionaryService,
} from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

import { DictionaryItem } from "../../../../types/dictionaries";
import { getDamageType } from "../../queries";

export class DamageTypeService
  extends DictionaryService<DictionaryItem>
  implements TDictionaryService<DictionaryItem>
{
  public net = "VDS";
  public component = "DamageTypeService";
  public async getDictionary(query: string): Promise<DictionaryItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<DictionaryItem[]> {
    return this.getDictionary(getDamageType);
  }
}
