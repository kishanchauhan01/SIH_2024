import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "1707",
    port: 5432, // Default PostgreSQL port
});

export default pool;
