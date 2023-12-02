import  { MouseEvent, useEffect, useState } from "react";
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

type DrinkDetail = "Cup Size" | "Sugar Level" | "Ice Level" | "Toppings" | "";

function CustomerView() {
  const [menuItems, setMenuItems] = useState<SQLDrinkInfo[]>(() => {
    const savedMenuItems = sessionStorage.getItem("menuItems");
    return savedMenuItems ? JSON.parse(savedMenuItems) : [];
  });
  const [selectedMenuItem, setSelectedMenuItem] = useState<SQLDrinkInfo>(() => {
    const savedSelectedMenuItem = sessionStorage.getItem("selectedMenuItem");
    return savedSelectedMenuItem ? JSON.parse(savedSelectedMenuItem) : [];
  });
  const [cartInfo, setCartInfo] = useState<Drink[]>(() =>{
    const saved = sessionStorage.getItem("cartInfo");
    return saved ? JSON.parse(saved) : [];
  });
  const [seriesName, setSeriesName] = useState<string>(() => {
    const savedSeriesName = sessionStorage.getItem('CustomerSeriesName');
    return savedSeriesName || "Bubble Tea"; // Use the saved value, or default to an empty string if not found
  });
 
  const [isDrinkView, setIsDrinkView] = useState(() => {
    const saved = sessionStorage.getItem("isDrinkView"); 
    return saved === "true"; 
  });
  const [isDrinkPopUp, setIsDrinkPopUp] = useState(() => {
    const saved = sessionStorage.getItem("isDrinkPopUp"); 
    return saved === "true"; 
  });
  const [isLoading, setIsLoading] = useState(() => {
    const saved = sessionStorage.getItem("isLoading"); 
    return saved === "true"; 
  });
  const [activeDetail, setActiveDetail] = useState<DrinkDetail>(() => {
    const saved = sessionStorage.getItem("activeDetail");
    return saved as DrinkDetail || "";
  });
  const [customization, setCustomization] = useState(() => {
    const saved = sessionStorage.getItem("customization");
    return saved ? JSON.parse(saved) : {
      cupSize: 'Medium', // Default value
      sugarLevel: '100%', // Default value
      iceLevel: 'Regular Ice', // Default value
      selectedToppings: [], // Default value
    };
  });
  const [toppings, setToppings] = useState<string[]>([]);
  
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
    sessionStorage.setItem("selectedMenuItem", JSON.stringify(selectedMenuItem));
  }, [selectedMenuItem]);
  useEffect(() => {
    sessionStorage.setItem("isDrinkPopUp", JSON.stringify(isDrinkPopUp));
  }, [isLoading]);
  useEffect(() => {
    sessionStorage.setItem("isLoading", JSON.stringify(isLoading));
  }, [isLoading]);
  useEffect(() => {
    sessionStorage.setItem("activeDetail", activeDetail);
  }, [activeDetail]);
  useEffect(() => {
    sessionStorage.setItem("customization", JSON.stringify(customization));
  }, [customization]);


  useEffect(() => {
    const savedSeriesSelected = sessionStorage.getItem("isDrinkView") === "true";
    if (savedSeriesSelected) {
      // If the series was previously selected, we should load the menu items
      const savedMenuItems = sessionStorage.getItem("menuItems");
      if (savedMenuItems) {
        setMenuItems(JSON.parse(savedMenuItems));
      }
    }

    // Load inventory
    async function loadToppings()  {
      try {
        const response = await fetch("https://gong-cha-server.onrender.com/menuitems");
        const data = await response.json();
        const toppingNames = data
          .filter((item: any) => item.menuitemcategory === "Toppings")
          .map((item: any) => item.menuitemname);
        setToppings(toppingNames);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      }
    }
    loadToppings();

  }, []);


  const handleAddToCart = () => {
    const newDrink: Drink = {
      id: selectedMenuItem.menuitemid,
      name: selectedMenuItem.menuitemname,
      price: selectedMenuItem.menuitemprice,
      size: customization.cupSize,
      topping_names: customization.selectedToppings,
      quantity: 1,
      imgurl: `/images/${seriesName}/${selectedMenuItem.menuitemname}.png`,
    };
    if (newDrink.size === "Large") {
      newDrink.price += 0.75;
    }
    const savedDiscountedDrink = localStorage.getItem('discountedDrink');
    if (newDrink.name === savedDiscountedDrink) {
      newDrink.price = 0;
    }

    let updatedDrinks = [...cartInfo, newDrink];
    setCartInfo(updatedDrinks);
    sessionStorage.setItem('cartInfo', JSON.stringify(updatedDrinks));
    onBackClick();

    setIsDrinkPopUp(false);
    setIsDrinkView(false);
    setCustomization({
      cupSize: 'Medium', // Default value
      sugarLevel: '100%', // Default value
      iceLevel: 'Regular Ice', // Default value
      selectedToppings: [], // Default value
    });

    console.log(newDrink);
  }

  
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
    setIsLoading(true); 
  
    const response = axios.get(`https://gong-cha-server.onrender.com/category/${seriesName}`);
    response.then((res) => {
      setMenuItems(res.data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
    
  };

  function handleDrinkDetailClick(detail: DrinkDetail): void {
    setActiveDetail(detail);
  }

  const handleCustomizationChange = (key:any, value:any) => {
    setCustomization((prevCustomization: any) => ({
      ...prevCustomization,
      [key]: value,
    }));
  };

  const onBackClick = () => {
    if (isDrinkPopUp) {
      setIsDrinkPopUp(false);
      setCustomization({
        cupSize: 'Medium', // Default value
        sugarLevel: '100%', // Default value
        iceLevel: 'Regular Ice', // Default value
        selectedToppings: [], // Default value
      });
      sessionStorage.clear();
    }
    else if(isDrinkView) {
      setIsDrinkView(false);
      sessionStorage.clear();
      setSeriesName("Bubble Tea");
    } else {  
      sessionStorage.clear();
      navigate("/");
    }
  }

  function handleDrinkClick(menuItem: SQLDrinkInfo): void {
    setIsDrinkPopUp(true);
    setActiveDetail("Cup Size");
    setSelectedMenuItem(menuItem);
  }

  return (

    <div className="customerViewContainer  vh-100">
      <div>
        <TopBar isBackButtonVisible={true} view={"Customer View"} series={seriesName + " series"} onBackClick={onBackClick} />
      </div>
      {(!isDrinkView && !isDrinkPopUp) &&
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
      {(isDrinkView && !isDrinkPopUp) && (
        <div className="customerViewDrinks">
          {isLoading ? (
            // Show placeholder skeleton cards while loading
            Array.from({ length: 6 }).map((_, index) => (
              <button key={index} className="skeletonCardCustomer button-no-hover" disabled>
                <div className="animated-background"></div>
              </button>

            ))
          ) : (
            // Show actual cards once data is loaded
            menuItems.map((menuItem) => (
              <button key={menuItem.menuitemid} className={`customerCard ${menuItem.menuiteminstock ? "" : "button-disabled"}`} style={{ backgroundColor: menuItem.color }} onClick={() => handleDrinkClick(menuItem)}>
                <img src={`/images/${seriesName}/${menuItem.menuitemname}.png`} className="cardImg" alt={menuItem.menuitemname} />
                <span className="cardText" style={menuItem.menuitemname.length > 20 ? { fontSize: "30px" } : {}}>{menuItem.menuitemname} {!menuItem.menuiteminstock ? "(out of stock)" : ""}</span>
              </button>
            ))
          )}
        </div>
      )}
      {isDrinkPopUp && (
        <div className="customerDrinkPopUp vw-100">
          <div className="customerDrinkText_Pic">
            <img src={"/images/" + seriesName + "/" + selectedMenuItem.menuitemname + ".png"} height={"254px"} width={"170px"} />
            <span style={{ fontSize: "50px", fontWeight: "1000" }}>{selectedMenuItem.menuitemname}</span>
          </div>
          <div className="customerDrinkDetails">
            <div className="customerDrinkDetailsCol w-50">
              <button className={`btn btn-primary customerDrinkDetailsButton ${activeDetail === "Cup Size" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleDrinkDetailClick("Cup Size")}>Cup Size</button>
              <button className={`btn btn-primary customerDrinkDetailsButton ${activeDetail === "Sugar Level" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleDrinkDetailClick("Sugar Level")}>Sugar Level</button>
              <button className={`btn btn-primary customerDrinkDetailsButton ${activeDetail === "Ice Level" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleDrinkDetailClick("Ice Level")}>Ice Level</button>
              <button className={`btn btn-primary customerDrinkDetailsButton ${activeDetail === "Toppings" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleDrinkDetailClick("Toppings")}>Toppings</button>
            </div>
            <div className="customerDrinkDetailsColRight w-50 ">
              {activeDetail === "Cup Size" && (
                <>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.cupSize === "Medium" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("cupSize", "Medium")}>Medium (16 fl. oz)</button>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.cupSize === "Large" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("cupSize", "Large")}>Large (24 fl. oz)</button>
                </>
              )}
              {activeDetail === "Sugar Level" && (
                <>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.sugarLevel === "0%" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("sugarLevel", "0%")}>0%</button>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.sugarLevel === "25%" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("sugarLevel", "25%")}>25%</button>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.sugarLevel === "50%" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("sugarLevel", "50%")}>50%</button>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.sugarLevel === "100%" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("sugarLevel", "100%")}>100%</button>
                </>
              )}
              {activeDetail === "Ice Level" && (
                <>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.iceLevel === "No Ice" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("iceLevel", "No Ice")}>No Ice</button>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.iceLevel === "Light Ice" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("iceLevel", "Light Ice")}>Light Ice</button>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.iceLevel === "Regular Ice" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("iceLevel", "Regular Ice")}>Regular Ice</button>
                  <button className={`customerDrinkDetailsButton rightButton ${customization.iceLevel === "Extra Ice" ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("iceLevel", "Extra Ice")}>Extra Ice</button>

                </>
              )}
              {activeDetail === "Toppings" && (
                <>
                  {toppings.map((topping) => (
                    <button className={`customerDrinkDetailsButton rightButton ${customization.selectedToppings.includes(topping) ? "customerDrinkDetailsButtonActive" : ""}`} onClick={() => handleCustomizationChange("selectedToppings", [...customization.selectedToppings, topping])}>{topping}</button>
                  ))}  
                </>
              )}
            </div>
          </div>
          <div className="customerDrinkBottomBar">
              <span className="" style={{marginLeft: "20px"}}>Calories: {selectedMenuItem.menuitemcalories}</span>
              <span>Drink Price: ${selectedMenuItem.menuitemprice.toPrecision(3)}</span>
              <button className="btn btn-primary customerViewButton " onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      )}
    
    

   </div>

  );
}

export default CustomerView;
