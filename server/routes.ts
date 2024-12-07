import type { Express } from "express";
import { db } from "../db";
import { customers, orders, orderLogs, updateCustomerSchema } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export function registerRoutes(app: Express) {
  // Customer Routes
  app.get("/api/customers", async (req, res) => {
    try {
      const result = await db.select().from(customers);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customer = await db.insert(customers).values(req.body).returning();
      res.json(customer[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const { id, ...updateData } = req.body;
      
      // Validate the update data
      const validationResult = updateCustomerSchema.safeParse({ id: customerId, ...updateData });
      if (!validationResult.success) {
        console.error('Validation error:', validationResult.error);
        return res.status(400).json({ 
          error: "Invalid customer data", 
          details: validationResult.error.errors 
        });
      }

      const result = await db
        .update(customers)
        .set(updateData)
        .where(eq(customers.id, customerId))
        .returning();
        
      if (!result.length) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(result[0]);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ 
        error: "Failed to update customer",
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      await db.delete(customers).where(eq(customers.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete customer" });
    }
  });

  // Order Routes
  app.get("/api/customers/:id/orders", async (req, res) => {
    try {
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.customerId, parseInt(req.params.id)));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { customerId, quantity } = req.body;
      
      // Start transaction
      await db.transaction(async (tx) => {
        // Create order
        const order = await tx
          .insert(orders)
          .values({ customerId, quantity })
          .returning();

        // Log the order creation
        await tx.insert(orderLogs).values({
          orderId: order[0].id,
          action: "created",
        });

        res.json(order[0]);
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      
      // Check if order is shipped
      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (orderResult[0].status === "shipped") {
        return res.status(400).json({ error: "Cannot delete shipped orders" });
      }

      // Delete order and log it
      await db.transaction(async (tx) => {
        await tx.delete(orders).where(eq(orders.id, orderId));
        await tx.insert(orderLogs).values({
          orderId,
          action: "deleted",
        });
      });

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete order" });
    }
  });
}
