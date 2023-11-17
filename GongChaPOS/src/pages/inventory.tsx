import LeftNavBar from "../components/leftnavbar";
import TopBar from "../components/topBar";
import "../components/components.css";
import  { useState } from "react";
import axios from 'axios';

function Inventory() {  
    const view = "/managerView";

    const [showBackButton, setShowBackButton] = useState(false);
    const [handleBackFromTopBar, setHandleBackFromTopBar] = useState(() => () => {});

    return (

        <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
          <div className="col-2 d-flex flex-column vh-100 p-0">
            <LeftNavBar view={view} />
          </div>
          <div className="col d-flex flex-column vh-100 p-0 main-content">
              <TopBar isBackButtonVisible = {showBackButton} onBackClick={handleBackFromTopBar} view={view} />

              {/* <BottomBar onCheckout={handleCheckoutButton} /> */}
          </div>
        </div>
      );
}

export default Inventory;