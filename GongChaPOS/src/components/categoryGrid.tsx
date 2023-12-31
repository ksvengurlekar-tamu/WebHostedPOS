/**
 * @file CategoryGrid.tsx
 * @description Component for displaying menu categories, items, and handling interactions.
 */
import { useEffect, useState } from "react";
import Card from "../components/card.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AutoCompleteCustom from "./autoCompleteCustom.tsx";
import axios from "axios";

/**
 * @interface Drink
 * @description Interface representing a drink item.
 */
interface Drink {
  id: number;
  name: string;
  price: number;
  size: string;
  topping_names: string[];
  quantity: number;
  imgurl: string;
}

/**
 * @interface Ingredient
 * @description Interface representing an ingredient.
 */
interface Ingredient {
  name: string;
  measurement: string;
}

/**
 * @interface FormDataType
 * @description Interface representing the form data for adding a new drink.
 */
interface FormDataType {
  drinkName: string;
  drinkPrice: string;
  drinkCalories: string;
  drinkCategory: string;
  hasCaffeine: boolean;
  ingredients: Ingredient[]; // Array of Ingredient objects
}

/**
 * @interface CategoryGridProps
 * @description Props for configuring the CategoryGrid component.
 */
interface CategoryGridProps {
  addToCart: (menuItem: Drink) => void;
  setShowBackButton: any;
  setHandleBackFromTopBar: any;
  setSeries: any;
  triggerBackAction?: boolean;
  resetTriggerBackAction?: () => void;
  view: string;
}

/**
 * @function CategoryGrid
 * @description Main component for displaying menu categories, items, and handling interactions.
 * @param {CategoryGridProps} props - Props for configuring the CategoryGrid component.
 * @returns {JSX.Element} Rendered CategoryGrid component.
 */
