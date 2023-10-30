import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/logIn.tsx'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  </React.StrictMode>,
)
