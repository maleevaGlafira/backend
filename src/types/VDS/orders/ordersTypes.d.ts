import { DictionaryItem } from "../../dictionaries";
import { TubeDiametersItem } from "../../dictionaries";
import type { addressBase } from "../../bdTypes";

export interface TableOrderVDS {
  ID: number;
  ORDERNUMBER: number | null;
  DATECOMING: Date | null;
  FK_ORDERS_OFFICIALS: number | null;
  DATECLOSED: Date | null;
  FK_ORDERS_OFFICIALCLOSED: number | null;
  FK_ORDERS_MESSAGETYPES: number | null;
  FK_ORDERS_BRIGADIERS: number | null;
  ISCLOSED: number; // 0 або 1
  FK_ORDERS_DIAMETERS: number | null;
  FK_ORDERS_DAMAGETYPE: number | null;
  FK_ORDERS_REGIONS: number | null;
  FK_ORDERS_STREETS: number | null;
  HOUSENUM: string | null;
  FK_ORDERS_ORGANISATIONS: number | null;
  ADDITIONALINFO: string | null;
  SHIFTNUMBER: number | null;
  SHIFTNUMBERCLOSE: number | null;
  FK_ORDERS_DISTRICT: number | null;
  FK_ORDERS_APPLICANT: number | null;
  APPLICANTFIO: string | null;
  APPLICANTPHONE: string | null;
  HOUSINGNUM: string | null;
  FLOORNUM: string | null;
  APARTMENTNUM: string | null;
  PORCHNUM: string | null;
  PORCHKOD: string | null;
  RGLOG_ID_CLIENT: number;
  FACTDATECOMING: Date | null;
  FACTDATECLOSED: Date | null;
  FK_ORDERS_TYPEWORK: number | null;
  FK_ORDERS_ID_REU: number | null;
  IS_PJATIHATKY: number | null; // Припущення щодо типу MYTBOOLEAN
  FK_ORDER_DMAGEPLACE: number | null;
}

export interface OrderVDSResponse {
  id: number;
  orderNumber: number | null;
  dateComing: Date | null;
  dateClosed: Date | null;
  isClosed: boolean;
  shiftNumber: number | null;
  shiftNumberClose: number | null;
  factDateComing: Date | null;
  factDateClosed: Date | null;
  isPjatihatky: boolean | null;

  // Справочная информация (расшифрованная)
  official?: DictionaryItem | null;
  officialClosed?: DictionaryItem | null;
  messageTypes?: DictionaryItem | null;
  brigadiers?: DictionaryItem | null;
  diameter?: TubeDiametersItem | null;
  damageType?: DictionaryItem | null;
  regions?: DictionaryItem | null;
  streets?: DictionaryItem | null;
  organisations?: DictionaryItem | null;
  district?: DictionaryItem | null;
  applicant?: DictionaryItem | null;
  typeWork?: {
    id: number;
    name: string;
  } | null;
  reu?: {
    id: number;
    name: string;
  } | null;
  damagePlace?: DictionaryItem | null;

  // Адрес
  address: string;

  // Контактная информация
  applicantFio: string | null;
  applicantPhone: string | null;

  // Дополнительная информация
  additionalInfo: string | null;
}

export interface OrdersFilter {
  // Основные идентификаторы
  orderNumber?: number | null;

  // Временные диапазоны (в ISO 8601 строках)
  dateComingFrom?: string | null;
  dateComingTo?: string | null;
  factDateComingFrom?: string | null;
  factDateComingTo?: string | null;
  dateClosedFrom?: string | null;
  dateClosedTo?: string | null;
  factDateClosedFrom?: string | null;
  factDateClosedTo?: string | null;

  // Статус и признаки
  isClosed?: boolean | null;
  isPjatihatky?: boolean | null;

  // Адресные данные
  houseNum?: string | null; // номер дома — точное или частичное совпадение
  housingNum?: string | null; // корпус
  apartmentNum?: string | null; // квартира

  // Фильтрация по спискам ID из справочников
  regionIds?: number[] | null; // районы (FK_ORDERS_REGIONS)
  streetIds?: number[] | null; // улицы (FK_ORDERS_STREETS)
  organisationIds?: number[] | null; // организации (FK_ORDERS_ORGANISATIONS)
  damageTypeIds?: number[] | null; // типы повреждений (FK_ORDERS_DAMAGETYPE)
  damagePlaceIds?: number[] | null; // места повреждения (FK_ORDER_DMAGEPLACE)
  brigadierIds?: number[] | null; // бригадиры (FK_ORDERS_BRIGADIERS)
  officialIds?: number[] | null; // приняли заявку (FK_ORDERS_OFFICIALS)
  officialClosedIds?: number[] | null; // закрыли наряд (FK_ORDERS_OFFICIALCLOSED)
  messageTypesIds?: number[] | null; // о чем заявлено;
  // Контактная информация
  applicantFio?: string | null; // поиск по подстроке
  applicantPhone?: string | null;

  // Характеристики аварии
  diameterId?: number | null; // диаметр — один ID (часто одно значение)
  typeWorkId?: number | null; // тип работы — один ID

  // Пагинация
  page?: number; // >= 1
  limit?: number; // например, 10, 25, 50
}

export interface addressVdsBase extends addressBase {
  HOUSINGNUM: string | null;
  APARTMENTNUM: string | null;
  PORCHNUM: string | null;
  PORCHKOD: string | null;
}
