import { addressNsDatabase } from "../../types/NS/orders/orderTypes";
import { streets } from "../dictionaries/reference.cache";

export function buildAddress(row: addressNsDatabase): string {
  const parts: string[] = [];

  // Улица — пока по ID, позже подставите название
  const street = streets.getItemById(row.FK_STREETS);
  if (row.FK_STREETS) parts.push(`${street?.name_ukr}`);
  if (row.FK_HOUSETYPES == 0) {
    if (row.HOUSENUM) parts.push(`буд. ${row.HOUSENUM.trim()}`);
  }
  if (row.FK_HOUSETYPES == 1) {
    const street2 = streets.getItemById(parseInt(row.HOUSENUM));
    if (street2) parts.push(`/${street2?.name_ukr}`);
  }
  if (row.ADDITIONALADDRESS?.trim().length > 0)
    parts.push(`( ${row.ADDITIONALADDRESS.trim()})`);

  return parts.length ? parts.join(", ") : "Адреса відсутня";
}
