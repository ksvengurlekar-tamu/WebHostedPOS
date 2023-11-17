import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Inventory from '../pages/inventory'; // Import from any directory



<Router>
  <Route path="/inventory" Component={Inventory} />
</Router>
// view: input should be cashierView or managierView to set "main menu"'s path
function LeftNavBar({ view }: { view: string }) {
  const navigate = useNavigate();

  // takes the text of click
  const navClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent the default behavior of the anchor element
    event.preventDefault();

    const href = event.currentTarget.getAttribute("href");

    if (href) {
      navigate(href);
    }
  };

  return (
    <>
      <nav className="leftNavBar vh-100">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href={view} onClick={navClick}>
              Main Menu
            </a>
          </li>
          <li className="nav-item">
            <a href="/nutritionalFacts" onClick={navClick}>
              Nutritional Facts
            </a>
          </li >
          {view === "/managerView" &&
            <li className="nav-item">
              <Link to="/inventory" onClick={navClick}>
                Inventory
              </Link>
            </li>
          }
        </ul>
      </nav>
    </>
  );
}

export default LeftNavBar;
