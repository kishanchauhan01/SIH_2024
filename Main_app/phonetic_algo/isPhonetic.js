import pool from "../DB/db.js";
import phoneticCode from "./test.js";

const isPhonetic = async (title) => {
    try {
        // Get phonetic code using Python function
        const phonetic_code = await phoneticCode(title);

        // SQL query for searchin phonetic code
        const query = `
            SELECT * FROM customer WHERE phonetic_code = $1;
        `;

        const response = await pool.query(query, [phonetic_code]);
        console.log(phonetic_code);
        // if the rows is > 0 then there is same phonetic code inside DB
        if (response.rows.length > 0) {
            console.log(response.rows[0].title_name);
            return {
                message: `There is similar sounding data and that is ${response.rows[0].title_name}`,
                found: true
            };
        } else {
            return {
                message: `There is no similar sounding data`,
                found: false
            }
        }
    } catch (err) {
        // log the err
        console.error("Error in title processing:", err);
        throw new Error(`Error during phonetic title search: ${err.message}`);
    }
};

export default isPhonetic;
