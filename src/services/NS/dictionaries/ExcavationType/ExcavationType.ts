import { DictionaryService } from "../../../../services/dictionaries/BaseDictionary/BaseDictionaryService";
import { getExcavationType } from "../queries";
import {
  DictionaryItem,
  ExcavationTypeItem,
} from "../../../../types/dictionaries";

export class ExcavationTypeService extends DictionaryService<ExcavationTypeItem> {
  public async getData(): Promise<ExcavationTypeItem[]> {
    return await this.getDictionary(getExcavationType);
  }

  protected mapItem(row: any): ExcavationTypeItem {
    // Базова реалізація для випадків, якщо не перевизначено
    return {
      id: row.ID,
      name_ru: row.NAME_RU ? row.NAME_RU.trim() : null,
      name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : null,
      sequence: row.SEQUENCE ? row.SEQUENCE : null,
    } as ExcavationTypeItem;
  }
}
