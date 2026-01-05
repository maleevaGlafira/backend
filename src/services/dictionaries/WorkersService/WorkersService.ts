1;
import { WorkerItem } from "../../../types/dictionaries";

import {
  DictionaryService,
  TDictionaryService,
} from "../BaseDictionary/BaseDictionaryService";
import { getWorkers } from "../queries";

export class WorkersService
  extends DictionaryService<WorkerItem>
  implements TDictionaryService<WorkerItem>
{
  public net = "All";
  public component = "BrigadiersService";
  protected mapItem(row: {
    ID: number;
    NAME_RU: string;
    NAME_UKR: string;
    FK_BRIGADIERS_REGIONS: number;

    PR_NS_VDS: number;
    PR_WATER_KAN: number;
  }): WorkerItem {
    return {
      id: row.ID,
      name_ru: row.NAME_RU ? row.NAME_RU.trim() : null,
      name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : null,
      fk_region: row.FK_BRIGADIERS_REGIONS,
      pr_ns_vds: row.PR_NS_VDS,
      pr_water_kan: row.PR_WATER_KAN,
    };
  }

  public async getDictionary(query: string): Promise<WorkerItem[]> {
    // Якщо потрібно, можна перевизначити логіку
    return super.getDictionary(query);
  }

  public async getData(): Promise<WorkerItem[]> {
    return this.getDictionary(getWorkers);
  }
}
