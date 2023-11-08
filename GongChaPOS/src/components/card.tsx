import React from "react";
import "./components.css";

interface CardDetails {
  className: string;
  menuItemName: string;
  color: string;
  onSelect: (menuItemName: string) => void; // Add this line
}

const generateRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Card: React.FC<CardDetails> = ({ className, menuItemName, color, onSelect }) => {
  // let cardColor = generateRandomColor();
  let cardColor = color;

  switch (menuItemName) {
    case "Milk Foam":
      cardColor = "#fff2cc";
      break;
    case "Milk Tea":
      cardColor = "#fce5cd";
      break;
    case "Slush":
      cardColor = "#d9ead3";
      break;
    case "Seasonal":
      cardColor = "#c9daf8";
      break;
    case "Tea Latte":
      cardColor = "#d9d2e9";
      break;
    case "Coffee":
      cardColor = "#ead1dc";
      break;
    default:
      cardColor = color;
      break;
  }

  // Styling makes the card a square with a random color
  const cardStyle: React.CSSProperties = {
    backgroundColor: cardColor,
  };

  const handleClick = () => {
    onSelect(menuItemName); // Pass menuItemName to onSelect callback
  };

  return (
    <div className={className} style={cardStyle} onClick={handleClick}>
      {/* Use onClick here */}
      <h1>{menuItemName}</h1>
      {/* Other card content */}
    </div>
  );
};

export default Card;
