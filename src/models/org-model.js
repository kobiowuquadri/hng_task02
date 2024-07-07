import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const organisations = pgTable('organisations', {
  orgId: serial('org_id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
})
