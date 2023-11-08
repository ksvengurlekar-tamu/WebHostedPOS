import express, { Router } from 'express';
import cors from 'cors';
import { db } from './server.ts';


const app = express();
const port = 9000;  // You can choose any port that's not in use
const router = Router();

app.use(cors()); // Allow CORS for all routes
app.use('/server', router); // Use the router for routes prefixed with /server, this is the root of the server API


app.get('/server', (_req, res) => {
  res.send('Hello from Express!');
});

app.get('/server/employees', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


// menu items

app.get('/server/menuitems', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item data' });
  }
});

app.get('/server/menuitems/milktea', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = Milk Tea');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item milk tea data' });
  }
});

app.get('/server/menuitems/milkfoam', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = Milk Foam');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item milk foam data' });
  }
});

app.get('/server/menuitems/slush', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = Slush');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item slush data' });
  }
});

app.get('/server/menuitems/seasonal', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = Seasonal');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item seasonal data' });
  }
});

app.get('/server/menuitems/coffee', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = Coffee');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item coffee data' });
  }
});

app.get('/server/menuitems/tealatte', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = Tea Latte');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item tea latte data' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/server`);
});
