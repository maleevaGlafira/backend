import { firebirdDb } from "../../../db/FirebirdDb";
import { getTubeDiameters } from "../../NS/dictionaries/queries";

import { TubeDiametersItem } from "../../../types/dictionaries";
import { TBaseDictionaryService } from "../BaseDictionary/BaseDictionaryService";

export class TubeDiametersService implements TBaseDictionaryService {
  private db = firebirdDb;
  private data: TubeDiametersItem[] = [];
  public net = "NS";
  public component = "TubeDiametersService";

  public async getData(): Promise<TubeDiametersItem[]> {
    if (this.data.length == 0) {
      const items = await this.db.executeSelect<{
        ID: number;
        DIAMETER?: number;
      }>(getTubeDiameters);

      this.data = items.map((el) => this.mapItem(el));
    }
    return this.data;
  }

  private mapItem(row: { ID: number; DIAMETER?: number }): TubeDiametersItem {
    return {
      id: row.ID,
      diameter: row.DIAMETER,
    };
  }

  public getItemById(id: number | null): TubeDiametersItem | null {
    if (!id) return null;
    if (this.data.length === 0) {
      return null;
    }

    const item = this.data.find((el) => el.id === id);
    return item ?? null;
  }
}
