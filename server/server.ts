import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'csce331_900_ksvengurlekar',
    password: 'mVZymhEx+.=:vwPX3L#7',
    host: 'csce-315-db.engr.tamu.edu',
    port: 5432, // default Postgres port
    database: 'csce315331_00g_db'
});

/**
 * Execute a SQL query on the database.
 * @param {string} text - The SQL query string.
 * @param {any[]} params - Optional parameters for the SQL query.
 * @returns {Promise<pg.QueryResult>} - A promise that resolves to the query result.
 */
export const db = (text: string, params?: any[]) => pool.query(text, params);
