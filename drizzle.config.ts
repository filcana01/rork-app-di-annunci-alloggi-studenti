import type { Config } from 'drizzle-kit';

export default {
  schema: './backend/db/schema.ts',
  out: './backend/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./backend/db/database.sqlite',
  },
  verbose: true,
  strict: true,
} satisfies Config;