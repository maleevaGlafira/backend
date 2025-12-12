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
  orderNumber: number;
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
  data: Order[];
}
