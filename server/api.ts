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

// app.get('/sales/nextid', async (req, res) => { // To the latest sale: orderID and orderNo for the next sale
//   try {
//     const result = await db('SELECT * FROM sales WHERE orderID = (SELECT MAX(orderID) FROM sales)');
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch sales data' });
//   }
// });

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



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});