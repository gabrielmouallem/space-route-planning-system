"use client";
import * as HoverCard from "@radix-ui/react-hover-card";

export function Sun() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div className="absolute z-[2] cursor-pointer top-1/2 left-1/2 w-52 h-52 bg-yellow-300 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="w-fit z-[3] data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade rounded-md bg-neutral-900 p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
          sideOffset={15}
          side="top"
          align="center"
        >
          <div className="w-full text-center capitalize">[Sun]</div>
          <div className="text-center">
            ⚠️ It is too hot for you here! ⚠️
          </div>{" "}
          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
