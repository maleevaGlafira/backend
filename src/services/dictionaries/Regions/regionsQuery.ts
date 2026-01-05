export const getRegionsQuery = `
  SELECT id, name_ukr AS NAME_UKR ,name_ru NAME_RU FROM s_Regions ORDER BY name_ukr
`;
