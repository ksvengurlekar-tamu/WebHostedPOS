import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/logIn.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CashierView from './pages/cashierView.tsx'
import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cashierView" element={<CashierView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
