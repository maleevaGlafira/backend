export interface DictionaryItem {
  id: number;
  name_ukr: string | null;
  name_ru: string | null;
}

export interface streetItem {
  id: number;
  name_ukr: string | null;
  name_ru: string | null;
  street_urk: string | null;
  street_ru: string | null;
  type_ukr: string | null;
  type_ru: string | null;
}

export interface RegionItem extends DictionaryItem {
  // ничего дополнительно не нужно — только базовые поля
}

export interface DamageLocalityItem extends DictionaryItem {
  classNumber: number | null; // или number, если CLASSNUMBER — число
}

export interface DamagePlaceItem extends DictionaryItem {
  chackDiam: number | null; // предполагается, что CHACK_DIAM — числовое поле (возможно, опечатка: "check_diam"?)
}

export interface DamageTypeItem extends DictionaryItem {
  // ничего дополнительно не нужно — только базовые поля
}

export interface TubeDiametersItem {
  id: number;
  diameter?: number;
}

export interface MessageTypesItem extends DictionaryItem {}
export interface OrganisatrionItem extends DictionaryItem {
  phone: string;
}

export interface ReuItem extends DictionaryItem {
  kod: number;
}

export interface BrigadierItem extends DictionaryItem {
  fk_region: number;
  id_region: number | null;
  pr_ns_vds: number | null;
  pr_water_kan: number;
}
