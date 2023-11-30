import React, { useEffect, useState } from 'react';
import "../components/components.css";
import { useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

interface MenuItem {
    menuitemid: number;
    menuitemname: string;
    menuitemprice: number;
    menuitemcalories: string;
    menuitemcategory: string;
    menuitemhascaffeine: boolean;
}

function MenuBoard() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch menu items from the server
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('https://gong-cha-server.onrender.com/menuitems');
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const filterAndRenderCategory = (menuitemcategory: string) => (
        <div className="menu-category" key={menuitemcategory}>
            <h3>{menuitemcategory}</h3>
            {menuItems
                .filter((menuItem) => menuItem.menuitemcategory === menuitemcategory)
                .map((menuItem) => (
                    <div key={menuItem.menuitemid} className="menu-item-container">
                        <img
                            src={`/images/${menuitemcategory}/${menuItem.menuitemname}.png`}
                            alt={menuItem.menuitemname}
                            className="menu-item-image"
                        />
                        <div className="menu-item-details">
                            <strong>{menuItem.menuitemname}</strong>, Price: ${menuItem.menuitemprice}, Calories: {menuItem.menuitemcalories}
                        </div>
                    </div>
                ))}
        </div>
    );

    const onBackClick = () => {
        navigate("/");
    };

    return (
        <div className="menu-board">
            <button className="back-button" onClick={onBackClick}>
                <FontAwesomeIcon icon={faArrowLeftLong} className="Back-icon" />
            </button>
            <h2>Gong Cha Menu Items</h2>
            <div className="menu-categories-container">
                <div className="menu-categories-left">
                    {filterAndRenderCategory('Milk Foam')}
                    {filterAndRenderCategory('Milk Tea')}
                    {filterAndRenderCategory('Slush')}
                </div>
                <div className="menu-categories-right">
                    {filterAndRenderCategory('Seasonal')}
                    {filterAndRenderCategory('Tea Latte')}
                    {filterAndRenderCategory('Coffee')}
                </div>
            </div>
        </div>
    );
}

export default MenuBoard;
