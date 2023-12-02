import { useEffect, useState } from 'react';
import "../components/components.css";
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/topBar';
import gongChaLogo from '../assets/images/GongChaLogo.png';


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
    const [isSeriesSelected, setIsSeriesSelected] = useState(() => {
        const saved = sessionStorage.getItem("isSeriesSelected2");
        return saved === "true";
    });
    const [selectedSeries, setSelectedSeries] = useState<string>(() => {
        const savedSelectedSeries = sessionStorage.getItem('selectedSeries');
        return savedSelectedSeries || "Menu Board";
    });
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem("isSeriesSelected2", isSeriesSelected.toString());
    }, [isSeriesSelected]);

    useEffect(() => {
        sessionStorage.setItem("selectedSeries", selectedSeries.toString());
    }, [selectedSeries]);
    useEffect(() => {
        // Fetch menu items from the server
        fetchMenuItems();
    }, [selectedSeries]);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`https://gong-cha-server.onrender.com/category/${selectedSeries}`);
            const data = await response.json();
            setMenuItems(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };


    const handleSeriesClick = (seriesName: string) => {
        setSelectedSeries(seriesName);
        setIsSeriesSelected(true);
    };

    const onBackClick = () => {
        setIsSeriesSelected(false);
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <div className='vh-100 vw-100' style={{ backgroundColor: "hsl(39, 33%, 76%)" }}>
            <div>
                <TopBar isBackButtonVisible={true} view={"Customer View"} series={selectedSeries} onBackClick={onBackClick} />
            </div>
            <div className="menuBoardContainer">
                <div className="menuBoardColLeft ">
                    <button className={`btn btn-primary menuBoardButton mt-4 ${selectedSeries === "Milk Foam" ? "selectedSeriesButton" : ""}`} onClick={() => handleSeriesClick("Milk Foam")}>Milk Foam</button>
                    <button className={`btn btn-primary menuBoardButton ${selectedSeries === "Milk Tea" ? "selectedSeriesButton" : ""}`} onClick={() => handleSeriesClick("Milk Tea")}>Milk Tea</button>
                    <button className={`btn btn-primary menuBoardButton ${selectedSeries === "Slush" ? "selectedSeriesButton" : ""}`} onClick={() => handleSeriesClick("Slush")}>Slush</button>
                    <button className={`btn btn-primary menuBoardButton ${selectedSeries === "Seasonal" ? "selectedSeriesButton" : ""}`} onClick={() => handleSeriesClick("Seasonal")}>Seasonal</button>
                    <button className={`btn btn-primary menuBoardButton ${selectedSeries === "Tea Latte" ? "selectedSeriesButton" : ""}`} onClick={() => handleSeriesClick("Tea Latte")}>Tea Latte</button>
                    <button className={`btn btn-primary menuBoardButton mb-3 ${selectedSeries === "Coffee" ? "selectedSeriesButton" : ""}`} onClick={() => handleSeriesClick("Coffee")}>Coffee</button>

                </div>
                {isSeriesSelected && (
                    <div className='menuBoardDrinksContainer vw-100'>
                        <div className="menuBoardDrinksTitle w-100">
                            <span style={{ marginLeft: "173px" }}>Drink Name</span>
                            <span className='rightInfo w-25'>
                                <span>Calories</span>
                                <span style={{ marginLeft: "170px", marginRight: "30px" }}>Price</span>
                            </span>
                        </div>
                        <div className="menuBoardDrinks h-100 w-100">
                            {menuItems.map((menuItem) => (
                                <button key={menuItem.menuitemid} className="menuItemContainer">
                                    <img
                                        src={`/images/${selectedSeries}/${menuItem.menuitemname}.png`}
                                        width="8%"
                                        alt={menuItem.menuitemname}
                                        className="menuItemImg"
                                    ></img>
                                    <div className="menuItemName w-50">{menuItem.menuitemname}</div>
                                    <span className='rightInfo w-100'>
                                        <div className="menuItemCalories">{menuItem.menuitemcalories}</div>
                                        <div className="menuItemPrice" style={{ marginLeft: "173px" }}>${menuItem.menuitemprice.toPrecision(3)}</div>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {!isSeriesSelected && (
                    <div className="d-flex justify-content-center align-items-center mt-5 w-100">
                        <img
                            src={gongChaLogo}
                            alt="GongCha Logo"
                            width="30%"
                            className="img-fluid"
                        />
                    </div>
                )}

            </div>
        </ div>
    );
}

export default MenuBoard;
