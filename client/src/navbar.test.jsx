import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  test("renders without errors", () => {
    render(<Navbar />);
    const linkElement = screen.getByText(/cooked./i);
    expect(linkElement).toBeInTheDocument();
  });

  test("displays user profile information", async () => {
    render(<Navbar />);
    await waitFor(() => {
      const usernameElement = screen.getByText("testuser");
      expect(usernameElement).toBeInTheDocument();
    });
  });

  test("updates profile picture on file selection", async () => {
    render(<Navbar />);
    const file = new File(["(⌐□_□)"], "profile.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText("Choose file");
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      const profilePic = screen.getByAltText("User Profile Picture");
      expect(profilePic.src).toContain("profile.jpg");
    });
  });

  // Add more tests for other components, interactions, or functionality as needed
});
