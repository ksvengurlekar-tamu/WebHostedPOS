import React from "react";
import LeftNavBar from "../components/leftnavbar.tsx";
import TopBar from "../components/topBar.tsx";
import BottomBar from "../components/bottomBar.tsx";
import CategoryGrid from "../components/categoryGrid.tsx";
import CartView from "../components/cartView.tsx";
import "../components/components.css"; // Add this line

function CashierView() {
  const view = "/cashierView";

  const addToCart = (drink: string): void => {
    drink = "";
  }

  return (
    // <div className="container">
    //     <div className="col-md-3">
    //       <LeftNavBar view={view} />
    //     </div>
    //     <div className="col-md-9">
    //       <TopBar />
    //       <div className="categoryGrid">
    //         <div className="col-md-9">
    //           <CategoryGrid />
    //         </div>
    //         <CartView drinks={[]}/>
    //       </div>
    //       <BottomBar />
    //     </div>
    // </div>

    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col-2 d-flex flex-column vh-100 p-0">
        <LeftNavBar view={view} />
      </div>
      <div className="col d-flex flex-column vh-100 p-0 main-content">
          <TopBar />
          <div className="row flex-grow-1">
            <div className="col">
              <CategoryGrid addToCart={addToCart} />
            </div>
            <div className="col-md-4 cart-view">
              <CartView drinks={[]} />
            </div>
           </div>
          <BottomBar />
      </div>
    </div>
  );
}

export default CashierView;
