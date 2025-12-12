import { DictionaryItem } from "../../../types/dictionaries";
import { getOfficials } from "../../NS/dictionaries/queries";
import {
  DictionaryService,
  TDictionaryService,
} from "../BaseDictionary/BaseDictionaryService";

export class OfficialsService
  extends DictionaryService<DictionaryItem>
  implements TDictionaryService<DictionaryItem>
{
  public net = "All";
  public component = "OfficialsService";
  public async getData() {
    return await this.getDictionary(getOfficials);
  }
}
