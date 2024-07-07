import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  phone: varchar('phone'),
})