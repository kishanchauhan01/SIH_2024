import pool from "./db.js";

const isExist = async (title) => {
    const query = `SELECT title_name FROM customer WHERE title_name = $1`;
    const result = await pool.query(query, [title]);
    if (result.rowCount > 0) {
        return {
            message: `${result.rows[0].title_name} is already exist`,
            found: true,
        };
    } else {
        return {
            message: "not found",
            found: false,
        };
    }
};

export default isExist;
