// import React, { useState } from "react";

// class Drink {
//   constructor(
//     public name: string,
//     public price: number,
//     public quantity: number = 1
//   ) {}
// }

// interface CartViewProps {
//   drinks: Drink[];
// }

// const CartView: React.FC<CartViewProps> = ({ drinks: initialDrinks }) => {
//   // query database based on drink name: price

//   const query = async (menuItemName: string) => {
//     var url =
//       "https://gong-cha-server.onrender.com/server/menuItems/" + menuItemName;
//     const response = await fetch(url);
//     const data = await response.json();
//   };

//   const [drinks, setDrinks] = useState(initialDrinks);
//   const subtotal = drinks.reduce(
//     (total, drink) => total + drink.price * drink.quantity,
//     0
//   );
//   const tax = subtotal * 0.0625; // Assuming tax is 6.25%
//   const total = subtotal + tax;

//   const addDrink = async (drinkToAdd: Drink) => {
//     const data = await query(drinkToAdd.name);
//     setDrinks((prevDrinks) => [
//       ...prevDrinks,
//       { ...drinkToAdd, price: data.menuitemprice, quantity: 1 },
//     ]);
//   };

//   const removeDrink = (drinkToRemove: Drink) => {
//     setDrinks(drinks.filter((drink) => drink !== drinkToRemove));
//   };

//   const incrementQuantity = (drinkToIncrement: Drink) => {
//     setDrinks(
//       drinks.map((drink) =>
//         drink === drinkToIncrement
//           ? { ...drink, quantity: drink.quantity + 1 }
//           : drink
//       )
//     );
//   };

//   const decrementQuantity = (drinkToDecrement: Drink) => {
//     setDrinks(
//       drinks.map((drink) =>
//         drink === drinkToDecrement
//           ? { ...drink, quantity: Math.max(1, drink.quantity - 1) }
//           : drink
//       )
//     );
//   };

//   const clearCart = () => {
//     setDrinks([]);
//   };

//   return (
//     <div>
//       <h2>Cart</h2>
//       {drinks.map((drink, index) => (
//         <div key={index}>
//           <p>Name: {drink.name}</p>
//           <p>Price: {drink.price}</p>
//           <p>Quantity: {drink.quantity}</p>
//           <button onClick={() => removeDrink(drink)}>Remove</button>
//           <button onClick={() => incrementQuantity(drink)}>Add More</button>
//           <button onClick={() => decrementQuantity(drink)}>Less</button>
//         </div>
//       ))}
//       <p>Subtotal: {subtotal.toFixed(2)}</p>
//       <p>Tax: {tax.toFixed(2)}</p>
//       <p>Total: {total.toFixed(2)}</p>
//       <button onClick={clearCart}>Clear Cart</button>
//     </div>
//   );
// };

// export default CartView;


import React, { useState, useEffect } from "react";

interface CartViewProps {
  className: string;
  drinkNames: string[];
}

const CartView: React.FC<CartViewProps> = ({ drinkNames: initialDrinkNames }) => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  interface Drink {
    name: string;
    price: number;
    quantity: number;
  }

  useEffect(() => {
    const fetchData = async () => {
      const updatedDrinks: Drink[] = [];

      for (const drinkName of initialDrinkNames) {
        const response = await fetch(
          `https://localhost:9000/server/menuItems/${drinkName}`
        );
        const data = await response.json();

        const newDrink: Drink = {
          name: drinkName,
          price: data.menuitemprice,
          quantity: 1,
        };

        updatedDrinks.push(newDrink);
      }

      console.log(updatedDrinks);
      setDrinks(updatedDrinks);
    };

    fetchData();
  }, [initialDrinkNames]);

  useEffect(() => {
    const newSubtotal = drinks.reduce((total, drink) => total + drink.price * drink.quantity, 0);
    console.log("price: ", newSubtotal);
    setSubtotal(newSubtotal);
    const newTax = newSubtotal * 0.0625;
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  }, [drinks]);

  const removeDrink = (drinkToRemove: Drink) => {
    setDrinks((prevDrinks) => prevDrinks.filter((drink) => drink !== drinkToRemove));
  };

  const incrementQuantity = (drinkToIncrement: Drink) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink === drinkToIncrement ? { ...drink, quantity: drink.quantity + 1 } : drink
      )
    );
  };

  const decrementQuantity = (drinkToDecrement: Drink) => {
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
