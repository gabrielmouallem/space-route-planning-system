import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Home from "./page";
import { useSpaceNavigation } from "@latitude/contexts/spaceNavigationContext/spaceNavigationContext";
import { IPlanet, IPlanetNames } from "@latitude/types";
import { PLANETS } from "./page.constants";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@latitude/i18n";

function renderWithLanguageProvider(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
  });
}

const closeWelcomeDialog = async () => {
  await waitFor(() => {
    expect(
      screen.getByTestId("welcome-dialog-close-button")
    ).toBeInTheDocument();
  });
  const closeButton = screen.getByTestId("welcome-dialog-close-button");
  await userEvent.click(closeButton);

  await waitFor(() => {
    expect(
      screen.queryByText("🚀 Welcome to the Space Route Planning System!")
    ).toBeNull();
  });
};

// Mock the useSpaceNavigation hook
jest.mock(
  "@latitude/contexts/spaceNavigationContext/spaceNavigationContext",
  () => ({
    useSpaceNavigation: jest.fn(),
  })
);

const mockPlanets: IPlanet[] = PLANETS.map((planet) => ({
  ...planet,
  distanceFromSpaceship: 0,
  fuelNeededToTravelTo: 0,
  isTheCurrentPlanet: planet.name === "earth",
  hasRefuelStation: true,
}));

const mockDispatch = jest.fn();

const DEFAULT_OPEN_DELAY_HOVER_CARD = 700;

describe("Home Component", () => {
  beforeEach(async () => {
    (useSpaceNavigation as jest.Mock).mockReturnValue({
      planets: mockPlanets,
      spaceship: {
        tankCapacity: 90000,
        comsumptionRatio: 0.0001,
        tankCurrentAmountOfFuel: 7000,
        nearestPlanetToRefuel: "mars" as IPlanetNames,
      },
      dispatch: mockDispatch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Home component with planets", () => {
    const { getAllByRole } = renderWithLanguageProvider(<Home />);

    PLANETS.forEach((planet, index) => {
      const planets = getAllByRole("button");
      expect(planets[index]).toBeInTheDocument();
      expect(planets[index]).toHaveClass(planet.color);
    });
  });

  it("should handle traveling to a planet", async () => {
    const { getByRole, getByText, debug } = renderWithLanguageProvider(
      <Home />
    );
    await closeWelcomeDialog();

    // A planet rather than earth (Venus) since we cannot travel to our current planet
    const planet = document.getElementsByClassName("bg-yellow-300")?.[1]!; // [1] since [0] wil return the Sun component

    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[venus]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    const travelButton = getByRole("button", { name: /🚀 Travel here!/i });
    fireEvent.click(travelButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "TRAVEL_TO_PLANET",
        planetName: "venus",
      });
    });
  });

  it("should handle refueling the spaceship", async () => {
    const { getByText, getAllByRole } = renderWithLanguageProvider(<Home />);
    await closeWelcomeDialog();

    // A planet rather than earth (Mercury) since we won't need to refuel if we did not traveled to any planet yet
    const planet = document.getElementsByClassName("bg-white")?.[0]!; // [1] since [0] wil return the Sun component

    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[mercury]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    const refuelButtons = getAllByRole("button", {
      name: /⛽️ Refuel here!/i,
    });

    const mercuryRefuelButton = refuelButtons.find(
      (el) => !(el as HTMLButtonElement)?.disabled
    )!;

    fireEvent.click(mercuryRefuelButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: "REFUEL_SPACESHIP" });
    });
  });

  it("should disable travel button if fuel is not enough", async () => {
    (useSpaceNavigation as jest.Mock).mockReturnValue({
      planets: mockPlanets.map((planet) => ({
        ...planet,
        fuelNeededToTravelTo: 8000,
      })),
      spaceship: {
        tankCapacity: 90000,
        comsumptionRatio: 0.0001,
        tankCurrentAmountOfFuel: 7000,
        nearestPlanetToRefuel: "mercury" as IPlanetNames,
      },
      dispatch: mockDispatch,
    });

    const { getByText, getByRole } = renderWithLanguageProvider(<Home />);
    await closeWelcomeDialog();

    // Mercury
    const planet = document.getElementsByClassName("bg-white")?.[0]!; // [1] since [0] wil return the Sun component

    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[mercury]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    const travelButton = getByRole("button", { name: /🚀 Travel here!/i });
    expect(travelButton).toBeDisabled();
  });

  it("should display current planet status", async () => {
    const { getByText } = renderWithLanguageProvider(<Home />);
    await closeWelcomeDialog();

    expect(getByText("You are here!"));
    expect(getByText("[earth]"));
  });

  it("should display nearest refuel station", async () => {
    const { getByText } = renderWithLanguageProvider(<Home />);
    await closeWelcomeDialog();

    expect(getByText("Nearest planet to refuel:")).toBeInTheDocument();
    expect(getByText("mars")).toBeInTheDocument();
  });

  it("should display distance from spaceship", async () => {
    const { getByText } = renderWithLanguageProvider(<Home />);
    await closeWelcomeDialog();

    // A planet rather than earth (Mercury) since we won't need to refuel if we did not traveled to any planet yet
    const planet = document.getElementsByClassName("bg-white")?.[0]!; // [1] since [0] wil return the Sun component

    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[mercury]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    expect(getByText(/Distance: /i)).toBeInTheDocument();
    expect(getByText(/0/i)).toBeInTheDocument();
    expect(getByText(/kilometers/i)).toBeInTheDocument();
  });

  it("should display remaining fuel", async () => {
    const { getByText, getAllByText } = renderWithLanguageProvider(<Home />);
    await closeWelcomeDialog();

    // A planet rather than earth (Mercury) since we won't need to refuel if we did not traveled to any planet yet
    const planet = document.getElementsByClassName("bg-white")?.[0]!; // [1] since [0] wil return the Sun component

    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[mercury]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    expect(getAllByText(/Remaining fuel:/i)[0]).toBeInTheDocument();
    expect(getAllByText(/7,000/i)[0]).toBeInTheDocument();
    expect(getAllByText(/liters/i)[0]).toBeInTheDocument();
  });

  it.skip("should display fuel needed", async () => {
    const { getByText } = renderWithLanguageProvider(<Home />);
    await closeWelcomeDialog();

    // A planet rather than earth (Mercury) since we won't need to refuel if we did not traveled to any planet yet
    const planet = document.getElementsByClassName("bg-white")?.[0]!; // [1] since [0] wil return the Sun component

    await userEvent.hover(planet);

    await waitFor(() => expect(getByText("[mercury]")).toBeInTheDocument(), {
      timeout: DEFAULT_OPEN_DELAY_HOVER_CARD,
    });

    console.log(getByText(/Fuel needed:/i).outerHTML);

    expect(getByText(/Fuel needed:/i)).toBeInTheDocument();
    expect(getByText(/0/i)).toBeInTheDocument();
    expect(getByText(/liters/i)).toBeInTheDocument();
  });
});
