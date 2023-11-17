import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Inventory from '../pages/inventory'; // Import from any directory



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
            <Link className="leftNavButton" to={view == "Manager View" ? "/managerView" : "/cashierView"}>Main Menu</Link>
          </li>
          <li className="nav-item m-1">
            <Link className="leftNavButton" to="/nutritionalFacts">Nutritional Facts</Link>
          </li>
          { view === "Manager View" &&
            <li className="nav-item">
              <Link className="leftNavButton" to="/inventory">Inventory</Link>
            </li>
          }
        </ul>
      </nav>
    </>
  );
}

export default LeftNavBar;
