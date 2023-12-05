/**
 * @file cartView.tsx
 * @description Cart view component for displaying and managing the shopping cart in the Gong Cha POS project.
 */
import { useState, useEffect} from "react";

/**
 * @interface Topping
 * @description Interface representing a topping with id, name, and price.
 */
interface Topping {
  id: number;
  name: string;
  price: number;
}

/**
 * @interface Drink
 * @description Interface representing a drink with id, name, price, size, topping names, quantity, and image URL.
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
 * @interface CartViewProps
 * @description Props for configuring the CartView component.
 */
interface CartViewProps {
  InputDrinks: Drink[];
  onRemoveDrink: (drinkName: Drink) => void;
  onClearCart: () => void;
  onSubmit: () => void;
  view?: string;
}

/**
 * @function CartView
 * @description Cart view component displaying the shopping cart with drink items, quantities, and total amounts.
 * @param {CartViewProps} props - Props for configuring the CartView component.
 * @returns {JSX.Element} Rendered CartView component.
 */
function CartView({ InputDrinks, onRemoveDrink, onClearCart, onSubmit, view}: CartViewProps) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [toppings, setToppings] = useState<Topping[]>(); // this will align with the topping list
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const fetchTopping = async (toppingName: string): Promise<Topping> => {
    try {
      const response = await fetch(`https://gong-cha-server.onrender.com/menuitems/${toppingName}`);
      const data = await response.json();
      const topping = data[0];
      return { id: topping.menuitemid, name: topping.menuitemname, price: topping.menuitemprice };
    } catch (error) {
      console.log("Error fetching topping:", error);
      return { id: 0, name: "", price: 0 };
    }
  };

  useEffect(() => {
    // Load drinks from sessionStorage on component mount
    const savedDrinks = sessionStorage.getItem('drinks');
    if (savedDrinks) {
      InputDrinks = JSON.parse(savedDrinks);
    }
  }, []); // Empty dependency array ensures this effect runs only on mount

  useEffect(() => {
    const fetchToppings = async (newToppingNames: string[]) => {
      try {
        const newToppings = await Promise.all(newToppingNames.map(fetchTopping));
        setToppings((currentToppings) => [
          ...(currentToppings || []),
          ...newToppings
        ]);
      } catch (error) {
        console.log("Error fetching toppings:", error);
      }
    };

    const uniqueToppingNames = [...new Set(InputDrinks.flatMap((drink) => drink.topping_names))];
    const newToppingNames = uniqueToppingNames.filter((toppingName) => !toppings?.some(topping => topping.name === toppingName));

    if (newToppingNames.length > 0) {
      fetchToppings(newToppingNames);
    }
    
    setDrinks(InputDrinks);
  }, [InputDrinks]);
  
  /**
 * @description useEffect hook to calculate subtotal, tax, and total based on the selected drinks and toppings.
 */
  useEffect(() => {
    let newSubtotal = 0;

    for (let i = 0; i < drinks.length; i++) {
      let toppingTotal = 0;

      for (let j = 0; j < drinks[i].topping_names.length; j++) {
        const toppingName = drinks[i].topping_names[j];
        const topping = toppings?.find(t => t.name === toppingName);
        toppingTotal += topping ? topping.price : 0;
      }

      newSubtotal += (drinks[i].price + toppingTotal) * drinks[i].quantity;
    }

    setSubtotal(newSubtotal);
    const newTax = newSubtotal * 0.0625; // Assuming a tax rate of 6.25%
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  }, [drinks]);

  /**
 * @description Remove a selected drink from the cart.
 * @param {Drink} drinkToRemove - The drink to be removed.
 */
  const removeDrink = (drinkToRemove: Drink) => {
    onRemoveDrink(drinkToRemove);
  };

  /**
 * @description Increment the quantity of a selected drink in the cart.
 * @param {Drink} drinkToIncrement - The drink to be incremented.
 */
  const incrementQuantity = (drinkToIncrement: Drink) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink == drinkToIncrement ? { ...drink, quantity: drink.quantity + 1 } : drink
      )
    );
    setSelectedDrink(drinkToIncrement);
  };

  /**
 * @description Decrement the quantity of a selected drink in the cart, ensuring a minimum quantity of 1.
 * @param {Drink} drinkToDecrement - The drink to be decremented.
 */
  const decrementQuantity = (drinkToDecrement: Drink) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink == drinkToDecrement ? { ...drink, quantity: Math.max(1, drink.quantity - 1) } : drink
      )
    );
    setSelectedDrink(drinkToDecrement);
  };

  /**
 * @description Clear all items from the cart.
 */
  const clearCart = () => {
    onClearCart();
  };

  /**
 * @description Submit the order, triggering the onSubmit callback.
 */
  const submitOrder = () => {
    onSubmit();
  }

  return (
    <aside className={view != "Customer View" ? "" : "right-side-menu"} role="complementary" aria-label="Shopping Cart">
      {/* {view === "Customer View" && (<div className="overlay"></div>)}
      <div className={view != "Customer View" ? "" : "Popup"}></div> */}
      <h4 style={{fontSize: "40px"}}className={view != "Customer View" ? "m-0" : "customerm-0"}>Cart</h4>
      <div className={view != "Customer View" ? "cartView" : "customerCart"}>
        {drinks.map((drink, index) => (
          <button className="cart-item" key={index} onClick={() => setSelectedDrink(drink)} aria-labelledby={`drink-name-${index}`}>
            <div className="item-name-quantity-container">
              <span
                className="item-name-quantity d-flex"
                style={{
                  fontSize: drink.name.length > 30 ? '16px' : '20px' // Ternary operator for font size
                }}
              >
                {drink.size === "Large" && (<div style={{ fontSize: "20px", marginRight: "5px" }}>Large</div>)}
                {drink.size != "Large" && (<div style={{ fontSize: "20px", marginRight: "5px" }}>Medium</div>)}
                {drink.name} <span style={{ opacity: "0.5", fontSize: '20px', marginLeft: "10px" }}>x{drink.quantity}</span>
              </span>
              <span className="item-price">${drink.price.toFixed(2)}</span>
            </div>
            {(view == "Customer View") && (<img src={encodeURI(drink.imgurl)} alt={"drink image"} className="left-image" />)}
            <div className="item-toppings-container" aria-label="Toppings">
              {drink.topping_names.map((toppingName, toppingIndex) => {
                const topping = toppings?.find(t => t.name === toppingName);
                return (
                  <div key={toppingIndex} className="toppping-container" aria-label={`${toppingName} topping`}>
                      <span className="item-toppings" style={{fontSize: "20px"}}>{toppingName}</span>
                      <span className="item-toppings" style={{fontSize: "20px"}}>
                        +${topping ? topping.price.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </button>

        ))}
      </div>
      <div className={view != "Customer View" ? "cartText" : "customerCartText"}>
        <span className="spaced"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></span>
        <span className="spaced"><span>Tax:</span> <span>${tax.toFixed(2)}</span></span>
        <span className="spaced"><span>Total:</span> <span>${total.toFixed(2)}</span></span>
        <div className="cartViewButtons">
          <button className="cartViewButton" onClick={() => selectedDrink && removeDrink(selectedDrink)}>Remove</button>
          <button className="cartViewButton" onClick={() => selectedDrink && incrementQuantity(selectedDrink)}>Add More</button>
          <button className="cartViewButton" onClick={() => selectedDrink && decrementQuantity(selectedDrink)}>Less</button>   
        </div>
        <button className="cartViewButton" onClick={clearCart}>Clear Cart</button>
        <button className="cartViewButton " onClick={submitOrder}>Submit</button>
      </div>
      
    </aside>
  );
};

export default CartView;
