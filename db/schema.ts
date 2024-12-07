import { pgTable, text, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  age: real("age"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  customerId: integer("customer_id").references(() => customers.id),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderLogs = pgTable("order_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id"),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Zod schemas for validation
export const insertCustomerSchema = createInsertSchema(customers, {
  age: z.number().min(0).optional(),
  email: z.string().email(),
  name: z.string().min(2),
});

export const updateCustomerSchema = createInsertSchema(customers, {
  id: z.number(),
  age: z.number().min(0).optional(),
  email: z.string().email(),
  name: z.string().min(2),
});

export const insertOrderSchema = createInsertSchema(orders, {
  quantity: z.number().positive(),
  customerId: z.number(),
});

export type Customer = z.infer<typeof insertCustomerSchema>;
export type Order = z.infer<typeof insertOrderSchema>;
