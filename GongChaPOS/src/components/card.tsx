import React from "react";
import "./components.css";

interface CardDetails {
  className: string;
  menuItemName: string;
  color?: string;
  onSelect: () => void; // Add this line
}

function Card({ className, menuItemName, color, onSelect }: CardDetails) {
  // let cardColor = generateRandomColor();
  let cardColor = '';

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
      cardColor = color || "#fff2cc";
      break;
  }

  // Styling makes the card a square with a random color
  const cardStyle: React.CSSProperties = {
    backgroundColor: cardColor,
  };


  return (
    <button className={className} style={cardStyle} onClick={onSelect}> 
      {menuItemName} 
    </button>
  );
};

export default Card;
