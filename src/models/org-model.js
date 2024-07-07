import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const organisation = pgTable('organisations', {
  orgId: serial('orgId').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
})
