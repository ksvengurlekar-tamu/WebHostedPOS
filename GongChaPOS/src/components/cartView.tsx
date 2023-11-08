import React, { useState } from 'react';

class Drink {
    constructor(public name: string, public price: number, public quantity: number = 1) {}
}

interface CartViewProps {
    drinks: Drink[];
}

const CartView: React.FC<CartViewProps> = ({ drinks: initialDrinks }) => {
    const [drinks, setDrinks] = useState(initialDrinks);
    const subtotal = drinks.reduce((total, drink) => total + drink.price * drink.quantity, 0);
    const tax = subtotal * 0.0625; // Assuming tax is 6.25%
    const total = subtotal + tax;

    const removeDrink = (drinkToRemove: Drink) => {
        setDrinks(drinks.filter(drink => drink !== drinkToRemove));
    };

    const incrementQuantity = (drinkToIncrement: Drink) => {
        setDrinks(drinks.map(drink => drink === drinkToIncrement ? {...drink, quantity: drink.quantity + 1} : drink));
    };

    const decrementQuantity = (drinkToDecrement: Drink) => {
        setDrinks(drinks.map(drink => drink === drinkToDecrement ? {...drink, quantity: Math.max(1, drink.quantity - 1)} : drink));
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