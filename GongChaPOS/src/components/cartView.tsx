import { useState, useEffect} from "react";

interface Drink {
  id: number;
  name: string;
  price: number;
  size: string;
  toppings: string[];
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
  const [toppingPrices, setToppingPrices] = useState<Map<string, number>>(new Map()); // this will align with the topping list
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  

  useEffect(() => {
    const fetchToppingPrices = async (newToppings: string[]) => {
      try {
        const responses = await Promise.all(newToppings.map(topping =>
          // fetch(`https://gong-cha-server.onrender.com/menuitems/${topping}`)));
          fetch(`http://localhost:9000/menuitems/${topping}`)));
        const prices = await Promise.all(responses.map(res => res.json()));
        
        setToppingPrices((currentPrices) => {
          const updatedPrices = new Map(currentPrices);
          prices.forEach((price, index) => {
            updatedPrices.set(newToppings[index], price[0].menuitemprice);
          });
          
          return updatedPrices;
        });
      } catch (error) {
        console.log("Error fetching topping prices:", error);
      }
    };

    const uniqueToppings = [...new Set(InputDrinks.flatMap(drink => drink.toppings))];
    const newToppings = uniqueToppings.filter(topping => !toppingPrices.has(topping));

    if (newToppings.length > 0) {
      fetchToppingPrices(newToppings);
    }

    setDrinks(InputDrinks)
  }, [InputDrinks]);

  useEffect(() => {
    let newSubtotal = 0;

    for (let i = 0; i < drinks.length; i++) {
      let toppingTotal = 0;

      for (let j = 0; j < drinks[i].toppings.length; j++) {
        const topping = drinks[i].toppings[j];
        const toppingPrice = toppingPrices.get(topping) || 0;
        toppingTotal += toppingPrice;
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

  const incrementQuantity = (drinkToIncrement: string) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink.name === drinkToIncrement ? { ...drink, quantity: drink.quantity + 1 } : drink
      )
    );
  };

  const decrementQuantity = (drinkToDecrement: string) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink.name === drinkToDecrement ? { ...drink, quantity: Math.max(1, drink.quantity - 1) } : drink
      )
    );
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
                    <div className="toppping-container">
                      <span key={index} className="item-toppings" style={{fontSize: "20px"}}>{topping} </span>
                      <span className="item-toppings" style={{fontSize: "20px"}}>+${toppingPrices.has(topping) ? toppingPrices.get(topping)!.toFixed(2) : '0.00'}</span> 
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
          <button className="cartViewButton" onClick={() => selectedDrink && incrementQuantity(selectedDrink.name)}>Add More</button>
          <button className="cartViewButton" onClick={() => selectedDrink && decrementQuantity(selectedDrink.name)}>Less</button>   
      </div>
        <button className="cartViewButton" onClick={clearCart}>Clear Cart</button>
        <button className="cartViewButton " onClick={submitOrder}>Sumbit</button> {/* submit logic to replace clearCart*/}
      </div>
      
    </>
  );
};

export default CartView;
