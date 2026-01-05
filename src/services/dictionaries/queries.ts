export const getOrganisation = `SELECT a.ID, a.NAME name_ru, a.PHONE,  a.NAME_UKR
FROM S_ORGANISATIONS a where activity is null`;
export const getReu = `SELECT a.ID, a.KOD, a.NAME name_ru,  a.NAME_UKR
FROM S_TYP_NREV  a where activity is null`;
export const getTypeWorks = `SELECT a.ID, a.NAME name_ru,  a.NAME_UKR
FROM S_TYPE_WORKS a where activity is null`;
export const getBrigadiers = `SELECT a.ID, a.NAME name_ru, a.NAME_UKR,  a.FK_BRIGADIERS_REGIONS,  a.ID_REGION, a.PR_NS_VDS,   1 pr_water_kan
FROM BRIGADIERS a where activity is null`;
export const getWorkers = `select ww.id, ww.name name_ru, ww.name_ukr, ww.id_region, ww.pr_ns_vds, 1 pr_water_kan
 from workers ww where activity is null order by id`;
