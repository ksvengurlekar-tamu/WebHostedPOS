import React, { useEffect, useState } from "react";
import Card from "../components/card.tsx";


interface CategoryGridProps {
  addToCart: (menuItemName: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({addToCart}) => {
  const [isSeriesSelected, setSeriesSelected] = useState(false);
  const [isDrinkSelected, setDrinkSelected] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const handleSeriesClick = async (menuItemName: string) => {
    setSeriesSelected(true);
    console.log("Series Selected!");
    var url = "https://gong-cha-server.onrender.com/server/menuItems/" + menuItemName;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setMenuItems(data);
  };

  const handleDrinkClick = () => {
    setDrinkSelected(true);
    console.log("Drink Selected!");
  };

  useEffect(() => {
    fetch("https://gong-cha-server.onrender.com/server/menuItems/")
      .then((response) => response.json())
      .then((menuItems) => setMenuItems(menuItems))
      .catch((error) => console.error("Failed to fetch menu items: ", error));
  }, []);

  // Conditionally render different sets of items based on the state
  let itemsToRender = null;

  if (isSeriesSelected) {
    itemsToRender = menuItems.map((menuItem: any) => (
      <Card
        key={menuItem.menuitemid}
        menuItemName={menuItem.menuitemname}
        color={menuItem.color}
        onSelect={() => addToCart}
      />
    ));
  } else if (isDrinkSelected) {
    // itemsToRender = POPUP implementation


  } else {
    itemsToRender = (
      <div className="categoryGrid">
        <Card
          menuItemName="Milk Foam"
          color="#fff2cc"
          onSelect={() => handleSeriesClick("Milk Foam")}
        />
        <Card
          menuItemName="Milk Tea"
          color="#fce5cd"
          onSelect={() => handleSeriesClick("Milk Tea")}
        />
        <Card
          menuItemName="Slush"
          color="#d9ead3"
          onSelect={() => handleSeriesClick("Slush")}
        />
        <Card
          menuItemName="Seasonal"
          color="#c9daf8"
          onSelect={() => handleSeriesClick("Seasonal")}
        />
        <Card
          menuItemName="Tea Latte"
          color="#d9d2e9"
          onSelect={() => handleSeriesClick("Tea Latte")}
        />
        <Card
          menuItemName="Coffee"
          color="#ead1dc"
          onSelect={() => handleSeriesClick("Coffee")}
        />
      </div>
    );
  }

  return <>{itemsToRender}</>;
}

export default CategoryGrid;

// import React, { useState } from 'react';

// const ToggleExample = () => {
//   const [isVisible, setIsVisible] = useState(true);

//   return (
//     <>
//       <button onClick={() => setIsVisible(!isVisible)} className="btn btn-primary mb-5">
//         Toggle Element
//       </button>
//       {isVisible && (
//         <div className="alert alert-success" role="alert">
//           This element is visible!
//         </div>
//       )}
//     </>
//   );
// };

// export default ToggleExample;
