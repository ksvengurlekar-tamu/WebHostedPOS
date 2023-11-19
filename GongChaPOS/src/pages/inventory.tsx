import LeftNavBar from "../components/leftnavbar";
import TopBar from "../components/topBar";
import "../components/components.css";
import GenericTable from "../components/genericTable";
import AutoCompleteCustom from "../components/autoCompleteCustom";
import { useEffect, useState } from "react";


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

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSalesReport, setShowSalesReport] = useState(false);

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
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleMenuItemSelect = (menuItem: string) => {
    setSelectedMenuItem(menuItem);
    // TODO: Filter inventory items by menu item by just updating the menuItems state you might have to query
  };
  const handleStartDate = (startDate:any) => {
    setStartDate(startDate);
    // TODO: Filter inventory items by start Date by just updating the menuItems state you might have to query
  };
  const handleEndDate = (endDate:any) => {
    setEndDate(endDate);
    // TODO: Filter inventory items by end Date by just updating the menuItems state you might have to query
  };


  const HandleExcessReport = () => {};

  const HandleRestockReport = () => {};

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
        {showSalesReport && (
          <>
            <div className="overlay"></div>
            <div className="Popup d-flex flex-column">
              <div className="salesInputRow">
                <AutoCompleteCustom data={menuItems} label="Menu Item" handleSelect={handleMenuItemSelect} />
                <label htmlFor="start-date">
                  Start Date:
                  <input type="date" onChange={(e) => handleStartDate(e.target.value)}  />
                </label>
                <label htmlFor="end-date">
                  End Date:
                  <input type="date" onChange={(e) => handleEndDate(e.target.value)} defaultValue={new Date().toISOString().substring(0, 10)}  />
                </label>
              </div>
              <div className="tableContainer">
                <GenericTable<InventoryItem>
                    data={inventoryItems}
                    columns={inventoryColumns}
                />
              </div>
              <div><button className="drinkPropButton" onClick={()=>setShowSalesReport(false)}>Back</button></div>
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
          <button onClick={HandleRestockReport}>Restock Report</button>
          <button onClick={HandlePairProduct}>Pair Product</button>
          <button onClick={HandleAddInventory}>Add Inventory</button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
