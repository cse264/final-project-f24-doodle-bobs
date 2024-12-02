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

// Get all doodles made by a specific user
async function getAllDoodlesMadeSpecific(userName) {
    const query = `
        SELECT Doodle.*
        FROM Doodle
        INNER JOIN Users ON Doodle.user_id = Users.user_id
        WHERE Users.username = $1
        ORDER BY Doodle.created_at DESC; -- Newest doodles come first
    `;
    try {
        const result = await db.query(query, [userName]);
        return result.rows; // Return all doodles
    } catch (error) {
        console.error('Error fetching doodles:', error);
        throw error;
    }
}

// Create a new doodle with user ID
async function createDoodle(title, imgurLink, userId) {
    const query = `
        INSERT INTO Doodle (title, imgur_link, user_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
    `;
    const values = [title, imgurLink, userId];
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

// Create a new login (user account)

async function signup(userName, password) {
    const query = `
        INSERT INTO Users (username, password)
        VALUES ($1, $2)
        RETURNING *;
    `;
    try {
        const result = await db.query(query, [userName, password]);
        return result.rows[0]; // Return the newly created user
    } catch (error) {
        console.error('Error creating new user:', error);
        throw error;
    }
} 

//log back in
// Log in an existing user
async function login(userName, password) {
    const query = `SELECT * FROM Users WHERE username = $1 AND password = $2;`; // Match username and password directly
    try {
        const result = await db.query(query, [userName, password]);
        const user = result.rows[0];

        if (user) {
            return user; // Return user details if login is successful
        } else {
            throw new Error('Invalid username or password'); // Either username or password doesn't match
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

module.exports = {
    getAllDoodles,
    createDoodle,
    deleteDoodleById,
    login,
    signup,
    getAllDoodlesMadeSpecific,
};
