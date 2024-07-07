import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const organisation = pgTable('organisations', {
  orgId: text('orgId').primaryKey().default(`uuid_generate_v4()`),
  name: text('name').notNull(),
  description: text('description'),
  userId:  uuid('userId').notNull()
})
