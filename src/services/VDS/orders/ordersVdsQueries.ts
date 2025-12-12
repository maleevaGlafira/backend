import { OrdersFilter } from "../../../types/VDS/orders/ordersTypes";
import { parseDateTime } from "../../services/helpfunctions";

// Начало SELECT (без пагинации и без SELECT COUNT)
export const ORDERS_VDS_BASE_SELECT = `
  SELECT
    o.ID,
    o.ORDERNUMBER,
    o.DATECOMING,
    o.DATECLOSED,
    o.ISCLOSED,
    o.SHIFTNUMBER,
    o.SHIFTNUMBERCLOSE,
    o.FACTDATECOMING,
    o.FACTDATECLOSED,
    o.IS_PJATIHATKY,
    o.FK_ORDERS_OFFICIALS,
    o.FK_ORDERS_OFFICIALCLOSED,
    o.FK_ORDERS_BRIGADIERS,
    o.FK_ORDERS_MESSAGETYPES,
    o.FK_ORDERS_DIAMETERS,
    o.FK_ORDERS_DAMAGETYPE,
    o.FK_ORDERS_REGIONS,
    o.FK_ORDERS_STREETS,
    o.HOUSENUM,
    o.HOUSINGNUM,
    o.FLOORNUM,
    o.APARTMENTNUM,
    o.PORCHNUM,
    o.PORCHKOD,
    o.FK_ORDERS_ORGANISATIONS,
    o.APPLICANTFIO,
    o.APPLICANTPHONE,
    o.FK_ORDERS_DISTRICT,
    o.FK_ORDERS_APPLICANT,
    o.FK_ORDERS_TYPEWORK,
    o.FK_ORDERS_ID_REU,
    o.FK_ORDER_DMAGEPLACE
  FROM ORDERS_VDS o
`;
const order_vds_count_sel = `SELECT COUNT(*) AS TOTAL FROM ORDERS_VDS o`;

const order_vds_orders_sel = `ORDER BY o.DATECOMING`;
// Функция построения WHERE-части и параметров
export function buildWhereClauseAndParams(filters: OrdersFilter): {
  where: string;
  params: any[];
} {
  const conditions: string[] = [];
  const params: any[] = [];
  // Вспомогательная функция для IN-условий
  const addInCondition = (field: string, ids: number[] | null | undefined) => {
    if (ids && ids.length > 0) {
      const placeholders = ids.map(() => "?").join(",");
      conditions.push(`o.${field} IN (${placeholders})`);
      params.push(...ids);
    }
  };

  // 🔒 Обязательный интервал дат по DATECOMING
  const from = parseDateTime(filters.dateComingFrom!);

  conditions.push(`o.DATECOMING >= ?`);
  params.push(from);
  if (filters.dateComingTo) {
    const to = parseDateTime(filters.dateComingTo!);
    conditions.push(`o.DATECOMING <= ?`);
    params.push(to);
  }

  // Номер наряда
  if (filters.orderNumber != null) {
    conditions.push(`o.ORDERNUMBER = ?`);
    params.push(filters.orderNumber);
  }

  // Статусы
  if (filters.isClosed != null) {
    conditions.push(`o.ISCLOSED = ?`);
    params.push(filters.isClosed ? 1 : 0);
  }

  if (filters.isPjatihatky != null) {
    // Предполагаем, что в базе: 'T' / 'F' (CHAR(1))
    conditions.push(`o.IS_PJATIHATKY = ?`);
    params.push(filters.isPjatihatky ? "1" : "0");
  }

  // Адресные поля
  if (filters.houseNum) {
    conditions.push(`UPPER(o.HOUSENUM) = UPPER(?)`);
    params.push(filters.houseNum.trim());
  }
  if (filters.housingNum) {
    conditions.push(`o.HOUSINGNUM = ?`);
    params.push(filters.housingNum);
  }
  if (filters.apartmentNum) {
    conditions.push(`o.APARTMENTNUM = ?`);
    params.push(filters.apartmentNum);
  }

  addInCondition("FK_ORDERS_REGIONS", filters.regionIds);
  addInCondition("FK_ORDERS_STREETS", filters.streetIds);
  addInCondition("FK_ORDERS_ORGANISATIONS", filters.organisationIds);
  addInCondition("FK_ORDERS_DAMAGETYPE", filters.damageTypeIds);
  addInCondition("FK_ORDER_DMAGEPLACE", filters.damagePlaceIds);
  addInCondition("FK_ORDERS_BRIGADIERS", filters.brigadierIds);
  addInCondition("FK_ORDERS_OFFICIALS", filters.officialIds);
  addInCondition("FK_ORDERS_OFFICIALCLOSED", filters.officialClosedIds);

  // Одиночные ID
  if (filters.diameterId != null) {
    conditions.push(`o.FK_ORDERS_DIAMETERS = ?`);
    params.push(filters.diameterId);
  }
  if (filters.typeWorkId != null) {
    conditions.push(`o.FK_ORDERS_TYPEWORK = ?`);
    params.push(filters.typeWorkId);
  }

  // Контакты
  if (filters.applicantFio) {
    conditions.push(`UPPER(o.APPLICANTFIO) LIKE UPPER(?)`);
    params.push(`%${filters.applicantFio.trim()}%`);
  }
  if (filters.applicantPhone) {
    conditions.push(`o.APPLICANTPHONE LIKE ?`);
    params.push(`%${filters.applicantPhone.trim()}%`);
  }

  const where = conditions.length ? " WHERE " + conditions.join(" AND ") : "";

  return { where, params };
}

// Основная функция: возвращает и запрос данных, и запрос подсчёта
export function buildOrdersVDSQueries(filters: OrdersFilter): {
  sql: string;
  sqlCount: string;
  params: any[];
} {
  const { where, params } = buildWhereClauseAndParams(filters);

  const baseSelect = ORDERS_VDS_BASE_SELECT + where;
  const countQuery = order_vds_count_sel + where;

  // Пагинация
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 100;
  const offset =
    filters.page && filters.page > 1 ? (filters.page - 1) * limit : 0;

  const pagination = `ROWS ${offset + 1} TO ${offset + limit}`;
  const sql = `${baseSelect} ${order_vds_orders_sel}  ${pagination}`;
  const finalParams = [...params];

  return {
    sql,
    sqlCount: countQuery,
    params: finalParams,
  };
}
