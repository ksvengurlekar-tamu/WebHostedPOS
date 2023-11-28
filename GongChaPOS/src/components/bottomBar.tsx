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
    <div className="bottomNavBar">
      <button onClick={onCheckout}>Checkout</button>
      <button onClick={handleTransactions}>Transactions</button>
      <button onClick={handleOrders}>Orders</button>
      <button onClick={handleNotifications}>Notifications</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );

}

export default bottomBar;