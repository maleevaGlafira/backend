import { OrdersFilter } from "../../../types/VDS/orders/ordersTypes";
import { OrderVDSResponse } from "../../../types/VDS/orders/ordersTypes";
import { TableOrderVDS } from "../../../types/VDS/orders/ordersTypes";
import { buildOrdersVDSQueries } from "./ordersVdsQueries";
import { firebirdDb } from "../../../db/FirebirdDb"; // путь к вашему firebirdDb
import { DictionaryItem } from "../../../types/dictionaries";
import { streetItem } from "../../../types/dictionaries";
import logger from "../../../config/logger";
import {
  streets,
  regions,
  brigadiers,
  officials,
  tubeDiameters,
  organisations,
} from "../../dictionaries/reference.cache";
import {
  vdsMessageTypes,
  vdsDistricts,
  vdsApplicant,
  vdsDamagePlace,
  vdsDamageType,
} from "../dictionaries/vdsReference.cache";

export class OrdersVDSSearchService {
  private db = firebirdDb;

  async search(filters: OrdersFilter): Promise<{
    total: number;
    data: OrderVDSResponse[];
    filter: OrdersFilter;
  }> {
    logger.info("Search order filter", {
      filter: filters,
      compontent: "OrdersVDSSearchService",
    });
    // Валидация обязательных дат (уже проверяется в parseDateTime, но можно дублировать)
    if (!filters.dateComingFrom) {
      console.log("Throw error");
      throw new Error("Поля dateComingFrom и dateComingTo обязательны.");
    }

    const { sql, sqlCount, params } = buildOrdersVDSQueries(filters);

    const countResult = await this.db.executeSelect<{ TOTAL: number }>(
      sqlCount,
      params
    );
    const total = countResult[0]?.TOTAL ?? 0;

    // Получаем данные
    const rawOrders: TableOrderVDS[] =
      await this.db.executeSelect<TableOrderVDS>(sql, params);

    await this.getCache();
    // Преобразуем в очеловеченный вид
    const data = this.humanizeOrders(rawOrders);

    return {
      total,
      data,
      filter: filters,
    };
  }

  private getCache() {}

  private humanizeOrders(raw: TableOrderVDS[]): OrderVDSResponse[] {
    return raw.map((r) => ({
      id: r.ID,
      orderNumber: r.ORDERNUMBER,
      dateComing: r.DATECOMING,
      dateClosed: r.DATECLOSED,
      isClosed: r.ISCLOSED === 1,
      shiftNumber: r.SHIFTNUMBER,
      shiftNumberClose: r.SHIFTNUMBERCLOSE,
      factDateComing: r.FACTDATECOMING,
      factDateClosed: r.FACTDATECLOSED,
      isPjatihatky: r.IS_PJATIHATKY === 1,

      // Заглушки для справочников — замените на реальные данные из кэша/запросов
      official: r.FK_ORDERS_OFFICIALS
        ? officials.getItemById(r.FK_ORDERS_OFFICIALS)
        : null,
      officialClosed: officials.getItemById(r.FK_ORDERS_OFFICIALCLOSED),
      streets: streets.getItemById(r.FK_ORDERS_STREETS),
      // ? { id: r.FK_ORDERS_STREETS, name: "..." }
      // : null,
      regions: regions.getItemById(r.FK_ORDERS_REGIONS),
      messageTypes: vdsMessageTypes.getItemById(r.FK_ORDERS_MESSAGETYPES),
      brigadiers: brigadiers.getItemById(r.FK_ORDERS_BRIGADIERS),
      organisations: organisations.getItemById(r.FK_ORDERS_ORGANISATIONS),
      diameter: tubeDiameters.getItemById(r.FK_ORDERS_DIAMETERS),
      district: vdsDistricts.getItemById(r.FK_ORDERS_DISTRICT),
      // Адрес
      address: this.buildAddress(r),
      applicant: vdsApplicant.getItemById(r.FK_ORDERS_APPLICANT),

      applicantFio: r.APPLICANTFIO,
      applicantPhone: r.APPLICANTPHONE,

      additionalInfo: null,
      damagePlace: vdsDamagePlace.getItemById(r.FK_ORDER_DMAGEPLACE),
      damageType: vdsDamageType.getItemById(r.FK_ORDERS_DAMAGETYPE),
    }));
  }

  private buildAddress(row: TableOrderVDS): string {
    const parts: string[] = [];

    // Улица — пока по ID, позже подставите название
    const street = streets.getItemById(row.FK_ORDERS_STREETS);
    if (row.FK_ORDERS_STREETS) parts.push(`${street?.name_ukr}`);
    if (row.HOUSENUM) parts.push(`буд. ${row.HOUSENUM.trim()}`);
    if (row.HOUSINGNUM) parts.push(`корп. ${row.HOUSINGNUM.trim()}`);
    if (row.APARTMENTNUM) parts.push(`кв. ${row.APARTMENTNUM.trim()}`);
    if (row.PORCHNUM) parts.push(`під'їзд ${row.PORCHNUM.trim()}`);
    if (row.PORCHKOD) parts.push(`код: ${row.PORCHKOD.trim()}`);

    return parts.length ? parts.join(", ") : "Адреса відсутня";
  }
}