function CategoryGrid({ addToCart, setShowBackButton, setHandleBackFromTopBar, setSeries, triggerBackAction, resetTriggerBackAction, view }: CategoryGridProps) {
  const [isSeriesSelected, setSeriesSelected] = useState(() => {
    const saved = sessionStorage.getItem("isSeriesSelected");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [isDrinkSelected, setDrinkSelected] = useState(() => {
    const saved = sessionStorage.getItem("isDrinkSelected");
    return saved === "true"; // Same as above
  });
  const [isAddMenuItemSelected, setisAddMenuItemSelected] = useState(() => {
    const saved = sessionStorage.getItem("isAddMenuItemSelected");
    return saved === "true"; // Same as above
  });
  const [menuItems, setMenuItems] = useState<any[]>(() => {
    // Load menu items from local storage or default to empty array
    const savedMenuItems = sessionStorage.getItem("menuItems");
    return savedMenuItems ? JSON.parse(savedMenuItems) : [];
  });
  const [seriesName, setSeriesName] = useState<string>(() => {
    const savedSeriesName = sessionStorage.getItem('seriesName');
    return savedSeriesName || ""; // Use the saved value, or default to an empty string if not found
  }); 
  

  const [formData, setFormData] = useState<FormDataType>({
    drinkName: '',
    drinkPrice: '',
    drinkCalories: '',
    drinkCategory: '',
    hasCaffeine: false,
    // Explicitly define the type for each element in the ingredients array
    ingredients: Array<Ingredient>(7).fill({ name: '', measurement: '' }) 
});


  const [inventory, setinventory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("Medium");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedIceLevel, setselectedIceLevel] = useState<string>("Regular Ice");
  const [selectedSugarLevel, setselectedSugarLevel] = useState<string>("100%");
  const [selectedDrinkName, setSelectedDrinkName] = useState<string>("");
  const [selectedDrinkPrice, setSelectedDrinkPrice] = useState<number>(0);    
  const [selectedDrinkID, setSelectedDrinkID] = useState<number>(0); 
  const [selectedDrinkIMG, setSelectedDrinkIMG] = useState<string>("");
  

   /**
   * Handles the click event for selecting a series and fetching associated menu items.
   * @param {string} SeriesName - The name of the selected series.
   * @returns {void}
   */
  const handleSeriesClick = async (SeriesName: string) => {
    setIsLoading(true);
    setMenuItems([]); // This line clears the drink items
    setSeriesSelected(true);
    setSeries(SeriesName);
    setSeriesName(SeriesName)

    var url = "https://gong-cha-server.onrender.com/category/" + SeriesName;
    const response = await fetch(url);
    const data = await response.json();
    setMenuItems(data);
    sessionStorage.setItem("menuItems", JSON.stringify(data));
    setIsLoading(false);
  };

  /**
   * Gets the CSS class name for a button based on its type and value.
   * @param {string} type - The type of button (e.g., size, ice, sugar, topping).
   * @param {string} value - The value of the button.
   * @returns {string} The CSS class name for the button.
   */
  const getButtonClassName = (type: string, value: string) => {
    switch (type) {
      case "size":
        return `drinkPropButton ${
          selectedSize === value ? "buttonClicked" : ""
        }`;
      case "ice":
        return `drinkPropButton ${
          selectedIceLevel === value ? "buttonClicked" : ""
        }`;
      case "sugar":
        return `drinkPropButton ${
          selectedSugarLevel === value ? "buttonClicked" : ""
        }`;
      case "topping":
        return `drinkPropButton m-1 ${
          selectedToppings.includes(value) ? "buttonClicked" : ""
        }`;
      default:
        return "drinkPropButton";
    }
  };

  /**
   * Handles the click event for selecting a topping.
   * @param {string} topping - The name of the selected topping.
   * @returns {void}
   */
  // Function to handle toppings selection
  const handleToppingClick = (topping: string) => {
    setSelectedToppings((prevToppings) => {
      if (prevToppings.includes(topping)) {
        return prevToppings.filter((t) => t !== topping); // Deselect
      } else {
        return [...prevToppings, topping]; // Select
      }
    });
  };

  /**
   * Handles the click event for the back button.
   * @returns {void}
   */
  const handleBackClick = () => {
    console.log(isDrinkSelected, isSeriesSelected);
    if (isDrinkSelected) {
      setDrinkSelected(false);
      setSeriesSelected(true);
    }
    else if (isLoading || isSeriesSelected) {
      setSeriesSelected(false);
      setIsLoading(false);
      setSeries('');
    }
  };

  /**
   * Handles the click event for adding a custom drink to the cart.
   * @returns {void}
   */
  const handleAddClick = () => {
    const newDrink: Drink = {
      id: selectedDrinkID,
      name: selectedDrinkName,
      price: selectedDrinkPrice,
      size: selectedSize,
      topping_names: selectedToppings,
      quantity: 1, // Assuming the default quantity is 1
      imgurl: selectedDrinkIMG
    };
    addToCart(newDrink);
    // Reset
    setSelectedSize("Medium");
    setSelectedToppings([]);
    setselectedIceLevel("Regular Ice");
    setselectedSugarLevel("100%");
    // Close the drink popup
    setDrinkSelected(false);
  };

  /**
   * Handles the change event for form input fields.
   * @param {keyof FormDataType} name - The name of the form field.
   * @param {string | boolean} value - The value of the form field.
   * @returns {void}
   */
  const handleInputChange = (name: keyof FormDataType, value: string | boolean) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: typeof value === 'boolean' ? value : value
    }));
  };
  

  /**
   * Handles the change event for ingredient input fields.
   * @param {number} index - The index of the ingredient in the array.
   * @param {keyof Ingredient} field - The name of the ingredient field (name or measurement).
   * @param {string} value - The value of the ingredient field.
   * @returns {void}
   */
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setFormData(prevFormData => {
        const updatedIngredients = [...prevFormData.ingredients];
        updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
        return { ...prevFormData, ingredients: updatedIngredients };
    });
};
  

  /**
   * Handles the form submission event for adding a new drink.
   * @returns {void}
   */
  const handleSubmit = async () => {

    // let drinkPrice = parseFloat(formData.drinkPrice) || 0;
    // let drinkCalories = parseInt(formData.drinkCalories, 10) || 0;
    formData.drinkCategory = seriesName;
    formData.ingredients = formData.ingredients.filter(ingredient => ingredient.name !== '' && ingredient.measurement !== '');
    try {
      var insert_url = "https://gong-cha-server.onrender.com/addOrUpdateDrink";
      console.log(formData);
      await axios.post(insert_url,formData);    
    } catch (error) {
      console.log(error);
    }

    setFormData({
      drinkName: '',
      drinkPrice: '',
      drinkCalories: '',
      drinkCategory: '', 
      hasCaffeine: false,
      ingredients: Array<Ingredient>(7).fill({ name: '', measurement: '' }) // Reset each ingredient
     });
    setisAddMenuItemSelected(false);
    setSeriesSelected(false);
  };

  /**
   * Handles the click event for navigating back from the add menu item popup.
   * @returns {void}
   */
  const handleAddDrinkBack = () => {
    setFormData({
      drinkName: '',
      drinkPrice: '',
      drinkCalories: '',
      drinkCategory: '', 
      hasCaffeine: false,
      ingredients: Array<Ingredient>(7).fill({ name: '', measurement: '' }) // Reset each ingredient
     });
    setisAddMenuItemSelected(false);
  }

  useEffect(() => {
    const savedSeriesSelected = sessionStorage.getItem("isSeriesSelected") === "true";
    if (savedSeriesSelected) {
      // If the series was previously selected, we should load the menu items
      const savedMenuItems = sessionStorage.getItem("menuItems");
      if (savedMenuItems) {
        setMenuItems(JSON.parse(savedMenuItems));
      }
      // Assuming we want to set seriesSelected based on the presence of items
      setSeriesSelected(savedMenuItems != null);
    }

    // Load inventory
    async function loadInventory()  {
      try {
        const response = await fetch("https://gong-cha-server.onrender.com/inventory");
        const data = await response.json();
        const inventoryNames = data.map((item: any) => item.inventoryname);
        setinventory(inventoryNames);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      }
    }

    loadInventory();

  }, []);

  useEffect(() => {
    // Decide when to show the back button
    setShowBackButton(isSeriesSelected || isDrinkSelected);
  }, [isSeriesSelected, isDrinkSelected, setShowBackButton]);

  useEffect(() => {
    setHandleBackFromTopBar(() => handleBackClick);
  }, [setHandleBackFromTopBar, isSeriesSelected, isDrinkSelected]);

  useEffect(() => {
    sessionStorage.setItem("isSeriesSelected", isSeriesSelected.toString());
  }, [isSeriesSelected]);

  useEffect(() => {
    sessionStorage.setItem("isDrinkSelected", isDrinkSelected.toString());
  }, [isDrinkSelected]);

  useEffect(() => {
    sessionStorage.setItem("isAddMenuItemSelected", isAddMenuItemSelected.toString());
  }, [isAddMenuItemSelected]);

  useEffect(() => {
    sessionStorage.setItem('seriesName', seriesName);
  }, [seriesName]);

  useEffect(() => {
    if (triggerBackAction) {
      handleBackClick();
      resetTriggerBackAction?.(); // Call the callback function to reset the trigger in CashierView
    }
  }, [triggerBackAction, resetTriggerBackAction]);

  var itemsToRender;
  const typeOfCard = view === "Customer View" ? 'customerDrink' : 'drink';

  if (isLoading && view != "Customer View") {
    itemsToRender = Array.from({ length: 20 }, (_, index) => (
      <button key={index} className="skeleton-card button-no-hover" disabled>
        <div className="animated-background"></div>
      </button>
    ));
  } else if (isSeriesSelected) {
    itemsToRender = menuItems.map((menuItem: any) => (
      <div className="carddiv">
        {/* conditional for displaying the image */}
        {(view == "Customer View") && (<img src={encodeURI(`/images/${menuItem.menuitemcategory}/${menuItem.menuitemname}.png`)} alt={menuItem.menuitemname} className="left-image" />)}
        <Card
          // className="drink"
          className={menuItem.menuiteminstock ? typeOfCard : typeOfCard + ' button-disabled'}
          key={menuItem.menuitemid}
          menuItemName={menuItem.menuitemname}
          color={menuItem.color}
          onSelect={() => {
            if (menuItem.menuiteminstock) {
              setDrinkSelected(true);
              setSelectedDrinkName(menuItem.menuitemname);
              setSelectedDrinkPrice(menuItem.menuitemprice);
              setSelectedDrinkID(menuItem.menuitemid);
              setSelectedDrinkIMG("/images/" + menuItem.menuitemcategory + "/" + menuItem.menuitemname + ".png");
            }
          }}
        />
      </div>
    ));

    const placeholderCount = 20 - menuItems.length;
    const placeholderItems = Array.from({ length: placeholderCount }, (_, index) => {
      // <button key={`placeholder-${index}`} className="drink button-no-hover" style={{ backgroundColor: "#fcfcf2" }} disabled> </button>
      if (view === "Manager View" && index === 0) {
        // Render the first button for Manager View
        return (
          <button key={`placeholder-${index}`} className="drink" style={{ backgroundColor: "rgba(211,211,211)", position: "relative" }} onClick={() => setisAddMenuItemSelected(true)} aria-label="Add Menu Item">
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: "40px" }} className="checkIcon" />
          </button>
        );
      } else if (view != "Customer View") {
        // Render other buttons as before
        return (
          <button key={`placeholder-${index}`} className="drink button-no-hover" style={{ backgroundColor: "#fcfcf2" }} aria-hidden="true" disabled> </button>
        );
      }
    });

    itemsToRender = [...itemsToRender, ...placeholderItems];
  } else {
    itemsToRender = (
      // conditional: if customer view, 1 item per row; else, grid view
      <div className={view != "Customer View" ? "categoryGrid w-25" : "categoryList"}>
        <Card
          className="series"
          menuItemName="Milk Foam"

          onSelect={() => handleSeriesClick("Milk Foam")}
        />
        <Card
          className="series"
          menuItemName="Milk Tea"
          onSelect={() => handleSeriesClick("Milk Tea")}
        />
        <Card
          className="series"
          menuItemName="Slush"
          onSelect={() => handleSeriesClick("Slush")}
        />
        <Card
          className="series"
          menuItemName="Seasonal"
          onSelect={() => handleSeriesClick("Seasonal")}
        />
        <Card
          className="series"
          menuItemName="Tea Latte"
          onSelect={() => handleSeriesClick("Tea Latte")}
        />
        <Card
          className="series"
          menuItemName="Coffee"
          onSelect={() => handleSeriesClick("Coffee")}
        />
      </div>
    );
  }

  return (
    <>
      {isAddMenuItemSelected && (
        <>
          <div className="overlay" aria-hidden="true"></div>
          <div className="Popup" role="dialog" aria-labelledby="addMenuItemTitle">
          
            <div className="addMenuItemConatiner">
            <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
              <div className="d-flex ">
                <div className="d-flex flex-column addMenuIteminputCol">
                  
                  <div className="d-flex addMenuItemRow">
                    Drink Name:
                    <AutoCompleteCustom data={menuItems.map((item: any) => item.menuitemname)} label="Drink Name" freeSolo={true} required={true} handleChange={(value) => handleInputChange("drinkName", value)} />
                  </div>
                  <div className="d-flex addMenuItemRow">
                    Drink Price:
                    <input required type="number" className="addMenuInput" onChange={(e) => handleInputChange('drinkPrice', e.target.value)} placeholder="in $" min="0" step="0.01" />
                  </div>
                  <div className="d-flex addMenuItemRow">
                    Drink Calories:
                    <input required type="number" className="addMenuInput" onChange={(e) => handleInputChange('drinkCalories', e.target.value)} min="0" step="1" />
                  </div>
                  <div className="d-flex addMenuItemRow">
                    Drink Category:
                    <input disabled type="text" value={seriesName} className="addMenuInput" />
                  </div>
                  <div className="d-flex addMenuItemRow">
                    Has Caffeine:
                    <select
                      required
                      className="addMenuInput"
                      onChange={(e) => handleInputChange('hasCaffeine', e.target.value === 'true')}
                      value={formData.hasCaffeine.toString()}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                    </div>
                  </div>
                  <div className="d-flex flex-column addMenuIteminputCol mt-1">
                    {formData.ingredients.map((ingredient, index) => (
                      <div className="d-flex addMenuItemRow" key={index}>
                        Ingredient {index + 1}:
                        <AutoCompleteCustom
                          data={inventory}
                          label={`Ingredient ${index + 1}`}
                          handleChange={(value) => handleIngredientChange(index, 'name', value)}
                        />
                        <input
                          type="number"
                          className="addMenuMeasurementInput"
                          value={ingredient.measurement}
                          onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)}
                          placeholder="Oz."
                          min = "0"
                          step = "0.5"
                        />
                      </div>
                    ))}

                  </div>
                </div>
                <div className="addMenuBottomBar">
                  <div className=" bottomOverlay">
                    <button className=" bottomOverlayBack" type="button" onClick={handleAddDrinkBack}>Back</button>
                    <button className=" bottomOverlayBack" type="submit">Submit</button>
                </div>
              </div>
            </form>
            </div>
          </div>
        </>
      )}
      {isDrinkSelected && (
        <>
          {view != "Customer View" && (<div className="overlay"></div>)}
          <div className={view != "Customer View" ? "Popup" : "right-side-menu"}>
            {view === "Customer View" && (<div className="overlay-customer">
              {/* <img src={encodeURI(`/images/${menuItem.menuitemcategory}/${menuItem.menuitemname}.png`)} alt={menuItem.menuitemname} className="big-image" />}
              {/* the goal here is to show data about the drink clicked: image, calories, price, caffeine, etc */}
              {/* how do we get this data?????? I HAVE NO IDEA:)))))))) */}
            </div>)}
            <div className="row-9 d-flex">
              <div className="col-4 d-flex flex-column drinkProp">
                <span className="drinkPropText">Size</span>
                <button
                  className={getButtonClassName("size", "Medium")}
                  onClick={() => setSelectedSize("Medium")}
                >
                  Medium (16 fl. oz)
                </button>
                <button
                  className={getButtonClassName("size", "Large")}
                  onClick={() => setSelectedSize("Large")}
                >
                  Large (24 fl. oz)
                </button>
              </div>
              <div className="col-4 d-flex flex-column drinkProp">
                <span className="drinkPropText">Ice Level</span>
                <button
                  className={getButtonClassName("ice", "No Ice")}
                  onClick={() => setselectedIceLevel("No Ice")}
                >
                  No Ice
                </button>
                <button
                  className={getButtonClassName("ice", "Light Ice")}
                  onClick={() => setselectedIceLevel("Light Ice")}
                >
                  Light Ice
                </button>
                <button
                  className={getButtonClassName("ice", "Regular Ice")}
                  onClick={() => setselectedIceLevel("Regular Ice")}
                >
                  Regular Ice
                </button>
                <button
                  className={getButtonClassName("ice", "Extra Ice")}
                  onClick={() => setselectedIceLevel("Extra Ice")}
                >
                  Extra Ice
                </button>
              </div>
              <div className="col d-flex flex-column drinkProp">
                <span className="drinkPropText">Sugar Level</span>
                <button
                  className={getButtonClassName("sugar", "0%")}
                  onClick={() => setselectedSugarLevel("0%")}
                >
                  0%
                </button>
                <button
                  className={getButtonClassName("sugar", "25%")}
                  onClick={() => setselectedSugarLevel("25%")}
                >
                  25%
                </button>
                <button
                  className={getButtonClassName("sugar", "50%")}
                  onClick={() => setselectedSugarLevel("50%")}
                >
                  50%
                </button>
                <button
                  className={getButtonClassName("sugar", "100%")}
                  onClick={() => setselectedSugarLevel("100%")}
                >
                  100%
                </button>
              </div>
            </div>
            <div className="row-9">
              <span className="drinkPropText m-2">Toppings</span>
              <div className="drinkToppings">
                <button
                  className={getButtonClassName("topping", "Tapioca Pearls")}
                  onClick={() => handleToppingClick("Tapioca Pearls")}
                >
                  Tapioca Pearls
                </button>
                <button
                  className={getButtonClassName("topping", "White Pearls")}
                  onClick={() => handleToppingClick("White Pearls")}
                >
                  White Pearls
                </button>
                <button
                  className={getButtonClassName("topping", "Milk Foam")}
                  onClick={() => handleToppingClick("Milk Foam")}
                >
                  Milk Foam
                </button>
                <button
                  className={getButtonClassName("topping", "Pudding")}
                  onClick={() => handleToppingClick("Pudding")}
                >
                  Pudding
                </button>
                <button
                  className={getButtonClassName("topping", "Oreo Crumbs")}
                  onClick={() => handleToppingClick("Oreo Crumbs")}
                >
                  Oreo Crumbs
                </button>
                <button
                  className={getButtonClassName("topping", "Basil Seeds")}
                  onClick={() => handleToppingClick("Basil Seeds")}
                >
                  Basil Seeds
                </button>
                <button
                  className={getButtonClassName("topping", "Herbal Jelly")}
                  onClick={() => handleToppingClick("Herbal Jelly")}
                >
                  Herbal Jelly
                </button>
                <button
                  className={getButtonClassName("topping", "Coconut Jelly")}
                  onClick={() => handleToppingClick("Coconut Jelly")}
                >
                  Coconut Jelly
                </button>
                <button
                  className={getButtonClassName("topping", "Ai-Yu Jelly")}
                  onClick={() => handleToppingClick("Ai-Yu Jelly")}
                >
                  Ai-Yu Jelly
                </button>
              </div>
            </div>
            <div className="row-9 bottomOverlay">
              <button className="bottomOverlayBack m-1" onClick={handleBackClick}>Back</button>
              <button className="bottomOverlayBack m-1" onClick={handleAddClick}>Add</button>
            </div>
          </div>
        </>
      )}

      {(isSeriesSelected || isLoading) && (
        <div className={view != "Customer View" ? "menuItemGrid w-75" : "categoryList"}>{itemsToRender}</div>
      )}
      {!isSeriesSelected && itemsToRender}
    </>
  );
}

export default CategoryGrid;
