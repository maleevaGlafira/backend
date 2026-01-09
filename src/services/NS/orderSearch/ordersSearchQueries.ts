// SQL шаблоны — здесь формируем запросы под фильтры
import logger from "../../../config/logger";
import { OrderUniSearchFilters } from "../../../types/NS/orders/orderTypes";
import { parseDateTime } from "../../services/helpfunctions";
import { QueryWithParams } from "../../services/helpTypes";

export const baseOrdersQuery = `
  SELECT DISTINCT o.id,
         o.OrderNumber,
         o.DateComing,
         CAST(o.FlowSpeed AS DECIMAL(10,4)) AS FlowSpeed,
         (SELECT name_ukr FROM s_Regions WHERE id = o.fk_orders_regions) AS Region,
         (SELECT name_ukr FROM s_DamagePlace WHERE id = o.fk_orders_damageplace) AS DamagePlace,
         (SELECT name_ukr FROM s_DamageType WHERE id = o.fk_orders_damagetype) AS DamageType,
         (SELECT diameter FROM s_TubeDiameter WHERE id = o.fk_orders_diameters) AS Diameter,
         (SELECT ADRES_UKR FROM Get_adres_uk(o.fk_orders_housetypes, o.fk_orders_streets,
             o.housenum, o.additionaladdress)) AS Adres,
         (SELECT orderworks FROM get_orderworks(o.id, 0, 1)) AS WhatIsDone,   
         
         o.DateClosed,
         o.IsClosed,
         (select  sm.name_ukr from s_messagetypes sm where sm.id=o.fk_orders_messagetypes) as messageName,
         TRIM(o.ABONENT) AS Abonent,
         (SELECT res FROM GET_LEAK_Localize(o.id)) AS Localized,
         o.is_RedLine
  FROM orders o
`;
export const baseOrdersQueryPost = `
    select ID,
    ORDERNUMBER,
    DATECOMING,
    FK_ORDERS_OFFICIALS,
    DATECLOSED,
    FK_ORDERS_OFFICIALCLOSED,
    FK_ORDERS_MESSAGETYPES,
    ABONENT,
    FK_ORDERS_DAMAGEPLACE,
    FK_ORDERS_DAMAGELOCALITY,
    ISPAYED,
    LOCATIONDEPTH,

    ISCLOSED,
    FLOWSPEED,
    FK_ORDERS_TUBEMATERIAL,
    FK_ORDERS_DIAMETERS,
    FK_ORDERS_DAMAGETYPE,
    FK_ORDERS_REGIONS,
    FK_ORDERS_STREETS,
    FK_ORDERS_HOUSETYPES,
    HOUSENUM,
    ADDITIONALADDRESS,
    FK_ORDERS_ORGANISATIONS,

    WITHOUTEQUIPMENT,
    FK_ORDERS_SOIL,
    SHIFTNUMBER,
    SHIFTNUMBERCLOSE,
    HOODCOUNT,
    LASTEXCWRKTYPE,
    ID_ABONENT,
    IS_PJATIHATKY,
    FACTDATECOMING,
    FACTDATECLOSED,
    FK_ORDERS_ADD_DAMAGELOCALITY,
    FK_ORDERS_OFF_WITHOUTEXCAV,
    DATETIME_WITHOUTEXCAV,
    HEIGHTTHREAD,
    WIDTHLOT,
    SPEEDQ,
    IS_REDLINE from orders o`;

const baseCountQuery = `
    SELECT COUNT(DISTINCT o.id) AS total
    FROM orders o    
  `;

function getEffectiveFilter(
  filters: OrderUniSearchFilters
): OrderUniSearchFilters {
  // --- Установка даты по умолчанию: если нет ни dateFrom, ни dateClosedFrom — ставим месяц назад ---
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 2);
  // Форматируем как 'YYYY-MM-DD'
  const formatDate = (d: Date): string => d.toISOString().split("T")[0];

  const effectiveDateFrom = filters.dateFrom
    ? filters.dateFrom
    : !filters.dateClosedFrom
    ? formatDate(oneMonthAgo)
    : undefined;

  // Копируем фильтры, чтобы не мутировать входной объект
  return {
    ...filters,
    dateFrom: effectiveDateFrom,
  };
}

/**
 * Формирует SQL-запрос для выборки нарядов с фильтрами и пагинацией
 */
export const buildOrdersQuery = (
  filters: OrderUniSearchFilters,
  baseQuery: string = baseOrdersQuery
): QueryWithParams => {
  const effectiveFilters = getEffectiveFilter(filters);

  // --- Сортировка ---
  const orderBy = "ORDER BY o.DateComing DESC";

  // --- Пагинация ---
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
  const offset = (page - 1) * limit;

  const pagination = `ROWS ${offset + 1} TO ${offset + limit}`;
  const queryParams = buildConditionPartWithParams(effectiveFilters);
  const query = `
    ${baseQuery}
    WHERE ${queryParams.sql}
    ${orderBy}
    ${pagination}
  `;

  const countQuery = `${baseCountQuery} where ${queryParams.sql}`;
  return {
    sql: query,
    countSql: countQuery,
    params: queryParams.params,
    newFilter: effectiveFilters,
  };
};

