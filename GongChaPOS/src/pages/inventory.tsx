import LeftNavBar from "../components/leftnavbar";
import TopBar from "../components/topBar";
import "../components/components.css";
import GenericTable from "../components/genericTable";
import AutoCompleteCustom from "../components/autoCompleteCustom";
import { useEffect, useState } from "react";
import axios from "axios";


interface InventoryItem {
  inventoryid: number;
  inventoryname: string;
  inventoryquantity: number;
  inventoryreceiveddate: string;
  inventoryexpirationdate: string;
  inventoryinstock: boolean;
  inventorysupplier: string;
}
const inventoryColumns: { key: keyof InventoryItem; header: string }[] = [
  { key: "inventoryid", header: "ID" },
  { key: "inventoryname", header: "Name" },
  { key: "inventoryquantity", header: "Quantity" },
  { key: "inventoryreceiveddate", header: "Received" },
  { key: "inventoryexpirationdate", header: "Expiry" },
  { key: "inventoryinstock", header: "In Stock" },
  { key: "inventorysupplier", header: "Supplier" },
];

interface salesItem {
  orderid: number;
  orderno: number;
  saledate: string;
  saletime: string;
  employeeid: number;
  saleprice: number;
  islarge: boolean;
  menuitemid: number;
}
const salesColumns: { key: keyof salesItem; header: string }[] = [
  { key: "orderid", header: "Order ID" },
  { key: "orderno", header: "Order No." },
  { key: "saledate", header: "Sale Date" },
  { key: "saletime", header: "Sale Time" },
  { key: "employeeid", header: "Employee ID" },
  { key: "saleprice", header: "Sale Price" },
  { key: "islarge", header: "Is Large" },
  { key: "menuitemid", header: "Menu Item ID" },
];

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredInventoryItems, setFilteredInventoryItems] = useState<InventoryItem[]>([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().substring(0, 10));
  const [showSalesReport, setShowSalesReport] = useState(() => {
    const saved = sessionStorage.getItem("showSalesReport");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [showRestockReport, setShowRestockReport] = useState(() => {
    const saved = sessionStorage.getItem("showRestockReport");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch("http://localhost:9000/inventory");
        let data = await response.json();
        data = [...data].sort((a, b) => a.inventoryid - b.inventoryid);
        data = data.map((item: InventoryItem) => ({
          ...item,
          inventoryreceiveddate: item.inventoryreceiveddate.substring(0, 10),
          inventoryexpirationdate: item.inventoryexpirationdate.substring(
            0,
            10
          ),
          inventoryinstock: item.inventoryinstock ? "Yes" : "No",
        }));
        setInventoryItems(data);
      } catch (error) {
        console.error("Failed to fetch inventory items:", error);
      }
    };
    fetchInventoryItems();

    const fetchMenuItems = async () => {
      try {
        const menuItems = await fetch(
          "https://gong-cha-server.onrender.com/menuitems"
        );
        const data = await menuItems.json();
        const menuItemNames = data.map((item: any) => item.menuitemname);
        setMenuItems(menuItemNames);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("showSalesReport", showSalesReport.toString());
  }, [showSalesReport]);
  useEffect(() => {
    sessionStorage.setItem("showRestockReport", showRestockReport.toString());
  }, [showRestockReport]);

  const handleMenuItemSelect = async (inputMenuItem?: string, inputStartDate?: string, inputEndDate?: string) => {

    // Determine the current or new dates to use for fetching
    const fetchMenuItem = inputMenuItem ?? selectedMenuItem;
    const fetchStartDate = inputStartDate ?? startDate;
    const fetchEndDate = inputEndDate ?? endDate;

    // Update state if new dates are provided
    if (inputMenuItem !== undefined) {
      setSelectedMenuItem(inputMenuItem);
    }
    if (inputStartDate !== undefined) {
      setStartDate(inputStartDate);
    }
    if (inputEndDate !== undefined) {
      setEndDate(inputEndDate);
    }

  
    try {
      const response = await axios.get('http://localhost:9000/salesReport', {
        params: {
          menuItem: fetchMenuItem,
          startDate: fetchStartDate,
          endDate: fetchEndDate
        }
      });

      let salesData = response.data.map((item: salesItem) => ({
        ...item,
        saledate: item.saledate.substring(0, 10),
        saletime: item.saletime, 
        islarge: item.islarge ? "Yes" : "No",
      }));
      console.log(salesData);
      setSalesData(salesData);
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
    }
  
  };

  const handleSalesReportBack = () => {

    setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10));
    setEndDate(new Date().toISOString().substring(0, 10));
    setSalesData([]);
    setSelectedMenuItem("");
    setShowSalesReport(false);
  };

  const handleRestockReport = async () => {
    const response = await fetch("http://localhost:9000/inventory");
    let data = await response.json();

    data = [...data].sort((a, b) => a.inventoryid - b.inventoryid); // sort
    data = data.map((item: InventoryItem) => ({
      ...item,
      inventoryreceiveddate: item.inventoryreceiveddate.substring(0, 10),
      inventoryexpirationdate: item.inventoryexpirationdate.substring(0,10),
    })); // date stuff
    console.log(data);
    const outOfStockItems = data.filter((item:any) => !item.inventoryinstock);
    
    
    setFilteredInventoryItems(outOfStockItems); // Update the state with filtered items
    setShowRestockReport(true);

  };


  const HandleExcessReport = () => {};

  const HandlePairProduct = () => {};

  const HandleAddInventory = () => {};

  return (
    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col-2 d-flex flex-column vh-100 p-0">
        <LeftNavBar view={"Manager View"} />
      </div>
      <div className="col d-flex flex-column vh-100 p-0 main-content">
        <TopBar
          isBackButtonVisible={false}
          view={"Manager View"}
          series={"Inventory View"}
        />
        {showRestockReport && ( // restock report popup
          <>
            <div className="overlay"></div>
            <div className="Popup d-flex flex-column">
              <GenericTable<InventoryItem>
                data={filteredInventoryItems}
                columns={inventoryColumns}
                />
              <div className="bottomOverlay"><button className="drinkPropButton" onClick={() => setShowRestockReport(false)}>Back</button></div>
            </div>
          </>
        )}
        {showSalesReport && ( // sales report popup
          <>
            <div className="overlay"></div>
            <div className="Popup d-flex flex-column">
              <div className="salesInputRow">
                <AutoCompleteCustom data={menuItems} label="Menu Item" handleSelect={handleMenuItemSelect} />
                <label htmlFor="start-date">
                  Start Date:
                  <input className="dateInput" type="date" onChange={(e) => handleMenuItemSelect(undefined,e.target.value, undefined)} defaultValue={new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10)}  />
                </label>
                <label htmlFor="end-date">
                  End Date:
                  <input className="dateInput" type="date" onChange={(e) => handleMenuItemSelect(undefined, undefined, e.target.value)} defaultValue={new Date().toISOString().substring(0, 10)}  />
                </label>
              </div>
              <div className="tableContainer">
                <GenericTable<salesItem>
                    className="salesTable"
                    data={salesData}
                    columns={salesColumns}
                />
              </div>
              <div className="bottomOverlay "><button className="drinkPropButton " onClick={handleSalesReportBack}>Back</button></div>
            </div>
          </>
        )}
        <GenericTable<InventoryItem>
          data={inventoryItems}
          columns={inventoryColumns}
        />

        <div className="bottomNavBar">
          <button onClick={() => setShowSalesReport(true)}>Sales Report</button>
          <button onClick={HandleExcessReport}>Excess Report</button>
          <button onClick={handleRestockReport}>Restock Report</button>
          <button onClick={HandlePairProduct}>Pair Product</button>
          <button onClick={HandleAddInventory}>Add Inventory</button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
