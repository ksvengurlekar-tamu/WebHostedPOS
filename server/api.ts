import express, { Router } from 'express';
import cors from 'cors';
import { db } from './server.ts';


const app = express();
const port = 9000;  // You can choose any port that's not in use
const router = Router();

app.use(cors()); // Allow CORS for all routes
app.use('/', router); // Use the router for routes prefixed with /, this is the root of the server API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


interface Ingredient {
  name: string;
  measurement: number;
}

interface DrinkRequest {
  drinkName: string;
  drinkPrice: string;  // Assuming these are strings based on your log
  drinkCalories: string;
  drinkCategory: string;
  hasCaffeine: boolean;
  ingredients: Ingredient[];
}



app.get('/', (_req, res) => {
  res.send('Hello from Express!');
});

//employees

app.get('/employees', async (_req, res) => { // To get all employee info
  try {
    const result = await db('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



// menu items

app.get('/menuitems', async (_req, res) => { // To get all menu items
  try {
    const result = await db('SELECT * FROM menuitems');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item data' });
  }
});

app.get('/menuitems/:menuitemname', async (req, res) => { // To get a specific menu item
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemname = $1', [req.params.menuitemname]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});


app.get('/category/:series', async (req, res) => { // To get all menu items in a specific category
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = $1', [req.params.series]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch series data' });
  }
});



// Sales

app.get('/sales', async (req, res) => { // To get all sales
  try {
    const result = await db('SELECT * FROM sales');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

app.get('/salesReport', async (req, res) => {
  const { menuItem, startDate, endDate } = req.query as {
    menuItem: string;
    startDate: string;
    endDate: string;
  };
  
  // Ensure all required parameters are provided
  if (!menuItem || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  const menuItemId = await getMenuItemID(menuItem);

  // console.log(startDate, endDate, menuItemId);

  try {
    const query = `
      SELECT * FROM sales 
      WHERE menuitemid = $1 
      AND saledate BETWEEN $2 AND $3
    `;
    const result = await db(query, [menuItemId, startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post('/sales', async (req, res) => { // To add a sale into the database (with auto-incremented orderID) ))
  try {
    let newOrderId; // INCREMENT ORDER ID
    let newOrderNo; // stay static
    const currentDate = new Date();
  
    // Format the date as YYYY-MM-DD in local timezone
    const formattedDate = currentDate.getFullYear() + '-' + 
                          (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                          currentDate.getDate().toString().padStart(2, '0');

    // Format the time as HH:MI:SS in local timezone
    const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ':' + 
                          currentDate.getMinutes().toString().padStart(2, '0') + ':' + 
                          currentDate.getSeconds().toString().padStart(2, '0');

    const result = await db('SELECT MAX(orderid) as maxorderid, MAX(orderno) as maxorderno FROM sales');
    if (result.rows[0]) {
      newOrderId = result.rows[0].maxorderid + 1;
      newOrderNo = result.rows[0].maxorderno + 1;
      console.log("newOrderId: " + newOrderId);
      console.log("newOrderNo: " + newOrderNo);
    } else {
      newOrderId = -1;
      newOrderNo = -1;
    }

    const { employeeId, drinks } = req.body;
    let employeeIdInt = parseInt(employeeId);
    
    for (const drink of drinks) {
      // add to sales
      await db('INSERT INTO sales (orderid, orderno, saledate, saletime, employeeid, saleprice, islarge, menuitemid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [newOrderId, newOrderNo, formattedDate, formattedTime, employeeIdInt, drink.quantity * drink.price, drink.size === "Large", drink.id]);


      // find corresponding ingredients and their respective quantities
      const measurementSet = await db('SELECT * FROM menuItems_inventory WHERE menuitemid = $1', [drink.id]);

      for (const mr of measurementSet.rows) {
        var quantity = mr.measurement;
        var id = mr.inventoryid;

        if(drink.size === "Large"){
          quantity = quantity * 1.5;
        }
        
        await db('UPDATE inventory SET inventoryquantity = inventoryquantity - $1 WHERE inventoryid = $2', [parseInt(quantity), id]);

        
        // check if stock is exceeded
        const inventoryCheckSet = await db('SELECT inventoryQuantity FROM inventory WHERE inventoryid = $1', [id]);
        var remaining = inventoryCheckSet.rows[0].inventoryquantity;
        //console.log(remaining)
        
        // should just be 1 value: SELECT inventoryQuantity
        if (remaining <= 50) {
          await db('UPDATE inventory SET inventoryinstock = $1 WHERE inventoryid = $2', [false, id]);
        }

        if (remaining <= 11) {
          // Retrieve all menu items that use this inventory item
          const menuItemsUsingInventory = await db('SELECT menuitemid FROM menuItems_inventory WHERE inventoryid = $1', [id]);

          for (const menuItem of menuItemsUsingInventory.rows) {
            // Set each menu item to not in stock
            await db('UPDATE menuitems SET menuiteminstock = $1 WHERE menuitemid = $2', [false, menuItem.menuitemid]);
          }
        }
      }
  
       newOrderId++;
    }


    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    
    console.log("THE SQL NO WORK BUT AT THIS LINE");
  }
});


//inventory
app.get('/inventory', async (_req, res) => { 
  try {
    const result = await db('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory data' });
  }
});

app.post('/inventory', async (req, res) => { // add inventory
  try {
    const { inventoryName, quantity, receivedDate, expirationDate, inStock, supplier } = req.body;
    const maxIdResult = await db('SELECT MAX(inventoryid) as maxid FROM inventory');
    const inventoryId = maxIdResult.rows[0].maxid + 1;
    // Add a query to insert a new inventory item
    const query = 'INSERT INTO inventory (inventoryid, inventoryname, inventoryquantity, inventoryreceiveddate, inventoryexpirationdate, inventoryinstock, inventorysupplier) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [inventoryId, inventoryName, quantity, receivedDate, expirationDate, inStock, supplier];

    await db(query, values);

    res.status(201).json({ message: 'Inventory item created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create new inventory item' });
    console.log(error);
  }
});

app.put('/inventory/:inventoryName', async (req, res) => { //upadate inventory
  try {
    const inventoryName = req.params.inventoryName;
    const { quantity, receivedDate, expirationDate, inStock, supplier } = req.body;

    // Add a query to update the inventory item
    const query = 'UPDATE inventory SET inventoryquantity = $1, inventoryreceiveddate = $2, inventoryexpirationdate = $3, inventoryinstock = $4, inventorysupplier = $5 WHERE inventoryname = $6';
    const values = [quantity, receivedDate, expirationDate, inStock, supplier, inventoryName];

    const result = await db(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

app.get('/inventory/:itemName', async (req, res) => { 
  const itemName = req.params.itemName;

  try {
    const query = 'SELECT * FROM inventory WHERE inventoryname = $1';
    const result = await db(query, [itemName]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); 
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory data' });
    console.log(error);
  }
});

//addOrUpdateDrink
app.post('/addOrUpdateDrink', async (req, res) => {
  const { drinkName, drinkPrice, drinkCalories, drinkCategory, hasCaffeine, ingredients }: DrinkRequest = req.body;

 
  const price = parseFloat(drinkPrice);
  const calories = parseInt(drinkCalories);

  try {
      // Check if the drink exists
      const checkQuery = 'SELECT menuitemid FROM menuItems WHERE menuItemName = $1';
      const existingDrink = await db(checkQuery, [drinkName]);
      let menuItemID

      if (existingDrink.rows.length > 0) {
          // Drink exists, update it
          menuItemID = existingDrink.rows[0].menuitemid;
          const updateQuery = 'UPDATE menuItems SET menuItemPrice = $1, menuItemCalories = $2, hasCaffeine = $3 WHERE menuItemID = $4';
          await db(updateQuery, [drinkPrice, drinkCalories, hasCaffeine, menuItemID]);
      } else {
          // Drink does not exist, insert it

          const randomColor = getRandomColor();
          const maxIdResult = await db('SELECT MAX(menuitemid) as maxid FROM menuitems');
          menuItemID =  maxIdResult.rows[0].maxid + 1; 
          const insertQuery = 'INSERT INTO menuItems (menuItemID, menuItemName, menuItemPrice, menuItemCalories, menuItemCategory, hasCaffeine, color) VALUES ($1, $2, $3, $4, $5, $6, $7)';
          await db(insertQuery, [menuItemID, drinkName, drinkPrice, drinkCalories, drinkCategory, hasCaffeine, randomColor]);
      }

      // Update ingredients in the junction table
      for (const ingredient of ingredients) {
          /// Assuming getInventoryID is a function that returns the inventoryID for a given ingredient name
          const inventoryID = await getInventoryID(ingredient.name);
          const ingredientUpdateQuery = 'INSERT INTO menuItems_Inventory (menuItemID, inventoryID, measurement) VALUES ($1, $2, $3) ON CONFLICT (menuItemID, inventoryID) DO UPDATE SET measurement = $4';
          await db(ingredientUpdateQuery, [menuItemID, inventoryID, ingredient.measurement, ingredient.measurement]);
      }

  } catch (error) {
      console.error(error);
  }
});

async function getInventoryID(inventoryName: string): Promise<number> {
  const query = 'SELECT inventoryid FROM Inventory WHERE inventoryname = $1';
  const results = await db(query, [inventoryName]);
  return results.rows.length > 0 ? results.rows[0].inventoryid : null;
}

async function getMenuItemID(menuItemName: string): Promise<number> {
  const query = 'SELECT menuItemid FROM menuItems WHERE menuitemname = $1';
  const results = await db(query, [menuItemName]);
  return results.rows.length > 0 ? results.rows[0].menuitemid : null;
}

function getRandomColor(): string {
  // Generate a random hexadecimal color
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});