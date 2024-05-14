"use client";
import { useState } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import clsx from "clsx";
import { IPlanet, ISpaceship } from "@latitude/types";

export interface PlanetProps extends IPlanet {
  orbitSize: number;
  spaceship: ISpaceship;
  travelToPlanet: () => void;
  refuel: () => void;
}

export function Planet({
  name,
  size,
  color,
  isTheCurrentPlanet,
  hasRefuelStation,
  distanceFromSpaceship,
  fuelNeededToTravelTo,
  orbitSize,
  travelToPlanet,
  refuel,
  spaceship,
}: PlanetProps) {
  const [isOpen, setIsOpen] = useState(isTheCurrentPlanet);

  const isSpaceshipFuelFull =
    spaceship.tankCurrentAmountOfFuel === spaceship.tankCapacity;

  const refuelButtonDisabled = !isTheCurrentPlanet || isSpaceshipFuelFull;

  const fuelToTravelToIsNotEnough =
    fuelNeededToTravelTo > spaceship.tankCurrentAmountOfFuel;

  const hoverCardSide = isTheCurrentPlanet ? "bottom" : "top";

  function handleOnOpenChange(open: boolean) {
    if (!isTheCurrentPlanet) setIsOpen(open);
  }

  return (
    <HoverCard.Root open={isOpen} onOpenChange={handleOnOpenChange}>
      <HoverCard.Trigger asChild>
        <button
          style={{
            width: size,
            height: size,
            transform: `translateX(${orbitSize}px)`,
          }}
          className={clsx(
            "absolute z-[2]",
            color,
            isTheCurrentPlanet && "animate-pulse",
            isTheCurrentPlanet && "border-4 border-green-500",
            fuelToTravelToIsNotEnough
              ? "hover:border-red-600"
              : "hover:border-green-500",
            "rounded-full hover:border-4"
          )}
        />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="w-fit z-[3] flex flex-col gap-4 shadow-neutral-950 shadow-lg data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade rounded-md bg-neutral-900 p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
          sideOffset={15}
          side={hoverCardSide}
          align={"center"}
        >
          <div className="w-full text-center capitalize">[{name}]</div>
          {isTheCurrentPlanet && (
            <div className="text-green-500">You are here!</div>
          )}
          {isTheCurrentPlanet && (
            <div className="text-blue-500">
              Nearest planet to refuel:{" "}
              <span className="capitalize">
                {spaceship.nearestPlanetToRefuel}
              </span>
            </div>
          )}
          <div>
            Distance: {distanceFromSpaceship.toLocaleString()} kilometers
          </div>
          <div>
            Remaining fuel: {spaceship.tankCurrentAmountOfFuel.toLocaleString()}{" "}
            liters
          </div>
          <div className={clsx(fuelToTravelToIsNotEnough && "text-red-600")}>
            Fuel needed: {fuelNeededToTravelTo.toLocaleString()} liters
          </div>
          {!isTheCurrentPlanet && (
            <div className="w-full flex items-center justify-center">
              <button
                disabled={fuelToTravelToIsNotEnough}
                className="bg-gray-500 disabled:opacity-30 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={travelToPlanet}
              >
                🚀 Travel here!
              </button>
            </div>
          )}
          {hasRefuelStation && (
            <div className="w-full flex items-center justify-center">
              <button
                className="bg-gray-500 disabled:opacity-30 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={refuelButtonDisabled}
                onClick={refuel}
              >
                ⛽️ Refuel here!
              </button>
            </div>
          )}
          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
