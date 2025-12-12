import {
  DictionaryService,
  TDictionaryService,
} from "../../../dictionaries/BaseDictionary/BaseDictionaryService";

import { MessageTypesItem } from "../../../../types/VDS/dictionaries";
import { getMessageTypes } from "../../queries";

export class MessageTypeService
  extends DictionaryService<MessageTypesItem>
  implements TDictionaryService<MessageTypesItem>
{
  public net = "VDS";
  public component = "MessageTypeService";
  public async getDictionary(query: string): Promise<MessageTypesItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<MessageTypesItem[]> {
    return this.getDictionary(getMessageTypes);
  }

  protected mapItem(row: {
    ID: number;
    NAME_RU: string;
    NAME_UKR: string;
    GROUP_MESSAGE: number;
  }): MessageTypesItem {
    return {
      id: row.ID,
      name_ru: row.NAME_RU ? row.NAME_RU.trim() : null,
      name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : null,
      groupMessage: row.GROUP_MESSAGE,
    };
  }
}
