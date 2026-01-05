import { DictionaryService } from "../../../../services/dictionaries/BaseDictionary/BaseDictionaryService";
import { getTubeMaterial } from "../queries";
import { DictionaryItem } from "../../../../types/dictionaries";

export class TubeMaterialService extends DictionaryService<DictionaryItem> {
  public async getData(): Promise<DictionaryItem[]> {
    return await this.getDictionary(getTubeMaterial);
  }
}
