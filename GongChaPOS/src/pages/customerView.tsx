import  { useEffect, useState } from "react";
import TopBar from "../components/topBar.tsx";
import CartView from "../components/cartView.tsx";
import "../components/components.css";
import gongChaImg from "../assets/images/GongChaLogo.png";
import axios from 'axios';
import CategoryGrid from "../components/categoryGrid.tsx";
import { useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

interface Drink {
  id: number;
  name: string;
  price: number;
  size: string;
  topping_names: string[];
  quantity: number;
  imgurl: string;
}

function CustomerView() {

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [triggerBackAction, setTriggerBackAction] = useState(false);
  const [handleBackFromTopBar, setHandleBackFromTopBar] = useState(() => () => {});
  const [isCheckoutView, setIsCheckoutView] = useState(() => {
    const saved = sessionStorage.getItem("isCheckoutView"); 
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [series, setSeries] = useState("");
  
  const view = "Customer View";
  const navigate = useNavigate();

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
    setTriggerBackAction(true); 
    setSeries("");
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

  const onBackClick = () => {
    sessionStorage.clear();
    navigate("/");
  };


  return (

    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col d-flex flex-column vh-100 p-0 main-content">
        <TopBar isBackButtonVisible={showBackButton} view={view} series={series} onBackClick={handleBackFromTopBar} />
        <button className="back-button" onClick={onBackClick}>
          <FontAwesomeIcon icon={faArrowLeftLong} className="Back-icon" /> Back To Home
        </button>
        <div className="row">
          <div className="col-md-5">
          <CategoryGrid addToCart={addToCart} setShowBackButton={setShowBackButton} setHandleBackFromTopBar={setHandleBackFromTopBar} setSeries={setSeries} triggerBackAction={triggerBackAction} resetTriggerBackAction={() => setTriggerBackAction(false)} view={view} />
          </div>
          <div className="col-md-7" style={{ display: "flex", }}>
            {(drinks.length != 0) && (!showBackButton) && 
              <div className="col-md-3 cartViewContainer">
                <CartView InputDrinks={drinks} onRemoveDrink={removeDrinkFromCart} onClearCart={clearCart} onSubmit={submitOrder} view={view}/>
              </div>
            }
            {((drinks.length === 0) || (showBackButton)) &&
              <div className="img"> <img src={gongChaImg}></img> </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerView;
