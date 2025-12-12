import { BrigadiersService } from "./BrigadiersService/BrigadiersService";
import { OrganisatrionService } from "./Organsation/OrganisationService";
import { RegionsService } from "./Regions/RegionsService";
import { StreetsService } from "./Streets/streetService";
import { TypeWorkService } from "./TypeWorks/TypeWorkService";
import { OfficialsService } from "./officials/OfficialsService";
import { TubeDiametersService } from "./TubeDiameters/TubeDiametersService";

export const regions = new RegionsService();
export const streets = new StreetsService();
export const officials = new OfficialsService();
export const brigadiers = new BrigadiersService();
export const organisations = new OrganisatrionService();
export const reus = new RegionsService();
export const typeWorks = new TypeWorkService();
export const tubeDiameters = new TubeDiametersService();
export async function loadMainCache() {
  console.log("load Main");
  const [
    regionsData,
    streetsData,
    officialsData,
    brigadiersData,
    organisationsData,
    reusData,
    typeWorksData,
    tubeDiametersData,
  ] = await Promise.all([
    regions.getData(),
    streets.getData(),
    officials.getData(),
    brigadiers.getData(),
    organisations.getData(),
    reus.getData(),
    typeWorks.getData(),
    tubeDiameters.getData(),
  ]);
}