const buildConditionPartWithParams = (
  filters: OrderUniSearchFilters
): QueryWithParams => {
  const params = [];
  const where: string[] = ["1=1"];

  if (filters.dateFrom) {
    const d = filters.dateFrom;
    if (d) {
      where.push(`o.DateComing >= ?`);
      params.push(d);
    }
  }
  logger.info(
    `filter.isClosed=${filters.isClosed} ${filters.isClosed == true ? 1 : 0}`
  );

  if (filters.isClosed != null) {
    where.push(`ISCLOSED = ?`);
    params.push(filters.isClosed ? 1 : 0);
  }

  if (filters.dateTo) {
    const d = filters.dateTo;
    if (d) {
      where.push(`o.DateComing <= ?`);
      params.push(d);
    }
  }

  if (filters.dateClosedFrom) {
    const d = filters.dateClosedFrom;
    if (d) {
      where.push(`o.DateClosed >= ?`);
      params.push(d);
    }
  }

  if (filters.dateClosedTo) {
    const d = filters.dateClosedTo;
    if (d) {
      where.push(`o.DateClosed <= ?`);
      params.push(d);
    }
  }

  if (filters.orderNumber) {
    where.push(`o.OrderNumber = ?`);
    params.push(`${filters.orderNumber}`); // драйвер сам экранирует!
  }

  if (filters.regionIds?.length) {
    const placeholders = filters.regionIds.map(() => "?").join(", ");
    where.push(`o.fk_orders_regions IN (${placeholders})`);
    params.push(...filters.regionIds);
  }

  if (filters.streetsIds?.length) {
    const placeholders = filters.streetsIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_STREETS IN (${placeholders})`);
    params.push(...filters.streetsIds);
  }

  if (filters.houseNum && filters.houseNum?.length > 0) {
    where.push(`(upper(o.HOUSENUM) like ?  and FK_ORDERS_HOUSETYPES=0)`);
    params.push(`%${filters.houseNum?.trim().toUpperCase()}%`);
  }

  if (filters.organizationIds?.length) {
    const placeholders = filters.organizationIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_ORGANISATIONS IN (${placeholders})`);
    params.push(...filters.organizationIds);
  }
  if (filters.damageTypeIds?.length) {
    const placeholders = filters.damageTypeIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_DAMAGETYPE IN (${placeholders})`);
    params.push(...filters.damageTypeIds);
  }

  if (filters.damagePlaceIds?.length) {
    const placeholders = filters.damagePlaceIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_DAMAGEPLACE IN (${placeholders})`);
    params.push(...filters.damagePlaceIds);
  }

  if (filters.damageLocalityIds?.length) {
    const placeholders = filters.damageLocalityIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_DAMAGELOCALITY IN (${placeholders})`);
    params.push(...filters.damageLocalityIds);
  }

  if (filters.addDamageLocalityIds?.length) {
    const placeholders = filters.addDamageLocalityIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_ADD_DAMAGELOCALITY IN (${placeholders})`);
    params.push(...filters.addDamageLocalityIds);
  }

  console.log(
    "filters.messageTypesIds?.length===",
    filters.messageTypesIds?.length
  );
  if (filters.messageTypesIds?.length) {
    const placeholders = filters.messageTypesIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_MESSAGETYPES IN (${placeholders})`);
    params.push(...filters.messageTypesIds);
  }

  if (filters.officialIds?.length) {
    const placeholders = filters.officialIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_OFFICIALS IN (${placeholders})`);
    params.push(...filters.officialIds);
  }
  if (filters.officialClosedIds?.length) {
    const placeholders = filters.officialClosedIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_OFFICIALCLOSED IN (${placeholders})`);
    params.push(...filters.officialClosedIds);
  }

  if (filters.officialClosedIds?.length) {
    const placeholders = filters.officialClosedIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_OFFICIALCLOSED IN (${placeholders})`);
    params.push(...filters.officialClosedIds);
  }

  if (filters.tubeDiameterIds?.length) {
    const placeholders = filters.tubeDiameterIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_DIAMETERS IN (${placeholders})`);
    params.push(...filters.tubeDiameterIds);
  }

  if (filters.tubeMaterialIds?.length) {
    const placeholders = filters.tubeMaterialIds.map(() => "?").join(", ");
    where.push(`o.FK_ORDERS_TUBEMATERIAL IN (${placeholders})`);
    params.push(...filters.tubeMaterialIds);
  }

  return <QueryWithParams>{ sql: where.join(" AND "), params };
};
