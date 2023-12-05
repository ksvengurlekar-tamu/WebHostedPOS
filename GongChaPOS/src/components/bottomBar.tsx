/**
 * @file bottomBar.tsx
 * @description Bottom navigation bar component for the Gong Cha POS project.
 */
import './components.css';
import { useNavigate } from 'react-router-dom';

/**
 * @interface BottomBarProps
 * @description Props for configuring the BottomBar component.
 */
interface BottomBarProps {
  onCheckout: () => void;
}

/**
 * @function BottomBar
 * @description Bottom navigation bar component with various actions.
 * @param {BottomBarProps} props - Props for configuring the BottomBar component.
 * @returns {JSX.Element} Rendered BottomBar component.
 */
function bottomBar({ onCheckout }: BottomBarProps) {
  const navigate = useNavigate();

  /**
   * @function handleTransactions
   * @description Handles the click event for the Transactions button.
   */
  const handleTransactions = () => {
    // Implement Transaction functionality here
    console.log('Transaction button clicked');
  };

  /**
   * @function handleOrders
   * @description Handles the click event for the Orders button.
   */
  const handleOrders = () => {
    // Implement Order functionality here
    console.log('Order button clicked');
  };

  /**
   * @function handleNotifications
   * @description Handles the click event for the Notifications button.
   */
  const handleNotifications = () => {
    // Implement Notification functionality here
    console.log('Notification button clicked');
  };

  /**
   * @function handleLogout
   * @description Handles the click event for the Logout button.
   * Clears session storage and navigates to the home page.
   */
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="bottomNavBar" role="navigation" aria-label="Bottom Navigation">
      <button onClick={onCheckout} aria-label="Proceed to Checkout">
        Checkout
      </button>
      <button onClick={handleTransactions} aria-label="View Transactions">
        Transactions
      </button>
      <button onClick={handleOrders} aria-label="View Orders">
        Orders
      </button>
      <button onClick={handleNotifications} aria-label="View Notifications">
        Notifications
      </button>
      <button onClick={handleLogout} aria-label="Log Out of Account">
        Log Out
      </button>
    </div>
  );

}

export default bottomBar;
