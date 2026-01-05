import { DictionaryService } from "../../../../services/dictionaries/BaseDictionary/BaseDictionaryService";
import { getSoil } from "../queries";
import { DictionaryItem } from "../../../../types/dictionaries";

export class SoilService extends DictionaryService<DictionaryItem> {
  public async getData(): Promise<DictionaryItem[]> {
    return await this.getDictionary(getSoil);
  }
}
