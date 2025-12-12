import { DamageLocalityService } from "./DamageLocality/DamageLocalityService";
import { DamagePlaceService } from "./DamagePlace/DamagePlaceService";
import { DamageTypeService } from "./DamaType/DamageTypeService";
import { MessageTypesService } from "./MessageTypes/MessageTypeService";
import { TubeDiametersService } from "../../dictionaries/TubeDiameters/TubeDiametersService";

export const nsDamageLocality = new DamageLocalityService();
export const nsDamagePlace = new DamagePlaceService();
export const nsDamageType = new DamageTypeService();
export const nsMessageTypes = new MessageTypesService();
export const nsTubeDiameters = new TubeDiametersService();

export async function LoadNSCache() {
  console.log("load Main");
  const [
    nsDamageLocalitiesData,
    nsDamagePlacesData,
    nsDamageTypesData,
    nsMessageTypesData,
    nsTubeDiametersData,
  ] = await Promise.all([
    nsDamageLocality.getData(),
    nsDamagePlace.getData(),
    nsDamageType.getData(),
    nsMessageTypes.getData(),
    nsTubeDiameters.getData(),
  ]);
}
