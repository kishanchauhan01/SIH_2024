import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "kishan",
    port: 5432, // Default PostgreSQL port
});

export default pool;
