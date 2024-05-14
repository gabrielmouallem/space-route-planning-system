export type IPlanetNames =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export interface IPlanet {
  name: IPlanetNames;
  size: number;
  color: string;
  hasRefuelStation: boolean;
  distanceFromSpaceship: number;
  fuelNeededToTravelTo: number;
  isTheCurrentPlanet: boolean;
}

export interface ISpaceship {
  tankCapacity: number;
  tankCurrentAmountOfFuel: number;
  comsumptionRatio: number;
  nearestPlanetToRefuel: string;
}
