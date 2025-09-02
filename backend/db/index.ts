import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Create SQLite client (in-memory for development, can be changed to file-based)
const client = createClient({
  url: 'file:./backend/db/database.sqlite',
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export schema for use in other files
export * from './schema';