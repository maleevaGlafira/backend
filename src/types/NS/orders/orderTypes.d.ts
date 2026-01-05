import type { DictionaryItem, TubeDiametersItem } from "../../dictionaries";
import type { addressBase } from "../../bdTypes";
export interface Order {
  ID: number;
  ORDERNUMBER: string;
  DATECOMING: string;
  DATECLOSED?: string | null;
  FLOWSPEED?: number;
  REGION: string;
  DAMAGEPLACE: string;
  DAMAGETYPE: string;
  DIAMETER: string;
  ADRES: string;
  WHATISDONE?: string;
  MESSAGENAME?: string;
  ISCLOSED: boolean;
  ABONENT?: string;
  LOCALIZED?: string;
  ISrEDlINE?: boolean;
  netType: string;
}

export interface OrderUniSearchFilters {
  orderNumber: number | undefined;
  dateFrom?: string;
  dateClosedFrom?: string;
  dateTo?: string;
  dateClosedTo?: string;
  regionIds?: number[];
  page: number;
  limit: number;
}

export interface resultOrderList {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  filter: OrderUniSearchFilters;
  data: any[];
}

export interface OrderDatabase {
  ID: number;
  ORDERNUMBER: number;
  DATECOMING: TDate;
  FK_ORDERS_OFFICIALS: integer;
  DATECLOSED: TDate;
  FK_ORDERS_OFFICIALCLOSED: number;
  FK_ORDERS_MESSAGETYPES: number;
  ABONENT: string;
  FK_ORDERS_DAMAGEPLACE: number;
  FK_ORDERS_DAMAGELOCALITY: number;
  ISPAYED: number;
  LOCATIONDEPTH: number;

  ISCLOSED: number;
  FLOWSPEED: number;
  FK_ORDERS_TUBEMATERIAL: number;
  FK_ORDERS_DIAMETERS: number;
  FK_ORDERS_DAMAGETYPE: number;
  FK_ORDERS_REGIONS: number;
  FK_ORDERS_STREETS: number;
  FK_ORDERS_HOUSETYPES: number;
  HOUSENUM: string;
  ADDITIONALADDRESS: string;
  FK_ORDERS_ORGANISATIONS: number;
  WITHOUTEQUIPMENT: number;
  FK_ORDERS_SOIL: number;
  SHIFTNUMBER: number;
  SHIFTNUMBERCLOSE: number;
  HOODCOUNT: number;
  LASTEXCWRKTYPE: number;
  ID_ABONEN: number;
  IS_PJATIHATKY: number;
  FACTDATECOMING: TDate;
  FACTDATECLOSED: TDate;
  FK_ORDERS_ADD_DAMAGELOCALITY: number;
  FK_ORDERS_OFF_WITHOUTEXCAV: number;
  DATETIME_WITHOUTEXCAV: TDate;
  HEIGHTTHREAD: number;
  WIDTHLOT: number;
  SPEEDQ: number;
  IS_REDLINE: number;
}

export interface addressNsDatabase extends addressBase {
  // FK_STREETS: number;
  // HOUSENUM: string;
  FK_HOUSETYPES: number;
  ADDITIONALADDRESS: string;
}

export interface OrderNsResponse {
  id: number;
  orderNumber: number;
  dateComing: Date | null;
  dateClosed: Date | null;
  isClosed: boolean;
  shiftNumber: number | null;
  shiftNumberClose: number | null;
  factDateComing: Date | null;
  factDateClosed: Date | null;
  isPjatihatky: boolean | null;

  official?: DictionaryItem | null;
  officialClosed?: DictionaryItem | null;
  messageTypes?: DictionaryItem | null;

  damagePlace?: DictionaryItem | null;
  damageLocality?: DictionaryItem | null;
  addDamageLocality?: DictionaryItem | null;

  tubeMaterial?: DictionaryItem | null;
  diameter?: TubeDiametersItem | null;
  damageType?: DictionaryItem | null;
  organization?: DictionaryItem | null;
  withoutEquipment?: DictionaryItem | null;
  soil?: DictionaryItem | null;

  lastExcavationType?: DictionaryItem | null;
  applicant?: DictionaryItem | null;
  // Адрес
  region?: DictionaryItem | null;
  street?: DictionaryItem | null;
  houseType?: DictionaryItem | null;
  houseNum: string;
  addAddress: string;
  address;

  withoutExcavation: number;
  dateWithoutExcavation: TDate;

  isPayed: boolean;
  locationDepth: number;

  hoodCount: number;
  flowSpeed: number;
  heightLot: number;
  widthLot: number;
  speedQ: number;
  isRedLine: boolean;
}
