export const getApplicant = `select sa.ID, sa.NAME name_ru, sa.NAME_UKR
 from S_APPLICANT_VDS sa where sa.ACTIVITY is null order by id`;
export const getDamagePlace = `select  sa.id, sa.NAME name_ru, sa.NAME_UKR  from S_DAMAGEPLACE_VDS sa where sa.ACTIVITY is null order by id`;
export const getDamageType = `select  sa.id, sa.NAME name_ru, sa.NAME_UKR  from S_DAMAGETYPE_VDS sa where sa.ACTIVITY is null order by id`;
export const getDistricts = `select id, name names_ru, name_ukr from S_DISTRICT_VDS    `;
export const getMessageTypes = `select id, sa.MESSAGENAME names_ru, sa.MESSAGENAME_UKR name_ukr,  sa.GROUP_MESSAGE from S_MESSAGETYPES_VDS sa`;
