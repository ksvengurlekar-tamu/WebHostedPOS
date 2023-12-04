import { useEffect, useRef, useState } from 'react';
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

function determineNextSeries(currentSeries: string): string {
    // Logic to determine the next series
    // This should return the name of the next series based on your own series logic
    // For example:
    const seriesOrder = ['Milk Foam', 'Milk Tea', 'Slush', 'Seasonal', 'Tea Latte', 'Coffee'];
    const currentSeriesIndex = seriesOrder.findIndex(series => series === currentSeries);
    const nextSeriesIndex = (currentSeriesIndex + 1) % seriesOrder.length;
    return seriesOrder[nextSeriesIndex];
}


function MenuBoard() {
    // const [autoScroll, setAutoScroll] = useState(true);
    // const [scrollPosition, setScrollPosition] = useState(0);
    // const scrollIntervalRef = useRef<number | null>(null);
    // const menuBoardRef = useRef<HTMLDivElement>(null); // Add this ref to your menuBoardDrinks div
    // const userInteractedRef = useRef(false);
    // const [startAutoScroll, setStartAutoScroll] = useState(false);
    const [autoScroll, setAutoScroll] = useState<boolean>(false);
    const [scrollIntervalRef, setScrollIntervalRef] = useState<number | null>(null);
    const menuBoardRef = useRef<HTMLDivElement | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const userHasInteracted = useRef(false);
    const [isLoading, setIsLoading] = useState(false);

    
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isSeriesSelected, setIsSeriesSelected] = useState(() => {
        const saved = sessionStorage.getItem("isSeriesSelected2");
        return saved === "true";
    });
    const [selectedSeries, setSelectedSeries] = useState<string>(() => {
        const savedSelectedSeries = sessionStorage.getItem('selectedSeries');
        return savedSelectedSeries || "Milk Foam";
    });
    const navigate = useNavigate();

    const handleAutoScroll = () => {
        if (!menuBoardRef.current) return;

        const menuBoard = menuBoardRef.current;
        const maxScroll = menuBoard.scrollHeight - menuBoard.clientHeight;

        if (scrollPosition < maxScroll) {
            setScrollPosition(prev => prev + 1); // Increment scroll position
        } else {
            goToNextSeries(); // When end is reached, go to next series
            setScrollPosition(0); // Reset scroll position
        }

        menuBoard.scrollTop = scrollPosition; // Apply the scroll
    };

    const goToNextSeries = () => {
        if (userHasInteracted.current) return; // Skip if user has interacted

        const nextSeries = determineNextSeries(selectedSeries);
        setSelectedSeries(nextSeries);
        setScrollPosition(0); // Reset scroll position
    };

    useEffect(() => {
        // Handle auto-scrolling
        if (autoScroll) {
            const intervalId = window.setInterval(handleAutoScroll, 50);
            setScrollIntervalRef(intervalId);
        } else {
            if (scrollIntervalRef) {
                clearInterval(scrollIntervalRef);
            }
        }
        return () => {
            if (scrollIntervalRef) {
                clearInterval(scrollIntervalRef);
            }
        };
    }, [autoScroll, scrollPosition]);

    // Fetch menu items whenever the selected series changes
    useEffect(() => {
        fetchMenuItems();
    }, [selectedSeries]);

    useEffect(() => {
        // Auto-scroll starts after 2 seconds if the user hasn't interacted
        const timeoutId = setTimeout(() => {
            if (!userHasInteracted.current) {
                setAutoScroll(true);
                setIsSeriesSelected(true);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, []);

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
        userHasInteracted.current = true; // Mark as interacted
        setIsLoading(true);
        if (scrollIntervalRef) {
            clearInterval(scrollIntervalRef); // Clear any existing interval
        }
        setSelectedSeries(seriesName);
        setIsSeriesSelected(true);
        setAutoScroll(false); // Disable auto-scroll when user selects a series
        setTimeout(() => {
                setAutoScroll(true);
                setIsSeriesSelected(true);
        }, 6000);

        setTimeout(() => {
            setIsLoading(false);
        }, 700);
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
                        <div className="menuBoardDrinks h-100 w-100 " ref={menuBoardRef}>
                            {isLoading ? (
                                Array(4).fill(0).map((_, index) => (
                                    <button key={index} className="skeletonCardCustomer button-no-hover" disabled style={{ width:"1400px",margin: "0px" }}>
                                        <div className="animated-background"></div>
                                    </button>
                                ))
                            ) : (
                                menuItems.map((menuItem) => (
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
                                ))
                            )}
                            
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
