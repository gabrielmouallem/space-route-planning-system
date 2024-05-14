import { PLANETS } from "@latitude/app/page.constants";
import { IPlanet, IPlanetNames } from "@latitude/types";
import {
  PLANET_DISTANCES,
  REFUEL_STATIONS,
} from "./spaceNavigationContext.constants";

export function getNearestRefuelPlanet(
  currentPlanet: IPlanetNames
): IPlanetNames {
  let nearestPlanet: IPlanetNames = "earth";
  let shortestDistance: number = Infinity;

  for (const refuelStation of REFUEL_STATIONS) {
    const distance = PLANET_DISTANCES[currentPlanet][refuelStation];
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestPlanet = refuelStation;
    }
  }

  return nearestPlanet;
}

export function getRandomPlanet(): IPlanetNames {
  const planetNames = PLANETS.map((planet) => planet.name);
  return planetNames[
    Math.floor(Math.random() * planetNames.length)
  ] as IPlanetNames;
}

export function getInitialPlanetsState(currentPlanet: IPlanetNames): IPlanet[] {
  return PLANETS.map((planet) => {
    const distanceFromSpaceship = PLANET_DISTANCES[currentPlanet][planet.name];
    const fuelNeededToTravelTo = distanceFromSpaceship * 0.0001;

    return {
      ...planet,
      hasRefuelStation: REFUEL_STATIONS.includes(planet.name),
      distanceFromSpaceship,
      fuelNeededToTravelTo,
      nearestPlanetToRefuel: getNearestRefuelPlanet(planet.name),
      isTheCurrentPlanet: planet.name === currentPlanet,
    };
  });
}
