import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home Component", () => {
  test("renders without errors", () => {
    render(<Home />);
    const headingElement = screen.getByText(/Welcome to/i);
    expect(headingElement).toBeInTheDocument();
  });

  test("displays search input", () => {
    render(<Home />);
    const searchInput = screen.getByPlaceholderText("Search by Username...");
    expect(searchInput).toBeInTheDocument();
  });

  test("displays all buttons", () => {
    render(<Home />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(7); // Update the number based on the actual number of buttons
  });

  // Add more tests for other specific components, interactions, or functionality as needed
});
