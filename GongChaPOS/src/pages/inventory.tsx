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

interface InventoryFormDataType {
  inventoryName: string;
  quantity: number;
  receivedDate: string;
  expirationDate: string;
  inStock: boolean;
  supplier: string;
}

interface PairedProduct {
  item1: string;
  item2: string;
  frequency: number;
}

const pairedProductColumns: { key: keyof PairedProduct; header: string }[] = [
  { key: "item1", header: "Item 1" },
  { key: "item2", header: "Item 2" },
  { key: "frequency", header: "Frequency" }
];

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isNewItem, setIsNewItem] = useState<boolean>(true);
  const [salesData, setSalesData] = useState([]);
  const [filteredInventoryItems, setFilteredInventoryItems] = useState<InventoryItem[]>([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10));
  
  const [endDate, setEndDate] = useState(new Date().toISOString().substring(0, 10));
  const [showSalesReport, setShowSalesReport] = useState(() => {
    const saved = sessionStorage.getItem("showSalesReport");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [showExcessReport, setShowExcessReport] = useState(() => {
    const saved = sessionStorage.getItem("showExcessReport");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [showRestockReport, setShowRestockReport] = useState(() => {
    const saved = sessionStorage.getItem("showRestockReport");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [showPairProducts, setShowPairProducts] = useState(() => {
    const saved = sessionStorage.getItem("showPairProducts");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });
  const [showAddInventory, setShowAddInventory] = useState(() => {
    const saved = sessionStorage.getItem("showAddInventory");
    return saved === "true"; // If saved is the string 'true', return true, otherwise return false
  });

  const [inventoryFormData, setInventoryFormData] = useState<InventoryFormDataType>({
    inventoryName: '',
    quantity: 0,
    receivedDate: new Date().toISOString().substring(0, 10), // Defaults to current date
    expirationDate: '', // No default value, assuming this needs to be input by the user
    inStock: true, // Default value set to true
    supplier: ''
  });

  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10)
  });
  const [pairedProducts, setPairedProducts] = useState<PairedProduct[]>([]);
  const [targetDate, setTargetDate] = useState('');
  
  const [excessReportData, setExcessReportData] = useState<InventoryItem[]>([]);

  
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
  useEffect(() => {
    sessionStorage.setItem("showAddInventory", showAddInventory.toString());
  }, [showAddInventory]);
  useEffect(() => {
    sessionStorage.setItem("showPairProducts", showPairProducts.toString());
  }, [showPairProducts]);
  useEffect(() => {
    sessionStorage.setItem("showExcessReport", showExcessReport.toString());
  }, [showExcessReport]);

  const handleTargetDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedDate = new Date(e.target.value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to start of the day

  let correctedDate = selectedDate;

  if (selectedDate > currentDate) {
    alert("Target date must not be in the future.");
    correctedDate = currentDate; // Set to current date
    e.target.value = currentDate.toISOString().split('T')[0]; // Update the GUI element directly
  }

  setTargetDate(correctedDate.toISOString().split('T')[0]); // Update state to trigger re-render
  fetchExcessReportData(correctedDate.toISOString().split('T')[0]); // Pass the corrected date directly
};

const fetchExcessReportData = async (date: string) => {
  try {
    const response = await axios.get('http://localhost:9000/excessReport', {
      params: { targetDate: date }
    });
    let data = response.data;
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
    console.log(data);
    setExcessReportData(data);
  } catch (error) {
    console.error("Error fetching excess report:", error);
  }
};


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
    const outOfStockItems = data.filter((item:any) => !item.inventoryinstock);
    
    
    setFilteredInventoryItems(outOfStockItems); // Update the state with filtered items
    setShowRestockReport(true);

  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDates(prevDates => {
      const newDates = { ...prevDates, [name]: value };
      const startDate = new Date(newDates.startDate);
      const endDate = new Date(newDates.endDate);
      const currentDate = new Date();

      if (startDate > endDate) {
        alert("Start date must be before the end date.");
        return { ...newDates, startDate: newDates.endDate }; // Update startDate to endDate
      } else if (endDate > currentDate) {
        alert("End date must be before the current date.");
        return { ...newDates, endDate: currentDate.toISOString().substring(0, 10) }; // Reset endDate to today
      } else {
        fetchPairedProducts(newDates.startDate, newDates.endDate);
      }

      return newDates;
    });
  };


  const fetchPairedProducts = async (startDate: string, endDate: string) => {
    try {
      console.log(startDate, endDate);
      const response = await axios.get('http://localhost:9000/pairProducts', {
        params: { startDate, endDate }
      });
      if (response.data) {
        setPairedProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching paired products:", error);
    }
  };


  const fetchInventoryItemDetails = async (itemName: string) => {
    try {
      const response = await axios.get(`http://localhost:9000/inventory/${itemName}`);
  
      if (response.data) {
        const itemDetails = response.data;
  
        setInventoryFormData({
          inventoryName: itemDetails.inventoryname || itemName,
          quantity: itemDetails.inventoryquantity || 0,
          receivedDate: itemDetails.inventoryreceiveddate 
                          ? itemDetails.inventoryreceiveddate.substring(0, 10) 
                          : new Date().toISOString().substring(0, 10),
          expirationDate: itemDetails.inventoryexpirationdate 
                           ? itemDetails.inventoryexpirationdate.substring(0, 10) 
                           : '',
          inStock: itemDetails.hasOwnProperty('inventoryinstock') 
                   ? itemDetails.inventoryinstock 
                   : true,
          supplier: itemDetails.inventorysupplier || ''
        });
      } else {
        // Handle the case where the item is not found
        setInventoryFormData({
          inventoryName: itemName,
          quantity: 0,
          receivedDate: new Date().toISOString().substring(0, 10),
          expirationDate: '',
          inStock: true,
          supplier: ''
        });
      }
    } catch (error) {
      console.error("Error fetching inventory item details:", error);
      // Reset form data if there is an error fetching details
      setInventoryFormData({
        inventoryName: itemName,
        quantity: 0,
        receivedDate: new Date().toISOString().substring(0, 10),
        expirationDate: '',
        inStock: true,
        supplier: ''
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    isAutoComplete?: boolean
  ) => {
    let name: string;
    let value: string | boolean;
  
    if (isAutoComplete) {
      // For AutoCompleteCustom component
      name = "inventoryName"; // Assuming this is the field using autocomplete
      value = e as string;
      const isExistingItem = inventoryItems.some(item => item.inventoryname === value);
      setIsNewItem(!isExistingItem);

      if (isExistingItem) {
        fetchInventoryItemDetails(value);
      } else {
        // Reset form data for a new item
        setInventoryFormData(prevState => ({
          ...prevState,
          [name]: value,
          quantity: 0,
          receivedDate: new Date().toISOString().substring(0, 10),
          expirationDate: '',
          inStock: true,
          supplier: ''
        }));
      }
    } else {
      // For regular inputs
      name = (e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>).target.name;
      value = (e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>).target.value;
  
      // Check for 'inStock' select field to convert to boolean
      if ((e as React.ChangeEvent<HTMLSelectElement>).target instanceof HTMLSelectElement && name === "inStock") {
        value = value === 'true';
      }

      // Additional validation for expiration date
      if (name === "expirationDate") {
        const currentDate = new Date().toISOString().substring(0, 10);
        if (new Date(value as string) < new Date(currentDate)) {
          alert("Expiration date must be after the current date.");
          value = currentDate; // Reset to today's date
          return; // Prevent updating the state
        }
      }
    }
    setInventoryFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectAutocomplete = (value: string) => {
    const isExistingItem = inventoryItems.some(item => item.inventoryname === value);
    setIsNewItem(!isExistingItem);
  };
  

  const handleAddInventory = async () => {
    const endpoint = isNewItem ? 'http://localhost:9000/inventory' : `http://localhost:9000/inventory/${inventoryFormData.inventoryName}`;
    const method = isNewItem ? 'post' : 'put';
    console.log(endpoint);
    console.log(method);
    try {
      const response = await axios[method](endpoint, inventoryFormData);
      console.log(response.data); // Handle the response
      handleAddInventoryBack();
    } catch (error) {
      console.error("Error handling inventory:", error);
    }

    
  };

  const handleAddInventoryBack = () => {  

    setShowAddInventory(false);
    setInventoryFormData({
      inventoryName: '',
      quantity: 0,
      receivedDate: new Date().toISOString().substring(0, 10), // Defaults to current date
      expirationDate: '', // No default value, assuming this needs to be input by the user
      inStock: true, // Default value set to true
      supplier: ''
    });

  };
  

  

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
        {showAddInventory && ( // add inventory popup
          <>
            <div className="overlay"></div>
            <div className="smallPopup d-flex flex-column">
              <div className="addInventoryRow m-1">
                <span>Item Name:</span>
                <span><AutoCompleteCustom data={inventoryItems.map((item) => item.inventoryname)} label="Item Name" handleChange={(value) => handleInputChange(value, true)} onSelectItem={handleSelectAutocomplete} freeSolo={true} required={true} /></span>
              </div>
              <div className="addInventoryRow m-1">
                <span>Quantity:</span>
                <span><input type="number" name="quantity" className="addInventoryInput" onChange={handleInputChange} value={inventoryFormData.quantity} min="0" step="1"  /></span>
              </div>
              <div className="addInventoryRow m-1">
                <span>Date Received:</span>
                <span ><input type="date" name="receivedDate" className="addInventoryInput" onChange={handleInputChange} value={inventoryFormData.receivedDate} /></span>
              </div>
              <div className="addInventoryRow m-1">
                <span>Exp. Date:</span>
                <span><input type="date" name="expirationDate" className="addInventoryInput" onChange={handleInputChange} value={inventoryFormData.expirationDate} /></span>
              </div>
              <div className="addInventoryRow m-1">
                <span>In Stock</span>
                <span><select
                      required
                      className="addMenuInput p-1"
                      name="inStock"
                      onChange={handleInputChange}
                      value={inventoryFormData.inStock ? 'true' : 'false'}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select></span>
              </div>
              <div className="addInventoryRow m-1">
                <span>Supplier:</span>
                <span><input type="text" name="supplier" className="addInventoryInput" onChange={handleInputChange} value={inventoryFormData.supplier} ></input></span>
              </div>
              <div className="bottomOverlay">
              <button className="addInventoryButton" onClick={handleAddInventoryBack}>Back</button>
                <button className="addInventoryButton" onClick={handleAddInventory}>Submit</button>
              </div>
            </div>
          </>
        )}
        {showPairProducts && ( // pair products popup
          <>
            <div className="overlay"></div>
            <div className="Popup d-flex flex-column">
              <div className="pairRow">
                <span className="pairCol">
                  Start Date:
                  <input type="date" className="addInventoryInput" onChange={handleDateChange} name="startDate"  value={dates.startDate}  />
                </span>
                <span className="pairCol">
                  End Date:
                  <input type="date" className="addInventoryInput" onChange={handleDateChange} name="endDate" value={dates.endDate}  />
                </span>
              </div>
              <GenericTable<PairedProduct>
                data={pairedProducts}
                columns={pairedProductColumns}
                />
              <div className="bottomOverlay"><button className="drinkPropButton" onClick={() => setShowPairProducts(false)}>Back</button></div>
            </div>
          </>
        )}
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
        {showExcessReport && ( // Excess Report products popup
          <>
            <div className="overlay"></div>
            <div className="Popup d-flex flex-column">
              <div className="excessRow">
                <span className="excessCol">
                  Target Date:
                  <input type="date" className="addInventoryInput" onChange={handleTargetDateChange} name="targetDate"  value={targetDate}  />
                </span>
              </div>
              <GenericTable<InventoryItem>
                data={excessReportData}
                columns={inventoryColumns}
                />
              <div className="bottomOverlay"><button className="drinkPropButton" onClick={() => setShowExcessReport(false)}>Back</button></div>
            </div>
          </>
        )}
        {showSalesReport && ( // sales report popup
          <>
            <div className="overlay"></div>
            <div className="Popup d-flex flex-column">
              <div className="salesInputRow">
                <AutoCompleteCustom data={menuItems} label="Menu Item" handleChange={handleMenuItemSelect} />
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
          <button onClick={() => setShowExcessReport(true)}>Excess Report</button>
          <button onClick={handleRestockReport}>Restock Report</button>
          <button onClick={() => setShowPairProducts(true)}>Pair Product</button>
          <button onClick={() => setShowAddInventory(true)}>Add/Update</button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
