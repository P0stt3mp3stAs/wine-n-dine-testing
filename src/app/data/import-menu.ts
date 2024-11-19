import { Pool, PoolConfig } from 'pg';
import * as fs from 'fs/promises';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  notes?: string;
  prices?: {
    small: number;
    large: number;
  };
  unit?: string;
  type?: string;
}

interface MenuSection {
  items: MenuItem[];
}

interface MenuData {
  specialties: MenuSection;
  salads: MenuSection;
  steaks: MenuSection;
  snacks_and_starters: MenuSection;
  mains: MenuSection;
  sides: MenuSection;
  desserts: MenuSection;
  drinks: MenuSection;
}

// Database configuration
const dbConfig: PoolConfig = {
  user: 'elghali',
  password: 'M3nt0s@Work',
  host: 'localhost',
  database: 'wine_dine',
  port: 5432
};

const pool = new Pool(dbConfig);

async function executeQuery(query: string, values: any[]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(query, values);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function insertSpecialties(items: MenuItem[]): Promise<void> {
  const query = `
    INSERT INTO specialties (id, name, description, price, notes)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      notes = EXCLUDED.notes`;

  for (const item of items) {
    await executeQuery(query, [
      item.id,
      item.name,
      item.description || null,
      item.price || null,
      item.notes || null
    ]);
  }
}

async function insertSalads(items: MenuItem[]): Promise<void> {
  const query = `
    INSERT INTO salads (id, name, description, price_small, price_large)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price_small = EXCLUDED.price_small,
      price_large = EXCLUDED.price_large`;

  for (const item of items) {
    await executeQuery(query, [
      item.id,
      item.name,
      item.description || null,
      item.prices?.small || null,
      item.prices?.large || null
    ]);
  }
}

async function insertSteaks(items: MenuItem[]): Promise<void> {
  const query = `
    INSERT INTO steaks (id, name, price, unit)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      price = EXCLUDED.price,
      unit = EXCLUDED.unit`;

  for (const item of items) {
    await executeQuery(query, [
      item.id,
      item.name,
      item.price || null,
      item.unit || null
    ]);
  }
}

async function insertBasicItems(items: MenuItem[], tableName: string): Promise<void> {
  const query = `
    INSERT INTO ${tableName} (id, name, description, price)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price = EXCLUDED.price`;

  for (const item of items) {
    await executeQuery(query, [
      item.id,
      item.name,
      item.description || null,
      item.price || null
    ]);
  }
}

async function insertDrinks(items: MenuItem[]): Promise<void> {
  const query = `
    INSERT INTO drinks (id, type, name, description, price)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO UPDATE SET
      type = EXCLUDED.type,
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price = EXCLUDED.price`;

  for (const item of items) {
    await executeQuery(query, [
      item.id,
      item.type || null,
      item.name,
      item.description || null,
      item.price || null
    ]);
  }
}

async function main() {
  try {
    const fileContent = await fs.readFile('menu.json', 'utf-8');
    const menuData: MenuData = JSON.parse(fileContent);

    // Insert data into all tables
    await insertSpecialties(menuData.specialties.items);
    await insertSalads(menuData.salads.items);
    await insertSteaks(menuData.steaks.items);
    await insertBasicItems(menuData.snacks_and_starters.items, 'snacks_and_starters');
    await insertBasicItems(menuData.mains.items, 'mains');
    await insertBasicItems(menuData.sides.items, 'sides');
    await insertBasicItems(menuData.desserts.items, 'desserts');
    await insertDrinks(menuData.drinks.items);

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);