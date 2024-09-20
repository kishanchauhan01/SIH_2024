import pool from "../DB/db.js";
import phoneticCode from "./test.js";
import getAllRows from "../DB/getAllRows.js";

const isPhonetic = async (title) => {
    try {
        // Get phonetic code using Python function
        const phonetic_code = await phoneticCode(title);

        // SQL query for searchin phonetic code
        const query = `
            SELECT * FROM customer WHERE phonetic_code = $1;
        `;

        const response = await pool.query(query, [phonetic_code]);
        // console.log(response.rows.phonetic_code);
        const totalRows = await getAllRows();
        const currenRows = response.rowCount;
        const similarSoundingProb = parseFloat(
            ((currenRows / totalRows) * 100).toFixed(2)
        );

        // if the rows is > 0 then there is same phonetic code inside DB
        console.log(similarSoundingProb);
        console.log(response.rowCount);
        if (response.rowCount > 0) {
            return {
                message: ` ${response.rows[0].title_name}`,
                prob: similarSoundingProb,
            };
        } else {
            return {
                message: `not found`,
                prob: similarSoundingProb,
            };
        }
    } catch (err) {
        // log the err
        console.error("Error in title processing:", err);
        throw new Error(`Error during phonetic title search: ${err.message}`);
    }
};

export default isPhonetic;
