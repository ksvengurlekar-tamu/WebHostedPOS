import LeftNavBar from "../components/leftnavbar";
import TopBar from "../components/topBar";
import "../components/components.css";
import  { useEffect, useState } from "react";
import axios from 'axios';

interface InventoryItem {
  inventoryid: number;
  inventoryname: string;
  inventoryquantity: number;
  inventoryreceiveddate: string;
  inventoryexpirationdate: string;
  inventoryinstock: boolean;
  inventorysupplier: string;
}

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch("http://localhost:9000/inventory");
        let data = await response.json();
        data = [...data].sort((a, b) => a.inventoryid - b.inventoryid);
        setInventoryItems(data);
      } catch (error) {
        console.error("Failed to fetch inventory items:", error);
      }
    };

    fetchInventoryItems();
  }, []);

  const HandleSalesReport = () => {};

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

        {/* We should try to make this a component, with header and data props */}
        <div className="inventoryContainer">
          <table className="inventoryTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Received</th>
                <th>Expiry</th>
                <th>In Stock</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.inventoryid}>
                  <td>{item.inventoryid}</td>
                  <td>{item.inventoryname}</td>
                  <td>{item.inventoryquantity}</td>
                  <td>{item.inventoryreceiveddate.substring(0,10)}</td>
                  <td>{item.inventoryexpirationdate.substring(0,10)}</td>
                  <td>{item.inventoryinstock ? 'Yes' : 'No'}</td>
                  <td>{item.inventorysupplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* component Done */}

        <div className="bottomNavBar">
          <button onClick={HandleSalesReport}>Sales Report</button>
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