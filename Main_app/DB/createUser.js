import pool from "./db.js";

const createUser = async (data) => {
    let id = Date.now();
    const query = `
        INSERT INTO customer (title_code, title_name, owner_name, state_name, publication_city, periodity)
        VALUES ($1, $2, $3, $4, $5, $6);
    `;
    // eslint-disable-next-line no-unused-vars
    const result = await pool.query(query, [
        id,
        data.newsTitle,
        data.username,
        data.state,
        data.city,
        data.periodicity,
    ]);

    return `data inserted with ${id}`;
};

export default createUser;
