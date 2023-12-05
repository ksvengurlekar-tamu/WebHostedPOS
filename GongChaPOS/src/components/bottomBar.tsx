import './components.css';
import { useNavigate } from 'react-router-dom';

interface BottomBarProps {
  onCheckout: () => void;
}
function bottomBar({ onCheckout }: BottomBarProps) {
  const navigate = useNavigate();
  
  const handleTransactions = () => {
    // Implement Transaction functionality here
    console.log('Transaction button clicked');
  };

  const handleOrders = () => {
    // Implement Order functionality here
    console.log('Order button clicked');
  };

  const handleNotifications = () => {
    // Implement Notification functionality here
    console.log('Notification button clicked');
  };

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