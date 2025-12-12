import { firebirdDb } from "../../../db/FirebirdDb";
import { getRegionsQuery } from "../../NS/dictionaries/queries";
import { RegionItem } from "../../../types/dictionaries";
import {
  DictionaryService,
  TDictionaryService,
} from "../BaseDictionary/BaseDictionaryService";

export class RegionsService
  extends DictionaryService<RegionItem>
  implements TDictionaryService<RegionItem>
{
  public net = "All";
  public component = "RegionsService";
  public async getData() {
    return await this.getDictionary(getRegionsQuery);
  }
}
