import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Usars from "./Users";
import { AuthContext } from "../../config/AuthProvider";

// filepath: src/screens/dashboard/Users.test.jsx

// Mock components
jest.mock("../../components/dashboard/Header", () => () => <div>Header</div>);
jest.mock("../../components/dashboard/users/TableUser", () => ({ refresh }) => <div data-testid="table-user">{String(refresh)}</div>);
jest.mock("../../components/dashboard/ButtonCreate", () => ({ onSave }) => (
  <button onClick={onSave}>Crear usuario</button>
));
jest.mock("../../components/dashboard/users/CreateUserModal", () => () => <div>NewUserModal</div>);
jest.mock("../../components/dashboard/users/AssignFarmContainer", () => ({ onSave }) => (
  <button onClick={onSave}>AssignFarm</button>
));
jest.mock("react-router-dom", () => ({
  Navigate: () => <div>Navigate</div>
}));

describe("Usars component", () => {
  it("should toggle refreshTable when handleSave is called via ButtonCrear", async () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: true }}>
        <Usars />
      </AuthContext.Provider>
    );
    // Initial render: refreshTable is false
    expect(screen.getByTestId("table-user").textContent).toBe("false");
    // Click ButtonCrear to trigger handleSave
    await userEvent.click(screen.getByText("Crear usuario"));
    // refreshTable should now be true
    expect(screen.getByTestId("table-user").textContent).toBe("true");
    // Click again to toggle back
    await userEvent.click(screen.getByText("Crear usuario"));
    expect(screen.getByTestId("table-user").textContent).toBe("false");
  });

  it("should toggle refreshTable when handleSave is called via AssignFarmContainer", async () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: true }}>
        <Usars />
      </AuthContext.Provider>
    );
    // Initial render: refreshTable is false
    expect(screen.getByTestId("table-user").textContent).toBe("false");
    // Click AssignFarmContainer to trigger handleSave
    await userEvent.click(screen.getByText("AssignFarm"));
    // refreshTable should now be true
    expect(screen.getByTestId("table-user").textContent).toBe("true");
  });

  it("should redirect if not authenticated", () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false }}>
        <Usars />
      </AuthContext.Provider>
    );
    expect(screen.getByText("Navigate")).toBeInTheDocument();
  });
});