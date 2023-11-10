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
}

function CartView({InputDrinks}: CartViewProps) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  

  useEffect(() => {
    const fetchData = async () => {
      const updatedDrinks: Drink[] = [];

      for (const drink of InputDrinks) {
        const response = await fetch(
          `https://gong-cha-server.onrender.com/menuItems/${drink.name}`
        );
        const data = await response.json();
        
        let price = 0;
        data.forEach((element: any) => {
          price = element.menuitemprice;
        });
        const newDrink: Drink = {
          name: drink.name,
          price: price,
          size: drink.size,
          toppings: drink.toppings,
          quantity: 1,
        };

        updatedDrinks.push(newDrink);
      }

      console.log(updatedDrinks);
      setDrinks(updatedDrinks);
    };

    fetchData();
  }, [InputDrinks]);

  useEffect(() => {
    const newSubtotal = drinks.reduce((total, drink) => total + drink.price * drink.quantity, 0);
    console.log("price: ", newSubtotal);
    setSubtotal(newSubtotal);
    const newTax = newSubtotal * 0.0625;
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  }, [drinks]);

  const removeDrink = (drinkToRemove: Drink | null) => {
    if (drinkToRemove === null) return;
    setDrinks((prevDrinks) => prevDrinks.filter((drink) => drink !== drinkToRemove));
  };

  const incrementQuantity = (drinkToIncrement: Drink | null) => {
    if (drinkToIncrement === null) return;
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink === drinkToIncrement ? { ...drink, quantity: drink.quantity + 1 } : drink
      )
    );
  };

  const decrementQuantity = (drinkToDecrement: Drink | null) => {
    if (drinkToDecrement === null) return;
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink === drinkToDecrement ? { ...drink, quantity: Math.max(1, drink.quantity - 1) } : drink
      )
    );
  };

  const clearCart = () => {
    setDrinks([]);
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
                fontSize: drink.name.length > 18 ? '20px' : '30px' // Ternary operator for font size
              }}
              >{drink.name} <span style={{opacity: "0.5", fontSize: drink.name.length > 18 ? '20px' : '30px' }}>x{drink.quantity}</span></span>
              <span className="item-price">${drink.price}</span>
            </button>

        ))}
      </div>
      <div className="cartText">
        <span className="spaced"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></span>
        <span className="spaced"><span>Tax:</span> <span>${tax.toFixed(2)}</span></span>
        <span className="spaced"><span>Total:</span> <span>${total.toFixed(2)}</span></span>
        <div className="cartViewButtons">
          <button className="cartViewButton" onClick={() => removeDrink(selectedDrink)}>Remove</button>
          <button className="cartViewButton" onClick={() => incrementQuantity(selectedDrink)}>Add More</button>
          <button className="cartViewButton" onClick={() => decrementQuantity(selectedDrink)}>Less</button>   
      </div>
        <button className="cartViewButton" onClick={clearCart}>Clear Cart</button>
        <button className="cartViewButton " onClick={clearCart}>Sumbit</button> {/* submit logic to replace clearCart*/}
      </div>
      
    </>
  );
};

export default CartView;
