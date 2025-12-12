import { DictionaryItem, ReuItem } from "../../../types/dictionaries";
import {
  DictionaryService,
  TDictionaryService,
} from "../BaseDictionary/BaseDictionaryService";
import { getTypeWorks } from "../queries";

export class TypeWorkService
  extends DictionaryService<DictionaryItem>
  implements TDictionaryService<DictionaryItem>
{
  public net = "All";
  public component = "TypeWorkService";
  public async getDictionary(query: string): Promise<DictionaryItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<DictionaryItem[]> {
    return this.getDictionary(getTypeWorks);
  }
}
