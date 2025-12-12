import { ApplicantService } from "./Applicant/ApplicantService";
import { DamagePlaceService } from "./DamagePlace/DamagePlaceService";
import { DamageTypeService } from "./DamageType/DamageTypeService";
import { MessageTypeService } from "./MessageType/MessageTypeService";
import { DistrictsService } from "./District/DistrictService";

export const vdsApplicant = new ApplicantService();
export const vdsDamagePlace = new DamagePlaceService();
export const vdsDamageType = new DamageTypeService();
export const vdsMessageTypes = new MessageTypeService();
export const vdsDistricts = new DistrictsService();

export async function LoadVDSCache() {
  console.log("load Main");
  const [
    vdsApplicantsData,
    vdsDamagePlacesData,
    vdsDamageTypesData,
    vdsMessageTypesData,
    vdsDistrictsData,
  ] = await Promise.all([
    vdsApplicant.getData(),
    vdsDamagePlace.getData(),
    vdsDamageType.getData(),
    vdsMessageTypes.getData(),
    vdsDistricts.getData(),
  ]);
}
