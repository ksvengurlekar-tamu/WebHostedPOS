import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'csce331_900_ksvengurlekar',
    password: 'mVZymhEx+.=:vwPX3L#7',
    host: 'csce-315-db.engr.tamu.edu',
    port: 5432, // default Postgres port
    database: 'csce315331_00g_db'
});

export const db = (text: string, params?: any[]) => pool.query(text, params);