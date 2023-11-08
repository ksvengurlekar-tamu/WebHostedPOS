import React from "react";
import LeftNavBar from "../components/leftnavbar.tsx";
import TopBar from "../components/topBar.tsx";
import BottomBar from "../components/bottomBar.tsx";
import CategoryGrid from "../components/categoryGrid.tsx";
import CartView from "../components/cartView.tsx";
import "../components/components.css"; // Add this line

function CashierView() {
  const view = "/cashierView";
  const drinkList: string[] = [];

  const addToCart = (drink: string): void => {
    drinkList.push(drink);
    console.log(drink);
  }

  return (

    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col-2 d-flex flex-column vh-100 p-0">
        <LeftNavBar view={view} />
      </div>
      <div className="col d-flex flex-column vh-100 p-0 main-content">
          <TopBar />
          <div className="row h-100">
              <CategoryGrid addToCart={addToCart} />
            <div className="col-md-3 cart-view">
              <CartView drinks={drinkList} />
            </div>
           </div>
          
          <BottomBar />
      </div>
    </div>
  );
}

export default CashierView;
