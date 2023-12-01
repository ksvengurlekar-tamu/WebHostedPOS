import React from 'react';
import { RouteProps, Navigate } from 'react-router-dom';
// import ManagerView from './ManagerView'; // Import the ManagerView component

const PrivateRoute: React.FC<RouteProps> = ({ children }) => {
  

  const isAuthenticated = false; // Code for authentication goes here

  if (isAuthenticated) {
    return children;
  }

  // if (React.isValidElement(children) && children.type === ManagerView) {
  //   // Handle specific logic for <ManagerView> component
  //   // For example, you can redirect to a different route or show a different component
  //   return <Navigate to="/manager-login" />;
  // }

  // Redirect to login page if not authenticated
  return <Navigate to="/login" />;
};

export default PrivateRoute;
