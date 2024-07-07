import { pgTable, varchar, text } from 'drizzle-orm/pg-core';


export const User = pgTable('users', {
  userId: text('userId').primaryKey().default(`uuid_generate_v4()`),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: varchar('phone', { length: 256 })
})