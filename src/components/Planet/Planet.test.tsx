import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Planet, PlanetProps } from "./Planet";
import { LanguageProvider } from "@latitude/i18n";
import userEvent from "@testing-library/user-event";

function renderWithLanguageProvider(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
  });
}

const mockPlanetProps: PlanetProps = {
  name: "earth",
  size: 50,
  color: "bg-blue-500",
  isTheCurrentPlanet: false,
  hasRefuelStation: true,
  distanceFromSpaceship: 100000,
  fuelNeededToTravelTo: 5000,
  orbitSize: 100,
  onTravelToPlanet: jest.fn(),
  onRefuel: jest.fn(),
  spaceship: {
    comsumptionRatio: 0.0001,
    tankCapacity: 90000,
    tankCurrentAmountOfFuel: 7000,
    nearestPlanetToRefuel: "mars",
  },
};

const DEFAULT_OPEN_DELAY_HOVER_CARD = 700;

describe("Planet Component", () => {
  it("should render Planet component", () => {
    const { getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} />
    );

    const planet = getByRole("button");
    expect(planet).toBeInTheDocument();
    expect(planet).toHaveClass("bg-blue-500");
  });

  it("should display planet name", async () => {
    const { getByText, getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} />
    );

    const planet = getByRole("button");
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });
  });

  it("should display current planet status", async () => {
    const { getByText } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} isTheCurrentPlanet />
    );

    expect(getByText("You are here!")).toBeInTheDocument();
  });

  it("should display nearest refuel station", () => {
    const { getByText } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} isTheCurrentPlanet />
    );

    expect(getByText("Nearest planet to refuel:")).toBeInTheDocument();
    expect(getByText("mars")).toBeInTheDocument();
  });

  it("should display distance from spaceship", async () => {
    const { getByText, getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} />
    );

    const planet = getByRole("button");
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    expect(getByText(/Distance: /i)).toBeInTheDocument();
    expect(getByText(/100,000/i)).toBeInTheDocument();
    expect(getByText(/kilometers/i)).toBeInTheDocument();
  });

  it("should display remaining fuel", async () => {
    const { getByText, getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} />
    );

    const planet = getByRole("button");
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    expect(getByText(/Remaining fuel:/i)).toBeInTheDocument();
    expect(getByText(/7,000/i)).toBeInTheDocument();
  });

  it("should display fuel needed", async () => {
    const { getByText, getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} />
    );

    const planet = getByRole("button");
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    expect(getByText(/Fuel needed: /i)).toBeInTheDocument();
    expect(getByText(/5,000/i)).toBeInTheDocument();
  });

  it("should travel button disabled state", async () => {
    const { getByText, getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} fuelNeededToTravelTo={8000} />
    );

    const planet = getByRole("button");
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    expect(getByRole("button", { name: "🚀 Travel here!" })).toBeDisabled();
  });

  it("should travel button click", async () => {
    const { getByText, getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} />
    );

    const planet = getByRole("button");
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    fireEvent.click(getByRole("button", { name: "🚀 Travel here!" }));
    expect(mockPlanetProps.onTravelToPlanet).toHaveBeenCalled();
  });

  it("should refuel button disabled state", async () => {
    const { getByText, getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} isTheCurrentPlanet={false} />
    );

    const planet = getByRole("button");
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    expect(getByRole("button", { name: "⛽️ Refuel here!" })).toBeDisabled();
  });

  it("should refuel button click", () => {
    const { getByRole } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} isTheCurrentPlanet />
    );
    fireEvent.click(getByRole("button", { name: "⛽️ Refuel here!" }));
    expect(mockPlanetProps.onRefuel).toHaveBeenCalled();
  });

  it("should hover card visibility", async () => {
    const { queryByText, getByText } = renderWithLanguageProvider(
      <Planet {...mockPlanetProps} />
    );

    const planet = document.getElementsByClassName("bg-blue-500")?.[0]!;
    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[earth]")).toBeVisible());

    await userEvent.unhover(planet);

    await waitFor(() => expect(queryByText("[earth]")).toBeNull(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });
  });
});
