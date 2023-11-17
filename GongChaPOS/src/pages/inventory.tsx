import LeftNavBar from "../components/leftnavbar";
import TopBar from "../components/topBar";
import "../components/components.css";
import  { useEffect, useState } from "react";
import axios from 'axios';
import GenericTable from "../components/genericTable";

interface InventoryItem {
  inventoryid: number;
  inventoryname: string;
  inventoryquantity: number;
  inventoryreceiveddate: string;
  inventoryexpirationdate: string;
  inventoryinstock: boolean;
  inventorysupplier: string;
}
const inventoryColumns:{ key: keyof InventoryItem, header: string }[] = [
  { key: 'inventoryid', header: 'ID' },
  { key: 'inventoryname', header: 'Name' },
  { key: 'inventoryquantity', header: 'Quantity' },
  { key: 'inventoryreceiveddate', header: 'Received' },
  { key: 'inventoryexpirationdate', header: 'Expiry' },
  { key: 'inventoryinstock', header: 'In Stock' },
  { key: 'inventorysupplier', header: 'Supplier' },
];

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch("http://localhost:9000/inventory");
        let data = await response.json();
        data = [...data].sort((a, b) => a.inventoryid - b.inventoryid);
        data = data.map((item: InventoryItem) => ({
          ...item,
          inventoryreceiveddate: item.inventoryreceiveddate.substring(0, 10),
          inventoryexpirationdate: item.inventoryexpirationdate.substring(0, 10),
          inventoryinstock: item.inventoryinstock ? 'Yes' : 'No'
        }));
        console.log(data.inventoryexpirationdate);
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

        <GenericTable<InventoryItem> data={inventoryItems} columns={inventoryColumns} />

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