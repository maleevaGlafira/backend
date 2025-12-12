import { DictionaryService } from "../../../../services/dictionaries/BaseDictionary/BaseDictionaryService";
import { getMessageTypes } from "../queries";
import {
  DictionaryItem,
  MessageTypesItem,
} from "../../../../types/dictionaries";

export class MessageTypesService extends DictionaryService<DictionaryItem> {
  public async getData(): Promise<MessageTypesItem[]> {
    return await this.getDictionary(getMessageTypes);
  }
}
