import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/logIn.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CashierView from "./pages/cashierView.tsx";
import Inventory from "./pages/inventory.tsx";
import Landing from "./pages/landing.tsx";
import CustomerView from "./pages/customerView.tsx";
import MenuBoard from "./pages/menuBoard.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { LanguageProvider } from './components/languageContext';
import PrivateRoute from "./components/privateRoute.tsx";

/**
 * Entry point for the React application.
 *
 * Renders the application using React Router for navigation.
 * Includes routes for the landing page, login, cashier view, manager view, inventory,
 * customer view, and menu board.
 *
 * @component
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/cashierView" element={
              <PrivateRoute toRender="cashierView" role="cashier">
                <CashierView view="Cashier View" />
              </PrivateRoute>
            } 
          />
          <Route path="/managerView" element={
              <PrivateRoute toRender="managerView" role="manager">
                <CashierView view="Manager View" />
              </PrivateRoute>
            } 
          />
          <Route path="/inventory" element={
              <PrivateRoute toRender="inventory" role="manager">
                <Inventory />
              </PrivateRoute>
            } 
          />

          <Route path="/customerView" element={<CustomerView />} />
          <Route path="/menuBoard" element={<MenuBoard />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
