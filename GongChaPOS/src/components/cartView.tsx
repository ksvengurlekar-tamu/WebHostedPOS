import { useState, useEffect} from "react";

interface Drink {
  name: string;
  price: number;
  size: string;
  toppings: string[];
  quantity: number;
}
interface CartViewProps {
  InputDrinks: Drink[];
  onRemoveDrink: (drinkName: string) => void;
  onClearCart: () => void;
}

function CartView({ InputDrinks, onRemoveDrink, onClearCart }: CartViewProps) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  

  useEffect(() => {
    console.log("InputDrinks: ", InputDrinks);
    setDrinks(InputDrinks)
  }, [InputDrinks]);

  useEffect(() => {
    const newSubtotal = drinks.reduce((total, drink) => total + drink.price * drink.quantity, 0);
    console.log("price: ", newSubtotal);
    setSubtotal(newSubtotal);
    const newTax = newSubtotal * 0.0625;
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  }, [drinks]);

  const removeDrink = (drinkToRemove: string) => {
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

  return (
    <>
      <h4 className="m-0">Cart</h4>
      <div className="cartView">
        {drinks.map((drink, index) => (
            <button className="cart-item" key={index} onClick={() => setSelectedDrink(drink)}>
              <span 
              className="item-name-quantity"
              style={{
                fontSize: drink.name.length > 30 ? '16px' : '20px' // Ternary operator for font size
              }}
              >
                {drink.name} <span style={{opacity: "0.5", fontSize: '20px' }}>x{drink.quantity}</span></span>
              <span className="item-price">${drink.price}</span>
            </button>

        ))}
      </div>
      <div className="cartText">
        <span className="spaced"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></span>
        <span className="spaced"><span>Tax:</span> <span>${tax.toFixed(2)}</span></span>
        <span className="spaced"><span>Total:</span> <span>${total.toFixed(2)}</span></span>
        <div className="cartViewButtons">
          <button className="cartViewButton" onClick={() => selectedDrink && removeDrink(selectedDrink.name)}>Remove</button>
          <button className="cartViewButton" onClick={() => selectedDrink && incrementQuantity(selectedDrink.name)}>Add More</button>
          <button className="cartViewButton" onClick={() => selectedDrink && decrementQuantity(selectedDrink.name)}>Less</button>   
      </div>
        <button className="cartViewButton" onClick={clearCart}>Clear Cart</button>
        <button className="cartViewButton " onClick={clearCart}>Sumbit</button> {/* submit logic to replace clearCart*/}
      </div>
      
    </>
  );
};

export default CartView;
