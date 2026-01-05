import { firebirdDb } from "../../../db/FirebirdDb";
import { QueryWithParams } from "../../services/helpTypes";
import { baseOrdersQueryPost, buildOrdersQuery } from "./ordersSearchQueries";
import { buildAddress } from "../address";
import logger from "../../../config/logger";
import {
  Order,
  OrderUniSearchFilters,
  OrderDatabase,
  OrderNsResponse,
  addressNsDatabase,
} from "../../../types/NS/orders/orderTypes";

import {
  streets,
  regions,
  brigadiers,
  officials,
  tubeDiameters,
  organisations,
} from "../../dictionaries/reference.cache";
import {
  nsDamageLocality,
  nsDamagePlace,
  nsDamageType,
  nsMessageTypes,
} from "../dictionaries/NsReferences.chache";

function orderMapper(o: Order): Order {
  return { ...o, netType: "NS" };
}

export class OrdersSearchService {
  private db = firebirdDb;

  public async getOrders(
    filters: OrderUniSearchFilters,
    forPost: boolean = false
  ): Promise<{
    total: number;
    data: OrderNsResponse[];
    filter: any;
  }> {
    logger.info("Get orders ns seaqrch ", {
      compontent: "OrdersSearchService",
    });
    try {
      const queryParams = forPost
        ? buildOrdersQuery(filters, baseOrdersQueryPost)
        : buildOrdersQuery(filters);

      const [data, totalResult] = await Promise.all([
        this.db.executeSelect<OrderDatabase>(queryParams.sql, [
          ...queryParams.params,
        ]),
        this.db.executeSelect<{ TOTAL: number }>(queryParams.countSql, [
          ...queryParams.params,
        ]),
      ]);

      return {
        total: totalResult[0]?.TOTAL ?? 0,
        data: this.humanizeOrders(data),
        filter: queryParams.newFilter,
      };
    } catch (err) {
      logger.error("Get Ns orders from base ", err, { context: "getOrders" });
      throw err;
    }
  }

  private humanizeOrders(raw: OrderDatabase[]): OrderNsResponse[] {
    const addresB: addressNsDatabase = {
      FK_STREETS: raw[0].FK_ORDERS_STREETS,
      HOUSENUM: raw[0].HOUSENUM,
      FK_HOUSETYPES: raw[0].FK_ORDERS_HOUSETYPES,
      ADDITIONALADDRESS: raw[0].ADDITIONALADDRESS,
    };
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
      official: officials.getItemById(r.FK_ORDERS_OFFICIALS),
      officialClosed: officials.getItemById(r.FK_ORDERS_OFFICIALCLOSED),
      streets: streets.getItemById(r.FK_ORDERS_STREETS),
      regions: regions.getItemById(r.FK_ORDERS_REGIONS),
      messageTypes: nsMessageTypes.getItemById(r.FK_ORDERS_MESSAGETYPES),
      damagePlace: nsDamagePlace.getItemById(r.FK_ORDERS_DAMAGEPLACE),
      damageLocality: nsDamageLocality.getItemById(r.FK_ORDERS_DAMAGEPLACE),
      addDamageLocality: nsDamageLocality.getItemById(
        r.FK_ORDERS_ADD_DAMAGELOCALITY
      ),

      tubeMaterial: null,
      diameter: tubeDiameters.getItemById(r.FK_ORDERS_DIAMETERS),
      damageType: nsDamageType.getItemById(r.FK_ORDERS_DAMAGETYPE),
      organization: organisations.getItemById(r.FK_ORDERS_ORGANISATIONS),
      withoutEquipment: null,
      soil: null,

      lastExcavationType: null,
      applicant: null,
      widthLot: r.WIDTHLOT,
      heightLot: r.HEIGHTTHREAD,
      withoutExcavation: r.FK_ORDERS_OFF_WITHOUTEXCAV,
      dateWithoutExcavation: r.DATETIME_WITHOUTEXCAV,
      isPayed: r.ISPAYED === 1,
      locationDepth: r.LOCATIONDEPTH,
      hoodCount: r.HOODCOUNT,
      flowSpeed: r.FLOWSPEED,
      speedQ: r.SPEEDQ,
      isRedLine: r.IS_REDLINE === 1,

      address: buildAddress({
        FK_STREETS: r.FK_ORDERS_STREETS,
        HOUSENUM: r.HOUSENUM,
        FK_HOUSETYPES: r.FK_ORDERS_HOUSETYPES,
        ADDITIONALADDRESS: r.ADDITIONALADDRESS,
      }),
      houseNum: r.HOUSENUM,
      addAddress: r.ADDITIONALADDRESS,
    }));
  }
  //   return raw.map((r) => ({
  //     id: r.ID,
  //     orderNumber: r.ORDERNUMBER,
  //     dateComing: r.DATECOMING,
  //     dateClosed: r.DATECLOSED,
  //     isClosed: r.ISCLOSED === 1,
  //     shiftNumber: r.SHIFTNUMBER,
  //     shiftNumberClose: r.SHIFTNUMBERCLOSE,
  //     factDateComing: r.FACTDATECOMING,
  //     factDateClosed: r.FACTDATECLOSED,
  //     isPjatihatky: r.IS_PJATIHATKY === 1,

  //     // Заглушки для справочников — замените на реальные данные из кэша/запросов
  //     official: r.FK_ORDERS_OFFICIALS
  //       ? officials.getItemById(r.FK_ORDERS_OFFICIALS)
  //       : null,
  //     officialClosed: officials.getItemById(r.FK_ORDERS_OFFICIALCLOSED),
  //     streets: streets.getItemById(r.FK_ORDERS_STREETS),
  //     // ? { id: r.FK_ORDERS_STREETS, name: "..." }
  //     // : null,
  //     regions: regions.getItemById(r.FK_ORDERS_REGIONS),
  //     messageTypes: vdsMessageTypes.getItemById(r.FK_ORDERS_MESSAGETYPES),
  //     brigadiers: brigadiers.getItemById(r.FK_ORDERS_BRIGADIERS),
  //     organisations: organisations.getItemById(r.FK_ORDERS_ORGANISATIONS),
  //     diameter: tubeDiameters.getItemById(r.FK_ORDERS_DIAMETERS),
  //     district: vdsDistricts.getItemById(r.FK_ORDERS_DISTRICT),
  //     // Адрес
  //     address: this.buildAddress(r),
  //     applicant: vdsApplicant.getItemById(r.FK_ORDERS_APPLICANT),

  //     applicantFio: r.APPLICANTFIO,
  //     applicantPhone: r.APPLICANTPHONE,

  //     additionalInfo: null,
  //     damagePlace: vdsDamagePlace.getItemById(r.FK_ORDER_DMAGEPLACE),
  //     damageType: vdsDamageType.getItemById(r.FK_ORDERS_DAMAGETYPE),
  //   }));
  // }
}
