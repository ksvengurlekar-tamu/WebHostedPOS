import express, { Router } from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 9000;  // You can choose any port that's not in use
const router = Router();

app.use(cors()); // Allow CORS for all routes
app.use('/server', router); // Use the router for routes prefixed with /server, this is the root of the server API


const pool = new Pool({
  user: 'csce331_900_eanazir',
  password: 'Mollyadydo123$',
  host: 'csce-315-db.engr.tamu.edu',
  port: 5432,
  database: 'csce315331_00g_db'
});

app.get('/server', (_req, res) => {
  res.send('Hello from Express!');
});

app.get('/server/employees', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/server`);
});
