// Вспомогательная функция для парсинга даты из "dd.mm.yyyy hh:mm"
export const parseDateTime = (input: string): Date | null => {
  if (!input || typeof input !== "string") return null;

  // 1. Формат: dd.mm.yyyy hh:mm  или  dd.mm.yyyy
  const euPattern = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/;
  const euMatch = input.match(euPattern);
  if (euMatch) {
    const [, dd, mm, yyyy, hh = "0", min = "0"] = euMatch;
    const iso = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(
      2,
      "0"
    )}T${String(hh).padStart(2, "0")}:${String(min).padStart(2, "0")}:00Z`;
    console.log("!!parseDateTime - iso=", iso);
    const date = new Date(iso);
    console.log("!!parseDateTime - date=", date);
    return isNaN(date.getTime()) ? null : date;
  }

  // 2. Формат: yyyy-mm-dd или yyyy-mm-ddThh:mm
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s]?(\d{1,2}):(\d{2}))?$/;
  const isoMatch = input.match(isoPattern);
  if (isoMatch) {
    const [, yyyy, mm, dd, hh = "0", min = "0"] = isoMatch;
    const iso = `${yyyy}-${mm}-${dd}T${String(hh).padStart(2, "0")}:${String(
      min
    ).padStart(2, "0")}:00Z`;
    const date = new Date(iso);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};
