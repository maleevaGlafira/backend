import { FbUser, AuthUser } from "../../types/user";

export function mapFbUserToAuthUser(fbUser: FbUser) {
  const displayName =
    fbUser.NAME_RUK && fbUser.NAME_RUK.trim()
      ? fbUser.NAME_RUK.trim()
      : fbUser.NAME_DISP_UK
      ? fbUser.NAME_DISP_UK.trim()
      : fbUser.NAME_DISP.trim();
  return <AuthUser>{
    id: fbUser.ID,
    role_: fbUser.ID_GROUP,
    id_disp: fbUser.ID_DISP,
    full_name_ukr: displayName,
    display_name: displayName,
  };
}
