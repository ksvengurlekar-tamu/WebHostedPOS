import { useEffect, useState } from "react";
import Card from "../components/card.tsx";

interface CategoryGridProps {
  addToCart: (menuItemName: string) => void;
  setShowBackButton: any;
  setHandleBackFromTopBar: any;
}

function CategoryGrid({ addToCart, setShowBackButton, setHandleBackFromTopBar }: CategoryGridProps) {
  const [isSeriesSelected, setSeriesSelected] = useState(() => {
    const saved = localStorage.getItem('isSeriesSelected');
    return saved === 'true'; // If saved is the string 'true', return true, otherwise return false
  });
  const [isDrinkSelected, setDrinkSelected] = useState(() => {
    const saved = localStorage.getItem('isDrinkSelected');
    return saved === 'true'; // Same as above
  });
  const [menuItems, setMenuItems] = useState<any[]>(() => {
    // Load menu items from local storage or default to empty array
    const savedMenuItems = localStorage.getItem('menuItems');
    return savedMenuItems ? JSON.parse(savedMenuItems) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  // const [menuItems, setMenuItems] = useState([]);

  const handleSeriesClick = async (SeriesName: string) => {
    setIsLoading(true)
    setMenuItems([]); // This line clears the drink items
    setSeriesSelected(true);

    var url = "https://gong-cha-server.onrender.com/category/" + SeriesName;
    const response = await fetch(url);
    const data = await response.json();
    setMenuItems(data);
    localStorage.setItem('menuItems', JSON.stringify(data));
    setIsLoading(false);
  };

  const handleDrinkClick = () => {
    setDrinkSelected(true);
    console.log("Drink Selected!");
  };

  const handleBackClick = () => {
    if(isLoading || isSeriesSelected) {
      setSeriesSelected(false);
      setIsLoading(false);
    } else if (isDrinkSelected) {
      setDrinkSelected(false);
      setSeriesSelected(true);
    }
  };

  useEffect(() => {
    const savedSeriesSelected = localStorage.getItem('isSeriesSelected') === 'true';
    if (savedSeriesSelected) {
      // If the series was previously selected, we should load the menu items
      const savedMenuItems = localStorage.getItem('menuItems');
      if (savedMenuItems) {
        setMenuItems(JSON.parse(savedMenuItems));
      }
      // Assuming we want to set seriesSelected based on the presence of items
      setSeriesSelected(savedMenuItems != null);
    }
  }, []);

  useEffect(() => {
    // Decide when to show the back button
    setShowBackButton(isSeriesSelected || isDrinkSelected);
  }, [isSeriesSelected, isDrinkSelected, setShowBackButton]);

  useEffect(() => {
    setHandleBackFromTopBar(() => handleBackClick);
  }, [setHandleBackFromTopBar, isSeriesSelected, isDrinkSelected]);

  useEffect(() => {
    localStorage.setItem('isSeriesSelected', isSeriesSelected.toString());
  }, [isSeriesSelected]);

  useEffect(() => {
    localStorage.setItem('isDrinkSelected', isDrinkSelected.toString());
  }, [isDrinkSelected]);

  // Conditionally render different sets of items based on the state

  var itemsToRender;

  if (isLoading) {
    itemsToRender = Array.from({ length: 20 }, (_, index) => (
      <button key={index} className="skeleton-card button-no-hover" disabled>
        <div className="animated-background"></div>
      </button>
    ));
  }
  else if (isSeriesSelected) {
    console.log(menuItems);
    itemsToRender = menuItems.map((menuItem: any) => (
      <Card
        className="drink"
        key={menuItem.menuitemid}
        menuItemName={menuItem.menuitemname}
        color={menuItem.color}
        onSelect={addToCart}
      />
    ));

    const placeholderCount = 20 - menuItems.length;

    const placeholderItems = Array.from({ length: placeholderCount }, (_, index) => (
      <button key={index+placeholderCount} className="drink button-no-hover" style={{ backgroundColor: "#fcfcf2" }} disabled> </button>
    ));

    itemsToRender = [...itemsToRender, ...placeholderItems];

  } else if (isDrinkSelected) {
    // itemsToRender = POPUP implementation
  } else {
    itemsToRender = (
      <div className="categoryGrid w-25">
        <Card
          className="series"
          menuItemName="Milk Foam"
          color="#fff2cc"
          onSelect={() => handleSeriesClick("Milk Foam")}
        />
        <Card
          className="series"
          menuItemName="Milk Tea"
          color="#fce5cd"
          onSelect={() => handleSeriesClick("Milk Tea")}
        />
        <Card
          className="series"
          menuItemName="Slush"
          color="#d9ead3"
          onSelect={() => handleSeriesClick("Slush")}
        />
        <Card
          className="series"
          menuItemName="Seasonal"
          color="#c9daf8"
          onSelect={() => handleSeriesClick("Seasonal")}
        />
        <Card
          className="series"
          menuItemName="Tea Latte"
          color="#d9d2e9"
          onSelect={() => handleSeriesClick("Tea Latte")}
        />
        <Card
          className="series"
          menuItemName="Coffee"
          color="#ead1dc"
          onSelect={() => handleSeriesClick("Coffee")}
        />
      </div>
    );
  }

  return (
    <>
      {(isSeriesSelected || isLoading) && (
        <div className="menuItemGrid w-75">{itemsToRender}</div>
      )}
      {!isSeriesSelected && itemsToRender}
    </>
  );
}

export default CategoryGrid;
