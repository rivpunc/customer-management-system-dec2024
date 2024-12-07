# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API does not require authentication.

## Error Handling
All endpoints return errors in the following format:
```json
{
  "error": "Error message",
  "details": ["Additional error details if available"]
}
```

## Endpoints

### Customers

#### GET /customers
Retrieve all customers.

**Response**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-12-05T10:00:00Z",
    "updatedAt": "2024-12-05T10:00:00Z"
  }
]
```

#### POST /customers
Create a new customer.

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

**Response**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "createdAt": "2024-12-05T10:00:00Z",
  "updatedAt": "2024-12-05T10:00:00Z"
}
```

#### PUT /customers/:id
Update an existing customer.

**Parameters**
- `id`: Customer ID

**Request Body**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 31
}
```

**Response**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 31,
  "createdAt": "2024-12-05T10:00:00Z",
  "updatedAt": "2024-12-05T10:30:00Z"
}
```

#### DELETE /customers/:id
Delete a customer.

**Parameters**
- `id`: Customer ID

**Response**
```json
{
  "success": true
}
```

### Orders

#### GET /customers/:id/orders
Retrieve orders for a specific customer.

**Parameters**
- `id`: Customer ID

**Response**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "quantity": 5,
    "status": "pending",
    "createdAt": "2024-12-05T10:00:00Z",
    "updatedAt": "2024-12-05T10:00:00Z"
  }
]
```

#### POST /orders
Create a new order.

**Request Body**
```json
{
  "customerId": 1,
  "quantity": 5
}
```

**Response**
```json
{
  "id": 1,
  "customerId": 1,
  "quantity": 5,
  "status": "pending",
  "createdAt": "2024-12-05T10:00:00Z",
  "updatedAt": "2024-12-05T10:00:00Z"
}
```

#### DELETE /orders/:id
Delete an order (not allowed for shipped orders).

**Parameters**
- `id`: Order ID

**Response**
```json
{
  "success": true
}
```

## Rate Limiting
Currently, no rate limiting is implemented.

## Data Validation
All endpoints use Zod schemas for request validation:

### Customer Schema
```typescript
{
  name: string().min(2),
  email: string().email(),
  age: number().min(0).optional()
}
```

### Order Schema
```typescript
{
  customerId: number(),
  quantity: number().min(1)
}
```

## Status Codes
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## Examples

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"quantity":5}'
```
