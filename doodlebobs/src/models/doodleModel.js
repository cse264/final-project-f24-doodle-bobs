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

// Create a new doodle
async function createDoodle(title, imgurLink) {
    const query = `
        INSERT INTO Doodle (title, imgur_link, created_at)
        VALUES ($1, $2, NOW())
        RETURNING *;
    `;
    const values = [title, imgurLink];
    try {
        const result = await db.query(query, values);
        return result.rows[0]; // Return the created doodle
    } catch (error) {
        console.error('Error creating doodle:', error);
        throw error;
    }
}

// Delete a doodle by ID
async function deleteDoodleById(id) {
    const query = `DELETE FROM Doodle WHERE doodle_id = $1;`;
    try {
        const result = await db.query(query, [id]);
        return result.rowCount > 0; // Return true if a row was deleted
    } catch (error) {
        console.error('Error deleting doodle:', error);
        throw error;
    }
}

module.exports = {
    getAllDoodles,
    createDoodle,
    deleteDoodleById,
};
