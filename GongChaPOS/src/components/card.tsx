import React from 'react'
import './components.css';

interface CardDetails {
  menuItemName: string;
  onClick: () => void; // Add this line
}

const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Card: React.FC<CardDetails> = ({ menuItemName, onClick }) => {
  let cardColor = generateRandomColor();

  switch (menuItemName) {
    case 'Milk Foam':
      cardColor = '#fff2cc';
      break;
    case 'Milk Tea':
      cardColor = '#fce5cd';
      break;
    case 'Slush':
      cardColor = '#d9ead3';
      break;
    case 'Seasonal':
      cardColor = '#c9daf8';
      break;
    case 'Tea Latte':
      cardColor = '#d9d2e9';
      break;
    case 'Coffee':
      cardColor = '#ead1dc';
      break;
    default:
      cardColor = generateRandomColor();
      break;
  }

  // Styling makes the card a square with a random color
  const cardStyle = {
    backgroundColor: cardColor,
    width: '100px',
    height: '100px',
    fontSize: '7px',
  };

  return (
    <div className="card" style={cardStyle} onClick={onClick}> {/* Use onClick here */}
      <h1>{menuItemName}</h1>
      {/* Other card content */}
    </div>
  );

};


export default Card;