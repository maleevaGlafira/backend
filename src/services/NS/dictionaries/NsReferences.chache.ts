import { DamageLocalityService } from "./DamageLocality/DamageLocalityService";
import { DamagePlaceService } from "./DamagePlace/DamagePlaceService";
import { DamageTypeService } from "./DamaType/DamageTypeService";
import { MessageTypesService } from "./MessageTypes/MessageTypeService";
import { TubeDiametersService } from "../../dictionaries/TubeDiameters/TubeDiametersService";
import { SoilService } from "./Soil/SoilService";
import { ExcavationTypeService } from "./ExcavationType/ExcavationType";
import { TubeMaterialService } from "./TubeMaterial/TubeMaterialService";

export const nsDamageLocality = new DamageLocalityService();
export const nsDamagePlace = new DamagePlaceService();
export const nsDamageType = new DamageTypeService();
export const nsMessageTypes = new MessageTypesService();
export const nsTubeDiameters = new TubeDiametersService();
export const nsSoil = new SoilService();
export const nsExcavationTypes = new ExcavationTypeService();
export const nsTubeMaterial = new TubeMaterialService();
