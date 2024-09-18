import pool from "./db.js";

const getAllRows = async () => {
    const result = await pool.query("SELECT * FROM customer");
    return result.rowCount;
};

export default getAllRows;
