import pool from "./db.js";

const isExist = async (title) => {
    console.log(title.toUpperCase());
    const query = `SELECT * FROM customer WHERE title_name = $1`;
    //for the as it is title from user
    let result = await pool.query(query, [title]);
    //for the uppercase check
    const upperCaseTitle = title.toUpperCase();
    const result1 = await pool.query(query, [upperCaseTitle]);

    if (result.rowCount > 0 || result1.rowCount > 0) {
        return {
            message: `${title} is already exist`,
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
