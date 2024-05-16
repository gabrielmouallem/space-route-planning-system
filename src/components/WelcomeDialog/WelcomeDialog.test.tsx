import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@latitude/i18n";
import { WelcomeDialog } from "./WelcomeDialog";

// Helper function to render components with LanguageProvider wrapper
function renderWithLanguageProvider(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
  });
}

// Testing behaviour instead of styles and UI
describe("WelcomeDialog", () => {
  it("should close the dialog when the close button is clicked", async () => {
    const { getByText, queryByText, getByTestId, debug } =
      renderWithLanguageProvider(<WelcomeDialog />);
    debug();
    // Check if the dialog is initially open
    expect(
      getByText("🚀 Welcome to the Space Route Planning System!")
    ).toBeInTheDocument();

    // Click the close button
    const closeButton = getByTestId("welcome-dialog-close-button");
    await userEvent.click(closeButton);

    // Check if the dialog is closed
    expect(
      queryByText("🚀 Welcome to the Space Route Planning System!")
    ).toBeNull();
  });
});
