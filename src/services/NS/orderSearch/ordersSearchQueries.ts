// SQL шаблоны — здесь формируем запросы под фильтры
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
  filters: OrderUniSearchFilters
): QueryWithParams => {
  const effectiveFilters = getEffectiveFilter(filters);
  console.log(effectiveFilters);
  // --- Сортировка ---
  const orderBy = "ORDER BY o.DateComing DESC";

  // --- Пагинация ---
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
  const offset = (page - 1) * limit;

  const pagination = `ROWS ${offset + 1} TO ${offset + limit}`;
  const queryParams = buildConditionPartWithParams(effectiveFilters);
  const query = `
    ${baseOrdersQuery}
    WHERE ${queryParams.sql}
    ${orderBy}
    ${pagination}
  `;
  console.log(queryParams);
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
    console.log(filters.dateFrom, parseDateTime(filters.dateFrom));
    const d = parseDateTime(filters.dateFrom);
    if (d) {
      where.push(`o.DateComing >= ?`);
      params.push(d);
    }
  }

  if (filters.dateTo) {
    const d = parseDateTime(filters.dateTo);
    if (d) {
      where.push(`o.DateComing <= ?`);
      params.push(d);
    }
  }

  if (filters.dateClosedFrom) {
    const d = parseDateTime(filters.dateClosedFrom);
    if (d) {
      where.push(`o.DateClosed >= ?`);
      params.push(d);
    }
  }

  if (filters.dateClosedTo) {
    const d = parseDateTime(filters.dateClosedTo);
    if (d) {
      where.push(`o.DateClosed <= ?`);
      params.push(d);
    }
  }

  if (filters.orderNumber) {
    where.push(`o.OrderNumber LIKE ?`);
    params.push(`%${filters.orderNumber}%`); // драйвер сам экранирует!
  }

  if (filters.regionIds?.length) {
    // Для IN с параметрами — нужно по одному placeholder на значение
    const placeholders = filters.regionIds.map(() => "?").join(", ");
    where.push(`o.fk_orders_regions IN (${placeholders})`);
    params.push(...filters.regionIds);
  }

  return <QueryWithParams>{ sql: where.join(" AND "), params };
};
