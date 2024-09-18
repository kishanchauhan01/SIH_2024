import pool from "../DB/db.js";

const isDisallowed = async (title) => {
    try {
        //SQL query for finding the disallowed words
        const query = `
            SELECT disallowed_words
            FROM disallowed
            WHERE disallowed_words = ANY(string_to_array($1, ' '));
        `;

        const capilatTitle = title.toUpperCase();

        const result = await pool.query(query, [capilatTitle]);

        const disallowedWords = result.rows;
        console.log(disallowedWords);
        if (disallowedWords.length > 0) {
            return {
                message: `${disallowedWords
                    .map((row) => row.disallowed_words)
                    .join(", ")} is a disallowed word please try something else`,
                found: true,
            };
        } else {
            return {
                message: "No disallowed words found in title",
                found: false,
            };
        }
    } catch (err) {
        console.error("Error checking disallowed words:", err);
        throw new Error(`Error during disallowed words check: ${err.message}`);
    }
};

export default isDisallowed;
