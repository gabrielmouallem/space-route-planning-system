import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider, useLanguage } from "@latitude/i18n";
import LanguageSelector from "./LanguageSelector";

// Test component to check i18n text rendering
function TestLanguageComponent() {
  const { translate } = useLanguage();

  return (
    <div>
      <LanguageSelector />
      <div data-testid="i18n-text">{translate("earth")}</div>
    </div>
  );
}

// Helper function to render components with LanguageProvider wrapper
function renderWithLanguageProvider(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
  });
}

describe("LanguageSelector", () => {
  it("should render with default language and with the proper options", async () => {
    const { getByText, queryByText, getByRole, queryAllByRole } =
      renderWithLanguageProvider(<LanguageSelector />);

    // Default language should be EN-US
    expect(getByText("EN-US")).toBeInTheDocument();
    expect(queryByText("PT-BR")).toBeNull();

    // No menu items should be displayed initially
    expect(queryAllByRole("menuitem").length).toBe(0);

    // Click the selector button to show language options
    const selectorButton = getByRole("button", { name: "EN-US" });
    await userEvent.click(selectorButton);

    // Two menu items should be displayed
    const menuItems = queryAllByRole("menuitem");
    expect(menuItems.length).toBe(2);

    // Check if both language options are displayed
    const [enOption, ptOption] = menuItems;
    expect(ptOption).toHaveTextContent("PT-BR");
    expect(enOption).toHaveTextContent("EN-US");
  });

  it("should switch to Portuguese when PT-BR is selected and back to English when EN-US is selected", async () => {
    const { getByRole, queryByRole, queryAllByRole } =
      renderWithLanguageProvider(<LanguageSelector />);

    // No menu items should be displayed initially
    expect(queryAllByRole("menuitem").length).toBe(0);

    // Click the selector button to show language options
    const selectorButton = getByRole("button", { name: "EN-US" });
    await userEvent.click(selectorButton);

    // Select PT-BR and verify the button text changes
    const ptOption = getByRole("menuitem", { name: "PT-BR" });
    await userEvent.click(ptOption);

    // Menu should close and button text should change to PT-BR
    expect(queryAllByRole("menuitem").length).toBe(0);
    expect(getByRole("button", { name: "PT-BR" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "EN-US" })).toBeNull();

    // Click the selector button to show language options again
    await userEvent.click(getByRole("button", { name: "PT-BR" }));

    // Select EN-US and verify the button text changes back
    const enOption = getByRole("menuitem", { name: "EN-US" });
    await userEvent.click(enOption);

    expect(getByRole("button", { name: "EN-US" })).toBeInTheDocument();
  });

  it("should switch language from a component using the i18n text", async () => {
    const { getByRole, getByTestId } = renderWithLanguageProvider(
      <TestLanguageComponent />
    );

    // i18n text should be in EN-US by default
    expect(getByTestId("i18n-text")).toHaveTextContent("earth");

    // Click the selector button to show language options
    const selectorButton = getByRole("button", { name: "EN-US" });
    await userEvent.click(selectorButton);

    // Select PT-BR and verify the i18n text changes
    const ptOption = getByRole("menuitem", { name: "PT-BR" });
    await userEvent.click(ptOption);

    expect(getByTestId("i18n-text")).toHaveTextContent("terra");

    // Click the selector button to show language options again
    await userEvent.click(getByRole("button", { name: "PT-BR" }));

    // Select EN-US and verify the i18n text changes back
    const enOption = getByRole("menuitem", { name: "EN-US" });
    await userEvent.click(enOption);

    expect(getByTestId("i18n-text")).toHaveTextContent("earth");
  });
});
