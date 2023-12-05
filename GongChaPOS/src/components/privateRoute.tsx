import React from 'react';
import { Navigate } from 'react-router-dom';
import CashierView from './../pages/cashierView'; // Import the ManagerView component
import Inventory from './../pages/inventory';

// const PrivateRoute: React.FC<RouteProps> = ( { children }) => {
//   const userRole = sessionStorage.getItem('userRole');

//   const isAuthenticated = true; // Code for authentication goes here

//   if (isAuthenticated) {
//     return children;
//   }

//   if (userRole === 'manager' && toRender === 'managerView') {
//     if ()
    
//     return <CashierView view="Manager View" />;
//   }
//   if (userRole === 'inventory') {
//     return <Inventory />;
//   }
//   if (userRole === 'cashier') {
//     return <CashierView view="Cashier View" />;
//   }

//   // Redirect to login page if not authenticated
//   return <Navigate to="/login" />;
// };

/**
 * PrivateRoute Component
 *
 * A component for handling private routes based on user roles.
 *
 * @component
 *
 * @param {Object} props - The properties of the PrivateRoute component.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the PrivateRoute.
 * @param {string} props.toRender - The view to render based on the user's role.
 * @param {string} props.role - The required role for accessing the route.
 *
 * @returns {JSX.Element} The rendered PrivateRoute component.
 */
type PrivateRouteProps = {
  children: React.ReactNode;
  toRender: string;
  role: string;
};

function PrivateRoute({ toRender, role }: PrivateRouteProps) {
  const userRole = sessionStorage.getItem('userRole'); // This could be a Redux selector, a Context API value, or a function that retrieves the role from local storage or session storage.

  if (userRole === role) {
    // If the user does not have the required role, redirect them to the login page.
    if (role === "manager") {
      if (toRender === "managerView") {
        return <CashierView view="Manager View" />;
      }
      if (toRender === "inventory") {
        return <Inventory />;
      }
    }
    else if (role === "cashier") {
      return <CashierView view="Cashier View" />;
    }
  }

  return <Navigate to="/login" />;
}

export default PrivateRoute;
