// BaseOrder.ts
interface BaseOrder {
  ID: number;
  ORDERNUMBER: number;
  DATECOMING: string | null; // Firebird TIMESTAMP → ISO string
  DATECLOSED: string | null;
  FK_ORDERS_OFFICIALS: number | null;
  FK_ORDERS_OFFICIALCLOSED: number | null;
  FK_ORDERS_MESSAGETYPES: number | null;
  ISCLOSED: number; // 0/1
  FK_ORDERS_DIAMETERS: number | null;
  FK_ORDERS_DAMAGETYPE: number | null;
  FK_ORDERS_REGIONS: number | null;
  FK_ORDERS_STREETS: number | null;
  HOUSENUM: string;
  FK_ORDERS_ORGANISATIONS: number | null;
  ADDITIONALINFO: string | null;
  SHIFTNUMBER: number | null;
  SHIFTNUMBERCLOSE: number | null;
  RGLOG_ID_CLIENT: number;
  FACTDATECOMING: string | null;
  FACTDATECLOSED: string | null;
  FK_ORDERS_TYPEWORK: number | null;
  IS_PJATIHATKY: number; // MYTBOOLEAN → 0/1
}

// Наружные сети
interface Orders extends BaseOrder {
  ABONENT: string;
  FK_ORDERS_DAMAGEPLACE: number | null;
  FK_ORDERS_DAMAGELOCALITY: number | null;
  ISPAYED: number;
  LOCATIONDEPTH: number | null;
  PRESSURE: number | null;
  SQUARE: number | null;
  CUTOFFS: string | null;
  FLOWSPEED: number | null;
  FK_ORDERS_TUBEMATERIAL: number | null;
  FK_ORDERS_HOUSETYPES: number | null;
  ADDITIONALADDRESS: string | null;
  DISCONNECTIONS: string | null;
  WITHOUTEQUIPMENT: number;
  FK_ORDERS_SOIL: number | null;
  HOODCOUNT: number | null;
  LASTEXCWRKTYPE: number;
  ID_ABONENT: number;
  FK_ORDERS_ADD_DAMAGELOCALITY: number | null;
  FK_ORDERS_OFF_WITHOUTEXCAV: number | null;
  DATETIME_WITHOUTEXCAV: string | null;
  HEIGHTTHREAD: number | null;
  WIDTHLOT: number | null;
  SPEEDQ: number | null;
  IS_REDLINE: number; // MYTBOOLEAN
}

// Внутридомовые сети
interface OrdersVDS extends BaseOrder {
  FK_ORDERS_BRIGADIERS: number | null;
  FK_ORDERS_DISTRICT: number | null;
  FK_ORDERS_APPLICANT: number | null;
  APPLICANTFIO: string | null;
  APPLICANTPHONE: string | null;
  HOUSINGNUM: string | null;
  FLOORNUM: string | null;
  APARTMENTNUM: string | null;
  PORCHNUM: string | null;
  PORCHKOD: string | null;
  FK_ORDERS_ID_REU: number | null;
  FK_ORDER_DMAGEPLACE: number | null; // опечатка в названии? (DMAGE → DAMAGE)
}
