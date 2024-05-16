"use client";
import React from "react";
import { ORBIT_SIZES } from "./page.constants";
import Sun from "@latitude/components/Sun";
import Orbit from "@latitude/components/Orbit";
import WelcomeDialog from "../components/WelcomeDialog";
import { useSpaceNavigation } from "@latitude/contexts/spaceNavigationContext/spaceNavigationContext";
import { IPlanetNames } from "@latitude/types";

export default function Home() {
  const { planets, spaceship, dispatch } = useSpaceNavigation();

  const handleRefuel = () => {
    dispatch({ type: "REFUEL_SPACESHIP" });
  };

  const handleTravelToPlanet = (planetName: IPlanetNames) => () => {
    dispatch({ type: "TRAVEL_TO_PLANET", planetName });
  };

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <WelcomeDialog />
      <div className="relative w-full h-full flex justify-center items-center">
        <Sun />
        {planets.map((planet, index) => (
          <Orbit
            key={`Orbit_${planet.name}_${index}`}
            size={ORBIT_SIZES[index]}
            planet={planet}
            spaceship={spaceship}
            onRefuel={handleRefuel}
            onTravelToPlanet={handleTravelToPlanet(planet.name)}
          />
        ))}
      </div>
    </main>
  );
}
