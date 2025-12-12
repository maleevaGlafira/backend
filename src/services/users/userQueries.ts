export const GET_ALL_USERS_QUERY = `
  SELECT
    su.id,
    su.IB_PWD,
    su.ID_GROUP,
    so.NAME AS name_disp,
    so.NAME_ukr AS name_disp_uk,
    su.NAME AS name_ruk,
    so.id AS id_disp  
  FROM
    sec_users su
  left JOIN
    S_OFFICIALS so ON so.id = su.EXTERNAL_ID
`;

export const GET_USER_BY_CREDENTIALS_QUERY = `
  SELECT
    su.id,
    su.IB_PWD,
    su.ID_GROUP,
    so.NAME AS name_disp,
    so.NAME_UKR AS name_disp_uk,
    su.NAME AS name_ruk,
    so.id AS id_disp
  FROM
    sec_users su
  left JOIN
    S_OFFICIALS so ON so.id = su.EXTERNAL_ID
  WHERE
    su.id = ? AND su.IB_PWD = ?
`;
