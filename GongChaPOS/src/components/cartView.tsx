import { useState, useEffect} from "react";

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

interface CartViewProps {
  InputDrinks: Drink[];
  onRemoveDrink: (drinkName: Drink) => void;
  onClearCart: () => void;
  onSubmit: () => void;
}

function CartView({ InputDrinks, onRemoveDrink, onClearCart, onSubmit }: CartViewProps) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [toppingPrices, setToppingPrices] = useState<Map<string, any>>(new Map()); // this will align with the topping list
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const fetchTopping = async (toppingName: string): Promise<Topping> => {
    try {
      const response = await fetch(`http://localhost:9000/menuitems/${toppingName}`);
      const data = await response.json();
      const topping = data[0];
      return { id: topping.menuitemid, name: topping.menuitemname, price: topping.menuitemprice };
    } catch (error) {
      console.log("Error fetching topping:", error);
      return { id: 0, name: "", price: 0 };
    }
  };

  useEffect(() => {
    const fetchToppings = async (newToppingNames: string[]) => {
      try {
        const newToppings = await Promise.all(newToppingNames.map(fetchTopping));
        const updatedToppings = new Map(toppingPrices);
        newToppings.forEach((topping) => {
          updatedToppings.set(topping.name, { id: topping.id, price: topping.price });
        });
        setToppingPrices(updatedToppings);
      } catch (error) {
        console.log("Error fetching toppings:", error);
      }
    };

    const uniqueToppingNames = [...new Set(InputDrinks.flatMap((drink) => drink.topping_names))];
    const newToppingNames = uniqueToppingNames.filter((toppingName) => !toppingPrices.has(toppingName));

    if (newToppingNames.length > 0) {
      fetchToppings(newToppingNames);
    }

    setDrinks(InputDrinks.map((drink) => ({
      ...drink,
      toppings: drink.topping_names.map((toppingName) => {
        const topping = toppingPrices.get(toppingName);
        return { id: topping?.id || 0, name: toppingName, price: topping?.price || 0 };
      })
    })));
  }, [InputDrinks, toppingPrices]);
  
    
  useEffect(() => {
    let newSubtotal = 0;

    for (let i = 0; i < drinks.length; i++) {
      let toppingTotal = 0;

      for (let j = 0; j < drinks[i].toppings.length; j++) {
        const topping = drinks[i].toppings[j];
        toppingTotal += topping.price;
      }

      newSubtotal += (drinks[i].price + toppingTotal) * drinks[i].quantity;
    }

    setSubtotal(newSubtotal);
    const newTax = newSubtotal * 0.0625; // Assuming a tax rate of 6.25%
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  }, [drinks]);

  const removeDrink = (drinkToRemove: Drink) => {
    onRemoveDrink(drinkToRemove);
  };

  const incrementQuantity = (drinkToIncrement: Drink) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink == drinkToIncrement ? { ...drink, quantity: drink.quantity + 1 } : drink
      )
    );
    setSelectedDrink(drinkToIncrement);
  };

  const decrementQuantity = (drinkToDecrement: Drink) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink == drinkToDecrement ? { ...drink, quantity: Math.max(1, drink.quantity - 1) } : drink
      )
    );
    setSelectedDrink(drinkToDecrement);
  };

  const clearCart = () => {
    onClearCart();
  };

  const submitOrder = () => {
    onSubmit();
  }

  return (
    <>
      <h4 className="m-0">Cart</h4>
      <div className="cartView">
        {drinks.map((drink, index) => (
            <button className="cart-item" key={index} onClick={() => setSelectedDrink(drink)}>
              <div className="item-name-quantity-container">
                <span 
                className="item-name-quantity"
                style={{
                  fontSize: drink.name.length > 30 ? '16px' : '20px' // Ternary operator for font size
                }}
                >
                  {drink.name} <span style={{opacity: "0.5", fontSize: '20px' }}>x{drink.quantity}</span></span>
                <span className="item-price">${drink.price.toFixed(2)}</span> 
              </div>
              <div className="item-toppings-container">
                  {drink.toppings.map((topping, index) => (
                    <div className="topping-container">
                      <span key={index} className="item-toppings" style={{fontSize: "20px"}}>{topping.name} </span>
                      <span className="item-toppings" style={{fontSize: "20px"}}>+${topping.price.toFixed(2)}</span> 
                    </div>
                  ))}
              </div>
            </button>

        ))}
      </div>
      <div className="cartText">
        <span className="spaced"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></span>
        <span className="spaced"><span>Tax:</span> <span>${tax.toFixed(2)}</span></span>
        <span className="spaced"><span>Total:</span> <span>${total.toFixed(2)}</span></span>
        <div className="cartViewButtons">
          <button className="cartViewButton" onClick={() => selectedDrink && removeDrink(selectedDrink)}>Remove</button>
          <button className="cartViewButton" onClick={() => selectedDrink && incrementQuantity(selectedDrink)}>Add More</button>
          <button className="cartViewButton" onClick={() => selectedDrink && decrementQuantity(selectedDrink)}>Less</button>   
      </div>
        <button className="cartViewButton" onClick={clearCart}>Clear Cart</button>
        <button className="cartViewButton " onClick={submitOrder}>Sumbit</button> {/* submit logic to replace clearCart*/}
      </div>
      
    </>
  );
};

export default CartView;
