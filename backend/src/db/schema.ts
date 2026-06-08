

import { pgTable, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// User schema
export const users = pgTable("users", {
  // id: serial("id").primaryKey(),
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "my_id_seq", startWith: 900, increment: 9 }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  imageUrl: text("image-url"),

  isAccountVerified: boolean("is_account_verified").default(false),

  verifyOtp: text("verify_otp"),
  // verifyOtpExpiry: integer("verify_otp_expiry"),
  verifyOtpExpiry: timestamp("verify_otp_expiry", { mode: 'date' }),

  resetOtp: text("reset_otp"),
  resetOtpExpiry: timestamp("reset_otp_expiry", { mode: 'date' }),

  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).notNull().defaultNow()
})


// Product schema
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: integer("price").notNull(),
  userId: integer("user_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})


// Comments Schema
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow()
})


// User can have many product and many comments 
export const userRelation = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments)
}))



// Product belongs to many comments and one user
export const productRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  user: one(users, { fields: [products.userId], references: [users.id] })
}))


// Comment belongs to one user and one product 
export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  product: one(products, { fields: [comments.productId], references: [products.id] })
}))


// Type inference
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert