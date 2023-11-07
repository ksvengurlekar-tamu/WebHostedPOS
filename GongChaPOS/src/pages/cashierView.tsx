import React from 'react'
import LeftNavBar from '../components/leftnavbar.tsx'
import TopBar from '../components/topBar.tsx'
import BottomBar from '../components/bottomBar.tsx'
import Card from '../components/card.tsx';
import CategoryGrid from '../components/categoryGrid.tsx';
import '../components/components.css'; // Add this line

function CashierView() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <LeftNavBar />
        </div>
        <div className="col-md-9">
          <TopBar />
          <div className='categoryGrid'>

          </div>
          <CategoryGrid />
          <BottomBar />
        </div>
      </div>
    </div>
  );
}

export default CashierView;