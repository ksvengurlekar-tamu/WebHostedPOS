import React from 'react'
import LeftNavBar from '../components/leftnavbar.tsx'
import '../components/components.css';

function CashierView() {
  
  return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'>
            <LeftNavBar />
          </div>
          <div className='col-md-9'>
            show some menu item cards here
          </div>
        </div>
      </div>
    );
}

export default CashierView;