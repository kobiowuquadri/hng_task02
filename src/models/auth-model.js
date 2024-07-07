import { pgTable, varchar, text, serial } from 'drizzle-orm/pg-core';

export const User = pgTable('users', {
  userId: serial('userId').primaryKey(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  phone: varchar('phone', { length: 256 })
})