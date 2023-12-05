import { Link } from "react-router-dom";

/**
 * LeftNavBar Component
 *
 * A navigation component representing the left sidebar of the application.
 * It provides links to different views such as the main menu, nutritional facts,
 * and inventory (for the Manager View).
 *
 * @component
 *
 * @param {Object} props - The properties of the LeftNavBar component.
 * @param {string} props.view - The current view, which can be "Manager View" or "Cashier View".
 *
 * @returns {JSX.Element} The rendered LeftNavBar component.
 */
// view: input should be cashierView or managierView to set "main menu"'s path
function LeftNavBar({ view }: { view: string }) {

  return (
    <nav className="leftNavBar vh-100" aria-label="Main Navigation">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="leftNavButton" to={view === "Manager View" ? "/managerView" : "/cashierView"} aria-current={view === "Manager View" ? "page" : undefined}>
            Main Menu
          </Link>
        </li>
        <li className="nav-item m-1">
          <Link className="leftNavButton" to="/nutritionalFacts" aria-current={view === "Nutritional Facts" ? "page" : undefined}>
            Nutritional Facts
          </Link>
        </li>
        {view === "Manager View" &&
          <li className="nav-item">
            <Link className="leftNavButton" to="/inventory">
              Inventory
            </Link>
          </li>
        }
      </ul>
    </nav>

  );
}

export default LeftNavBar;
