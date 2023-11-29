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


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cashierView" element={<CashierView view="Cashier View" />} />
        <Route path="/managerView" element={<CashierView view="Manager View" />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customerView" element={<CustomerView />} />
        <Route path="/menuBoard" element={<MenuBoard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
