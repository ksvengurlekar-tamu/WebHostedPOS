import  { useEffect, useState } from "react";
import LeftNavBar from "../components/leftnavbar.tsx";
import TopBar from "../components/topBar.tsx";
import BottomBar from "../components/bottomBar.tsx";
import CategoryGrid from "../components/categoryGrid.tsx";
import CartView from "../components/cartView.tsx";
import "../components/components.css";
import gongChaImg from "../assets/images/GongChaLogo.png";
import axios from 'axios';


interface Drink {
  id: number;
  name: string;
  price: number;
  size: string;
  topping_names: string[];
  quantity: number;
}

interface CartViewProps {
  view: string;
}

function CashierView({ view }: CartViewProps) {

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [triggerBackAction, setTriggerBackAction] = useState(false);
  const [handleBackFromTopBar, setHandleBackFromTopBar] = useState(() => () => {});
  const [isCheckoutView, setIsCheckoutView] = useState(() => {
    const saved = sessionStorage.getItem("isCheckoutView");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [series, setSeries] = useState("");

  useEffect(() => {
    const savedDrinks = sessionStorage.getItem('drinks');
    let updatedDrinks = drinks;
    if (savedDrinks) {
      updatedDrinks = [...JSON.parse(savedDrinks), ...drinks];
    }
    setDrinks(updatedDrinks);
  }, []);



  const addToCart = (drink: Drink): void => {
    if (drink.size === "Large") {
      drink.price += 0.75;
    }

    let updatedDrinks = [...drinks, drink];
    setDrinks(updatedDrinks);
    sessionStorage.setItem('drinks', JSON.stringify(updatedDrinks));
  };
  
  const removeDrinkFromCart = (drinkName: Drink) => {
    let found = false; // This flag will indicate if the drink has been found and removed
    console.log(drinks);
    const updatedDrinks = drinks.filter((drink) => {
      if (!found && drink === drinkName) {
        found = true; // Set the flag to true when the drink is found
        return false; // This drink will be removed
      }
      return true; // All other drinks will be kept
    });
    console.log(updatedDrinks);
    setDrinks(updatedDrinks);
    sessionStorage.setItem("drinks", JSON.stringify(updatedDrinks));
  };

  const clearCart = () => {
    setDrinks([]);
    sessionStorage.removeItem('drinks');
  };

  const handleCheckoutButton = () => {
    setIsCheckoutView(!isCheckoutView);
    sessionStorage.setItem("isCheckoutView", (!isCheckoutView).toString());
  }

  const submitOrder = async () => {
    //var insert_url = "https://gong-cha-server.onrender.com/sales";
    var insert_url = "https://gong-cha-server.onrender.com/sales";
    
    const employeeId = sessionStorage.getItem("employeeId");

    await axios.post(insert_url, {
      employeeId,
      drinks,
    });    

    setTriggerBackAction(true); 
    setSeries("");
    clearCart();
    
  };


  return (

    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col-2 d-flex flex-column vh-100 p-0">
        <LeftNavBar view={view} />
      </div>
      <div className="col d-flex flex-column vh-100 p-0 main-content">
          <TopBar isBackButtonVisible = {showBackButton} view={view} series={series} onBackClick={handleBackFromTopBar} />
          <div className="row">
              <CategoryGrid addToCart={addToCart} setShowBackButton={setShowBackButton} setHandleBackFromTopBar={setHandleBackFromTopBar} setSeries={setSeries} triggerBackAction={triggerBackAction} resetTriggerBackAction={() => setTriggerBackAction(false)}  view={view} />
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
