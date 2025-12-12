import { OrganisatrionItem } from "../../../types/dictionaries";
import {
  DictionaryService,
  TDictionaryService,
} from "../BaseDictionary/BaseDictionaryService";
import { getOrganisation } from "../queries";

export class OrganisatrionService
  extends DictionaryService<OrganisatrionItem>
  implements TDictionaryService<OrganisatrionItem>
{
  public net = "All";
  public component = "OrganisatrionService";
  protected mapItem(row: {
    ID: number;
    NAME_RU: string;
    NAME_UKR: string;
    PHONE: string;
  }): OrganisatrionItem {
    return {
      id: row.ID,
      name_ru: row.NAME_RU ? row.NAME_RU.trim() : null,
      name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : null,
      phone: row.PHONE ? row.PHONE.trim() : "",
    };
  }

  public async getDictionary(query: string): Promise<OrganisatrionItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<OrganisatrionItem[]> {
    return this.getDictionary(getOrganisation);
  }
}
