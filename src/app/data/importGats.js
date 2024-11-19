const { Pool } = require('pg');
const fs = require('fs');

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'elghali',
    host: 'localhost',
    database: 'wine_dine',
    password: 'M3nt0s@Work',
    port: 5432, // Default PostgreSQL port
});

// Load the JSON file
const data = JSON.parse(fs.readFileSync('gats.json', 'utf8'));

// Insert data into gin_and_tonics table
async function importGinAndTonics() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction
        for (const item of data.gin_and_tonic) {
            const { name, description, price } = item;
            await client.query(
                `INSERT INTO gin_and_tonics (name, description, price)
                 VALUES ($1, $2, $3)`,
                [name, description, price]
            );
        }
        await client.query('COMMIT'); // Commit transaction
        console.log('Gin and Tonics imported successfully!');
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error importing Gin and Tonics:', error.message);
    } finally {
        client.release();
    }
}

// Insert data into spritzes table
async function importSpritzes() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction
        for (const item of data.spritz) {
            const { name, description, price } = item;
            await client.query(
                `INSERT INTO spritzes (name, description, price)
                 VALUES ($1, $2, $3)`,
                [name, description, price]
            );
        }
        await client.query('COMMIT'); // Commit transaction
        console.log('Spritzes imported successfully!');
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error importing Spritzes:', error.message);
    } finally {
        client.release();
    }
}

// Run the import functions
async function importData() {
    await importGinAndTonics();
    await importSpritzes();
    pool.end();
}

importData().catch((error) => {
    console.error('Unexpected error:', error.message);
    pool.end();
});