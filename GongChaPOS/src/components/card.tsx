import React from 'react'

interface CardDetails {
  menuItemName: string;
}

const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Card: React.FC<CardDetails> = ({ menuItemName }) => {
  const cardColor = generateRandomColor();

  // Styling makes the card a square with a random color
  const cardStyle = {
    backgroundColor: cardColor,
    width: '25px',
    height: '25px',
    fontSize: '10px',
  };

  return (
    <div className="card" style={cardStyle}>
      <h2>{menuItemName}</h2>
      {/* Other card content */}
    </div>
  );
};


export default Card;