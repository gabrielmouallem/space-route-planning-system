"use client";
import { IPlanet, IPlanetNames, ISpaceship } from "@latitude/types";
import dynamic from "next/dynamic";
import {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  Dispatch,
} from "react";
import { PLANET_DISTANCES } from "./spaceNavigationContext.constants";
import {
  getInitialPlanetsState,
  getNearestRefuelPlanet,
  getRandomPlanet,
} from "./spaceNavigationContext.utils";

interface ISpaceNavigationState {
  spaceship: ISpaceship;
  planets: IPlanet[];
  currentPlanet: IPlanetNames;
}

interface ISpaceNavigationContext extends ISpaceNavigationState {
  dispatch: Dispatch<Action>;
}

interface ISpaceNavigationContextProviderProps {
  children: ReactNode;
}

const SpaceNavigationContext = createContext({} as ISpaceNavigationContext);

const initialPlanet = getRandomPlanet();

const planets = getInitialPlanetsState(initialPlanet);

const currentPlanet = planets.find((el) => el.isTheCurrentPlanet)!;

const INITIAL_STATE: ISpaceNavigationState = {
  spaceship: {
    tankCapacity: 90_000,
    comsumptionRatio: 0.0001,
    tankCurrentAmountOfFuel: 90_000,
    nearestPlanetToRefuel: getNearestRefuelPlanet(currentPlanet.name),
  },
  planets,
  currentPlanet: initialPlanet,
};

type Action =
  | { type: "TRAVEL_TO_PLANET"; planetName: IPlanetNames }
  | { type: "REFUEL_SPACESHIP" };

function reducer(
  state: ISpaceNavigationState,
  action: Action
): ISpaceNavigationState {
  switch (action.type) {
    case "TRAVEL_TO_PLANET": {
      const targetPlanet = state.planets.find(
        (planet) => planet.name === action.planetName
      );
      if (!targetPlanet) {
        return state;
      }

      const fuelNeeded =
        PLANET_DISTANCES[state.currentPlanet][action.planetName] *
        state.spaceship.comsumptionRatio;
      if (state.spaceship.tankCurrentAmountOfFuel < fuelNeeded) {
        return state; // Not enough fuel to travel
      }

      const updatedPlanets = state.planets.map((planet) => ({
        ...planet,
        isTheCurrentPlanet: planet.name === action.planetName,
        distanceFromSpaceship: PLANET_DISTANCES[action.planetName][planet.name],
        fuelNeededToTravelTo:
          PLANET_DISTANCES[action.planetName][planet.name] *
          state.spaceship.comsumptionRatio,
      }));

      return {
        ...state,
        spaceship: {
          ...state.spaceship,
          nearestPlanetToRefuel: getNearestRefuelPlanet(targetPlanet.name),
          tankCurrentAmountOfFuel:
            state.spaceship.tankCurrentAmountOfFuel - fuelNeeded,
        },
        planets: updatedPlanets,
        currentPlanet: action.planetName,
      };
    }
    case "REFUEL_SPACESHIP": {
      const currentPlanet = state.planets.find(
        (planet) => planet.isTheCurrentPlanet
      );
      if (!currentPlanet || !currentPlanet.hasRefuelStation) {
        return state; // Can't refuel if there's no refuel station
      }

      return {
        ...state,
        spaceship: {
          ...state.spaceship,
          tankCurrentAmountOfFuel: state.spaceship.tankCapacity,
        },
      };
    }
    default:
      return state;
  }
}

function SpaceNavigationContextProvider({
  children,
}: ISpaceNavigationContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <SpaceNavigationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SpaceNavigationContext.Provider>
  );
}

export const useSpaceNavigation = () => {
  const context = useContext(SpaceNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useSpaceNavigationContext can only be used inside SpaceNavigationContext"
    );
  }

  return context;
};

export default dynamic(() => Promise.resolve(SpaceNavigationContextProvider), {
  ssr: false,
});
