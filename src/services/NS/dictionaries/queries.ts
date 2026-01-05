export const getRegionsQuery = `
  SELECT id, name_ukr AS name_ukr, name as name_ru FROM s_Regions where activity is null  ORDER BY name 
`;

export const getStreetsQuery = `
  SELECT ss.id id, ss.name_ukr AS name_ukr,
 ss.name_ru, st.NAME_UKR as st_name_ukr, st_r.NAME_RU as st_name_ru
   FROM s_Streets ss
 join s_streettypes  st on st.id=ss.FK_STREETS_STREETTYPES
 join s_streettypes  st_r on st_r.id=ss.FK_STREETS_STREETTYPES_RU
 where ss.ACTIVITY is null ORDER BY ss.name_ukr
`;

export const getDamageLocalitiesQuery = `select sd.id, sd.NAME name_ru, sd.NAME_UKR, sd.CLASSNUMBER from S_DAMAGELOCALITY sd 
where sd.ACTIVITY  is null
order by name_ukr`;

export const getDamagePlacesQuery = `select sdp.ID, sdp.NAME name_ru, sdp.NAME_UKR, sdp.CHACK_DIAM
 from S_DAMAGEPLACE sdp  where  sdp.ACTIVITY is null
 order by name_ukr`;

export const getDamageTypesQuery = `select id, name name_ru, name_ukr from S_DAMAGETYPE sdt where sdt.ACTIVITY is null
order by name_ukr`;

export const getTubeDiameters = `select id , diameter from s_tubediameter  where activity is null`;
export const getTubeMaterial = `select id, name name_ru, name_ukr from s_tubematerial sdt where sdt.ACTIVITY is null
order by name_ukr`;
export const getSoil = `select id, name name_ru, name_ukr from s_soil sdt where sdt.ACTIVITY is null
order by name_ukr`;
export const getExcavationType = `select id, workname name_ru, workname_ukr name_ukr, sdt."SEQUENCE"  from s_excavationworktypes sdt 
where sdt.ACTIVITY is null order by workname_ukr`;

export const getMessageTypes = `select id, messagename name_ru, name_ukr from s_messagetypes  where activity is null`;

export const getOfficials = `select id , name name_ru ,name_ukr  from s_officials so where activity is null`;
