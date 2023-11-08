import React, { useState } from "react";

class Drink {
  constructor(
    public name: string,
    public price: number,
    public quantity: number = 1
  ) {}
}

interface CartViewProps {
  // drinks: string[];
  drinkList: string[];
}

const CartView: React.FC<CartViewProps> = ({ drinkList: initialDrinks }) => {
  // query database based on drink name: price
  var drinks: Drink[] = [];

  const query = async (menuItemName: string) => {
    var url =
      "https://gong-cha-server.onrender.com/server/menuItems/" + menuItemName;
    const response = await fetch(url);
    const data = await response.json();
  };

  const [drinkList, setDrinks] = useState(initialDrinks);
  const subtotal = drinks.reduce(
    (total, drink) => total + drink.price * drink.quantity,
    0
  );
  const tax = subtotal * 0.0625; // Assuming tax is 6.25%
  const total = subtotal + tax;

  const addDrink = async (drinkToAdd: string) => {
    const data = await query(drinkToAdd);
    setDrinks((prevDrinks) => [
      ...prevDrinks,
      { ...drinkToAdd, price: data.menuitemprice, quantity: 1 },
    ]);
  };

  const removeDrink = (drinkToRemove: string) => {
    setDrinks(drinks.filter((string) => drink.name !== drinkToRemove));
  };

  const incrementQuantity = (drinkToIncrement: Drink) => {
    setDrinks(
      drinks.map((drink) =>
        drink === drinkToIncrement
          ? { ...drink, quantity: drink.quantity + 1 }
          : drink
      )
    );
  };

  const decrementQuantity = (drinkToDecrement: Drink) => {
    setDrinks(
      drinks.map((drink) =>
        drink === drinkToDecrement
          ? { ...drink, quantity: Math.max(1, drink.quantity - 1) }
          : drink
      )
    );
  };

  const clearCart = () => {
    setDrinks([]);
  };

  return (
    <div>
      <h2>Cart</h2>
      {drinks.map((drink, index) => (
        <div key={index}>
          <p>Name: {drink.name}</p>
          <p>Price: {drink.price}</p>
          <p>Quantity: {drink.quantity}</p>
          <button onClick={() => removeDrink(drink)}>Remove</button>
          <button onClick={() => incrementQuantity(drink)}>Add More</button>
          <button onClick={() => decrementQuantity(drink)}>Less</button>
        </div>
      ))}
      <p>Subtotal: {subtotal.toFixed(2)}</p>
      <p>Tax: {tax.toFixed(2)}</p>
      <p>Total: {total.toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default CartView;
