import { IPlanet, ISpaceship } from "@latitude/types";
import Planet from "../Planet";

interface OrbitProps {
  size: number;
  planet: IPlanet;
  spaceship: ISpaceship;
  travelToPlanet: () => void;
  refuel: () => void;
}

export function Orbit({
  size,
  planet,
  spaceship,
  travelToPlanet,
  refuel,
}: OrbitProps) {
  return (
    <>
      <div
        className="absolute z-0 rounded-full border border-white border-opacity-50 rotate-[135deg]"
        style={{
          width: size * 2,
          height: size * 2,
        }}
      />
      <Planet
        {...planet}
        orbitSize={size}
        spaceship={spaceship}
        travelToPlanet={travelToPlanet}
        refuel={refuel}
      />
    </>
  );
}
