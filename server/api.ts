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


app.get('/server/menuitems/:series', async (req, res) => {
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = $1', [req.params.series]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item tea latte data' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/server`);
});
