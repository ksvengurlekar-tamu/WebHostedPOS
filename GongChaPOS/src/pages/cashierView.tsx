import  { useState } from "react";
import LeftNavBar from "../components/leftnavbar.tsx";
import TopBar from "../components/topBar.tsx";
import BottomBar from "../components/bottomBar.tsx";
import CategoryGrid from "../components/categoryGrid.tsx";
import CartView from "../components/cartView.tsx";
import "../components/components.css"; // Add this line
import gongChaImg from "../assets/images/GongChaLogo.png";

interface Topping {
  id: number;
  name: string;
  price: number;
}

interface Drink {
  id: number;
  name: string;
  price: number;
  size: string;
  topping_names: string[];
  toppings: Topping[];
  quantity: number;
}

function getCurrentDateTime(): { currentDate: string; currentTime: string } {
  const now = new Date();

  // Format the date as yyyy-MM-dd
  const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  // Format the time as HH:mm:ss
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  return { currentDate, currentTime };
}

function CashierView() {
  const view = "/cashierView";

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [handleBackFromTopBar, setHandleBackFromTopBar] = useState(() => () => {});
  const [isCheckoutView, setIsCheckoutView] = useState(false); 

  const addToCart = (drink: Drink): void => {
    if (drink.size === "Large") {
      drink.price += 0.75;
    }

    setDrinks((prevDrinkList) => [...prevDrinkList, drink]);
  };
  
  const removeDrinkFromCart = (drinkName: Drink) => {
    setDrinks((prevDrinks) => {
        let found = false; // This flag will indicate if the drink has been found and removed
        return prevDrinks.filter((drink) => {
          if (!found && drink == drinkName) {
            found = true; // Set the flag to true when the drink is found
            return false; // Remove the first drink that matches the name
          }
          return true; // Keep all other drinks
        });
      });
  };

  const clearCart = () => {
    setDrinks([]);
  };

  const handleCheckoutButton = () => {
    setIsCheckoutView(!isCheckoutView);
  }

  const submitOrder = async () => {
    // var insert_url = "https://gong-cha-server.onrender.com/sales";
    var insert_url = "http://localhost:9000/sales/insert";
    
    const employeesId = localStorage.getItem("employeeId");

    const { currentDate, currentTime } = getCurrentDateTime();

    const salesData = { currentDate, currentTime, employeesId, drinks }; // json package

    const insertResponse = await fetch(insert_url, {
      method: 'POST',
      headers: {
        // this signals the API that the input is in the form of json
        'Content-Type': 'application/json',
      },
      // wraps the salesData struct in a json format
      body: JSON.stringify(salesData),
    });

    clearCart();
  };

  return (

    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col-2 d-flex flex-column vh-100 p-0">
        <LeftNavBar view={view} />
      </div>
      <div className="col d-flex flex-column vh-100 p-0 main-content">
          <TopBar isBackButtonVisible = {showBackButton} onBackClick={handleBackFromTopBar} />
          <div className="row">
              <CategoryGrid addToCart={addToCart} setShowBackButton={setShowBackButton} setHandleBackFromTopBar={setHandleBackFromTopBar} />
              {!isCheckoutView && !showBackButton &&
                <div className="col-7 img"> <img src={gongChaImg}></img> </div>
              }
              {isCheckoutView &&
                <div className="col-md-3 cartViewContainer">
                  <CartView InputDrinks={drinks} onRemoveDrink={removeDrinkFromCart} onClearCart={clearCart} onSubmit={submitOrder}/>
                </div>
              }
          </div>
          
          <BottomBar onCheckout={handleCheckoutButton} />
      </div>
    </div>
  );
}

export default CashierView;
