import {
  DictionaryService,
  TDictionaryService,
} from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

import { DictionaryItem } from "../../../../types/dictionaries";
import { getApplicant } from "../../queries";

export class ApplicantService
  extends DictionaryService<DictionaryItem>
  implements TDictionaryService<DictionaryItem>
{
  public net = "VDS";
  public component = "ApplicantService";
  public async getDictionary(query: string): Promise<DictionaryItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<DictionaryItem[]> {
    return this.getDictionary(getApplicant);
  }
}
