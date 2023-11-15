import express, { Router } from 'express';
import cors from 'cors';
import { db } from './server.ts';


const app = express();
const port = 9000;  // You can choose any port that's not in use
const router = Router();

app.use(cors()); // Allow CORS for all routes
app.use('/', router); // Use the router for routes prefixed with /, this is the root of the server API


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

app.get('/sales/nextid', async (req, res) => { // To the latest sale: orderID and orderNo for the next sale
  try {
    const result = await db('SELECT * FROM sales WHERE orderID = (SELECT MAX(orderID) FROM sales)');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// app.post('/sales', async (req, res) => { // To add a sale into the database
//   try {
//     const { orderid, orderno, saledate, saletime, employeeid, salesprice, islarge, menuitemid } = req.body;
//     await db('INSERT INTO sales (orderid, orderno, saledate, saletime, employeeid, salesprice, islarge, menuitemid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
//       [orderid, orderno, saledate, saletime, employeeid, salesprice, islarge, menuitemid]);

//     res.json({ success: true, message: 'Data inserted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to insert into sales' });
//   }
// });

app.post('/sales/insert', async (req, res) => { // To add a sale into the database (with auto-incremented orderID) ))
  try {
    let newOrderId; // INCREMENT ORDER ID
    let newOrderNo; // stay static

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

    const { currentDate, currentTime, employeeId, drinks } = req.body;
    console.log(employeeId);

    for (const drink of drinks) {
      await db('INSERT INTO sales (orderid, orderno, saledate, saletime, employeeid, salesprice, islarge, menuitemid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [newOrderId, newOrderNo, currentDate, currentTime, employeeId, drink.quantity * drink.price, drink.size === "Large", drink.id]);
      newOrderId++;

      for (const topping of drink.toppings) {
        await db('INSERT INTO sales (orderid, orderno, saledate, saletime, employeeid, salesprice, islarge, menuitemid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [newOrderId, newOrderNo, currentDate, currentTime, employeeId, drink.quantity * topping.price, false, topping.id]);
        newOrderId++;
      }
    }

    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to insert into sales' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});