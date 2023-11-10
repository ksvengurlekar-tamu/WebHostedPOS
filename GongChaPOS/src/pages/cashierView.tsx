import  { useState } from "react";
import LeftNavBar from "../components/leftnavbar.tsx";
import TopBar from "../components/topBar.tsx";
import BottomBar from "../components/bottomBar.tsx";
import CategoryGrid from "../components/categoryGrid.tsx";
import CartView from "../components/cartView.tsx";
import "../components/components.css"; // Add this line
interface Drink {
  name: string;
  price: number;
  size: string;
  toppings: string[];
  quantity: number;
}
function CashierView() {
  const view = "/cashierView";

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [handleBackFromTopBar, setHandleBackFromTopBar] = useState(() => () => {});

  const addToCart = (drink: Drink): void => {
    setDrinks((prevDrinkList) => [...prevDrinkList, drink]);
    console.log("TEST:",drink.name);
  };
  const removeDrinkFromCart = (drinkName: string) => {
    setDrinks((prevDrinks) => prevDrinks.filter((drink) => drink.name !== drinkName));
  };

  const clearCart = () => {
    setDrinks([]);
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
            <div className="col-md-3 cartViewContainer">
              <CartView InputDrinks={drinks} onRemoveDrink={removeDrinkFromCart} onClearCart={clearCart} />
            </div>
          </div>
          <BottomBar />
      </div>
    </div>
  );
}

export default CashierView;
