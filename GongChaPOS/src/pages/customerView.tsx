import  { useEffect, useState } from "react";
import TopBar from "../components/topBar.tsx";
import "../components/components.css";
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

interface Drink {
  id: number;
  name: string;
  price: number;
  size: string;
  topping_names: string[];
  quantity: number;
  imgurl: string;
}

interface SQLDrinkInfo {
  menuitemid: number;
  menuitemname: string;
  menuitemprice: number;
  menuitemcalories: string;
  menuitemcategory: string;
  hascaffeine: boolean;
  color: string;
  menuiteminstock:boolean;
}

function CustomerView() {
  const [menuItems, setMenuItems] = useState<SQLDrinkInfo[]>(() => {
    const savedMenuItems = sessionStorage.getItem("menuItems");
    return savedMenuItems ? JSON.parse(savedMenuItems) : [];
  });
  const [cartInfo, setCartInfo] = useState<Drink[]>(() =>{
    const saved = sessionStorage.getItem("cartInfo");
    return saved ? JSON.parse(saved) : [];
  });
  const [seriesName, setSeriesName] = useState<string>(() => {
    const savedSeriesName = sessionStorage.getItem('CustomerSeriesName');
    return savedSeriesName || ""; // Use the saved value, or default to an empty string if not found
  });
 
  const [isDrinkView, setIsDrinkView] = useState(() => {
    const saved = sessionStorage.getItem("isDrinkView"); 
    return saved === "true"; 
  });

  
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("CustomerSeriesName", seriesName.toString());
  }, [seriesName]);
  useEffect(() => {
    sessionStorage.setItem("isDrinkView", isDrinkView.toString());
  }, [isDrinkView]);
  useEffect(() => {
    sessionStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    const savedSeriesSelected = sessionStorage.getItem("isDrinkView") === "true";
    if (savedSeriesSelected) {
      // If the series was previously selected, we should load the menu items
      const savedMenuItems = sessionStorage.getItem("menuItems");
      if (savedMenuItems) {
        setMenuItems(JSON.parse(savedMenuItems));
      }
    }

  }, []);


  // const addToCart = (drink: Drink): void => {
  //   if (drink.size === "Large") {
  //     drink.price += 0.75;
  //   }
  //   const savedDiscountedDrink = localStorage.getItem('discountedDrink');
  //   if (drink.name === savedDiscountedDrink) {
  //     drink.price = 0;
  //   }

  //   let updatedDrinks = [...drinks, drink];
  //   setDrinks(updatedDrinks);
  //   sessionStorage.setItem('drinks', JSON.stringify(updatedDrinks));
  //   setTriggerBackAction(true); 
  //   setSeries("");
  // };
  
  // const removeDrinkFromCart = (drinkName: Drink) => {
  //   let found = false; // This flag will indicate if the drink has been found and removed
  //   console.log(drinks);
  //   const updatedDrinks = drinks.filter((drink) => {
  //     if (!found && drink === drinkName) {
  //       found = true; // Set the flag to true when the drink is found
  //       return false; // This drink will be removed
  //     } 
  //     return true; // All other drinks will be kept
  //   });
  //   setDrinks(updatedDrinks);
  //   sessionStorage.setItem("drinks", JSON.stringify(updatedDrinks));
  // };

  // const clearCart = () => {
  //   setDrinks([]);
  //   sessionStorage.removeItem('drinks');
  // };

  // const handleCheckoutButton = () => {
  //   setIsCheckoutView(!isCheckoutView);
  //   sessionStorage.setItem("isCheckoutView", (!isCheckoutView).toString());
  // }

  // const submitOrder = async () => {
  //   //var insert_url = "https://gong-cha-server.onrender.com/sales";
  //   var insert_url = "https://gong-cha-server.onrender.com/sales";
    
  //   const employeeId = sessionStorage.getItem("employeeId");

  //   await axios.post(insert_url, {
  //     employeeId,
  //     drinks,
  //   });    

  //   setTriggerBackAction(true); 
  //   setSeries("");
  //   clearCart();
    
  // };
  const handleSeriesClick = (seriesName: string) => {
    setSeriesName(seriesName);
    setMenuItems([]);
    setIsDrinkView(true);
  
    const response = axios.get(`https://gong-cha-server.onrender.com/category/${seriesName}`);
    response.then((res) => {
      setMenuItems(res.data);
    });

};

  const onBackClick = () => {
    if(isDrinkView) {
      setIsDrinkView(false);
  
      // sessionStorage.setItem("isDrinkView", "false");
    } else {  
      sessionStorage.clear();
      navigate("/");
    }
  }



  return (

    <div className="customerViewContainer  vh-100">
      <div>
        <TopBar isBackButtonVisible={true} view={"Customer View"} series={seriesName} onBackClick={onBackClick} />
      </div>
      {!isDrinkView &&
        <>
          <div className="customerViewMainContent vw-100">
            <div className="customerViewSeriesCol">
              <button className="customerCard" style={{ backgroundColor: "#fff2cc" }} onClick={() => handleSeriesClick("Milk Foam")}>
                <img src={"/images/Milk Foam/Creme Brulee Strawberry Milk Tea.png"} className="cardImg" style={{ marginBottom: "20px" }} />
                <span className="cardText">Milk Foam</span>
              </button>
              <button className="customerCard" style={{ backgroundColor: "#d9ead3" }} onClick={() => handleSeriesClick("Slush")}>
                <img src={"/images/Slush/Taro Milk.png"} className="cardImg" />
                <span className="cardText">Slush</span>
              </button>
              <button className="customerCard" style={{ backgroundColor: "#d9d2e9" }} onClick={() => handleSeriesClick("Tea Latte")}>
                <img src={"/images/Tea Latte/Green Tea Latte.png"} className="cardImg" />
                <span className="cardText">Tea Latte</span>
              </button>
            </div>
            <div className="customerViewSeriesCol">
              <button className="customerCard" style={{ backgroundColor: "#fce5cd" }} onClick={() => handleSeriesClick("Milk Tea")}>
                <img src={"/images/Milk Tea/Pearl Milk Tea.png"} className="cardImg" />
                <span className="cardText">Milk Tea</span>
              </button>
              <button className="customerCard" style={{ backgroundColor: "#c9daf8" }} onClick={() => handleSeriesClick("Seasonal")}>
                <img src={"/images/Seasonal/Taro Drink.png"} className="cardImg" />
                <span className="cardText">Seasonal</span>
              </button>
              <button className="customerCard" style={{ backgroundColor: "#ead1dc" }} onClick={() => handleSeriesClick("Coffee")}>
                <img src={"/images/Coffee/Milk Foam Black Coffee.png"} className="cardImg" />
                <span className="cardText">Coffee</span>
              </button>
            </div>
            <div className="customerViewSeriesCol">

            </div>
          </div>
        </>
      }
      {isDrinkView &&
          <div className="customerViewDrinks">
            {menuItems.map((menuItem) => (
              <button key={menuItem.menuitemid} className="customerCard" style={{ backgroundColor: menuItem.color }}>
                <img src={`/images/${seriesName}/${menuItem.menuitemname}.png`} className="cardImg" alt={menuItem.menuitemname} />
                <span className="cardText" style={menuItem.menuitemname.length > 20 ? {fontSize:"35px"} : {}}>{menuItem.menuitemname}</span>
              </button>
            ))}
          </div>
      }

    </div>

  );
}

export default CustomerView;
