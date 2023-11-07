import React from 'react'
import './components.css';

function bottomBar() {
  const handleCheckout = () => {
    // Implement Checkout functionality here
    console.log('Checkout button clicked');
  };

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
    // Implement Log Out functionality here
    console.log('Log Out button clicked');
  };

  return (
    <div className="bottomNavBar">
      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={handleTransactions}>Transactions</button>
      <button onClick={handleOrders}>Orders</button>
      <button onClick={handleNotifications}>Notifications</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );

  return (
    <>
      <nav className='bottomNavBar'>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <a className='nav-link' href='/cashierView'>Checkout</a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/cashierView'>Transactions</a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/cashierView'>Orders</a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/cashierView'>Notifications</a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/cashierView'>Log Out</a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default bottomBar;