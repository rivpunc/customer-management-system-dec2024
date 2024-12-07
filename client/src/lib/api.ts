import type { Customer } from "@db/schema";

const API_BASE = "/api";

export async function getCustomers() {
  const response = await fetch(`${API_BASE}/customers`);
  if (!response.ok) throw new Error("Failed to fetch customers");
  return response.json();
}

export async function createCustomer(customer: Omit<Customer, "id">) {
  const response = await fetch(`${API_BASE}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) throw new Error("Failed to create customer");
  return response.json();
}

export async function updateCustomer(customer: Customer) {
  const response = await fetch(`${API_BASE}/customers/${customer.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update customer");
  }
  
  return response.json();
}

export async function deleteCustomer(id: number) {
  const response = await fetch(`${API_BASE}/customers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete customer");
  return response.json();
}

export async function getCustomerOrders(customerId: number) {
  const response = await fetch(`${API_BASE}/customers/${customerId}/orders`);
  if (!response.ok) throw new Error("Failed to fetch customer orders");
  return response.json();
}
