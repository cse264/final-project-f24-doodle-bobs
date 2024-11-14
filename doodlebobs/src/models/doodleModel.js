// src/models/doodleModel.js

const db = require('../lib/db'); // Importing database connection

async function getAllDoodles() {
    const query = `SELECT * FROM Doodle ORDER BY created_at DESC;`; //newest doodles come first
    try {
        const result = await db.query(query);
        return result.rows; // Return all doodles
    } catch (error) {
        console.error('Error fetching doodles:', error);
        throw error;
    }
}

module.exports = {
    getAllDoodles,
};
