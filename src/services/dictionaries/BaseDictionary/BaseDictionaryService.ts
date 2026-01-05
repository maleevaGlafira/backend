import { firebirdDb } from "../../../db/FirebirdDb";

import { DictionaryItem } from "../../../types/dictionaries";
export type getDataFunction = () => Promise<DictionaryItem[]>;
// Інтерфейс для сервісу, який є дженериком

export interface TBaseDictionaryService {
  net: string;
  component: string;
  getData: () => Promise<any>;
}

export interface TDictionaryService<T extends DictionaryItem>
  extends TBaseDictionaryService {
  getData: () => Promise<T[]>;
  getItemById(id: number | null): T | null;
}

// export class DictionaryService {
//   private db = firebirdDb;
//   private data: DictionaryItem[] = [];
//   public async getDictionary(query: string): Promise<DictionaryItem[]> {
//     if (this.data.length == 0) {
//       const items = await this.db.executeSelect<{
//         ID: number;
//         NAME_RU: string;
//         NAME_UKR: string;
//       }>(query);

//       this.data = items.map((el) => this.mapItem(el));
//     }
//     return this.data;
//   }

//   private mapItem(row: {
//     ID: number;
//     NAME_RU: string;
//     NAME_UKR: string;
//   }): DictionaryItem {
//     return {
//       id: row.ID,
//       name_ru: row.NAME_RU ? row.NAME_RU.trim() : "",
//       name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : "",
//     };
//   }
// }

export class DictionaryService<T extends DictionaryItem> {
  protected db = firebirdDb; // робимо protected, щоб наслідники могли отримати доступ
  protected data: T[] = [];

  public async getDictionary(query: string): Promise<T[]> {
    if (this.data.length === 0) {
      // Типізуємо результат запиту відповідно до T
      const items = await this.db.executeSelect<any>(query); // Тимчасово any, але наслідники передають свій тип
      this.data = items.map((el) => this.mapItem(el)) as T[];
    }
    return this.data;
  }

  // Робимо метод абстрактним або визначаємо базову версію
  protected mapItem(row: any): T {
    // Базова реалізація для випадків, якщо не перевизначено
    return {
      id: row.ID,
      name_ru: row.NAME_RU ? row.NAME_RU.trim() : null,
      name_ukr: row.NAME_UKR ? row.NAME_UKR.trim() : null,
    } as T;
  }

  public getItemById(id: number | null): T | null {
    if (!id) return null;
    if (this.data.length == 0) {
      return null;
    }
    const item = this.data.find((el) => el.id == id);
    return item ?? null;
  }
}
