import React, { useState } from 'react';
import Card from '../components/card.tsx';

function CategoryGrid() {
  const [isSeriesSelected, setSeriesSelected] = useState(false);
  const [isDrinkSelected, setDrinkSelected] = useState(false);

  const handleSeriesClick = () => {
    setSeriesSelected(true);
    console.log('Series Selected!');
  };

  const handleDrinkClick = () => {
    setDrinkSelected(true);
    console.log('Drink Selected!');
  };



  if (isSeriesSelected) {
    // Render a different set of items when a card is clicked
    return (
      <div className='categoryGrid'>
        {/* Replace this with your actual data */}
        <Card menuItemName="Milk Foam" onClick={handleDrinkClick} />
        {/* ... */}
      </div>
    );
  }

  else if (isDrinkSelected) {
    // Render a different set of items when a card is clicked
    return (
      <div className='categoryGrid'>
        {/* Replace this with your actual data */}
        <Card menuItemName="Milk Foam" onClick={handleDrinkClick} />
        {/* ... */}
      </div>
    );
  }

  else return (
    <div className='categoryGrid'>
      <Card menuItemName="Milk Foam" onClick={handleSeriesClick} />
      <Card menuItemName="Milk Tea" onClick={handleSeriesClick} />
      <Card menuItemName="Slush" onClick={handleSeriesClick} />
      <Card menuItemName="Seasonal" onClick={handleSeriesClick} />
      <Card menuItemName="Tea Latte" onClick={handleSeriesClick} />
      <Card menuItemName="Coffee" onClick={handleSeriesClick} />
    </div>
  );
}

export default CategoryGrid;