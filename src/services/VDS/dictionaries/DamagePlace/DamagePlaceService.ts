import {
  DictionaryService,
  TDictionaryService,
} from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

import { DictionaryItem } from "../../../../types/dictionaries";
import { getDamagePlace } from "../../queries";

export class DamagePlaceService
  extends DictionaryService<DictionaryItem>
  implements TDictionaryService<DictionaryItem>
{
  public net = "VDS";
  public component = "DamagePlaceService";
  public async getDictionary(query: string): Promise<DictionaryItem[]> {
    // Якщо потрібно, можна перевизначити логіку

    return super.getDictionary(query);
  }

  public async getData(): Promise<DictionaryItem[]> {
    return this.getDictionary(getDamagePlace);
  }
}
