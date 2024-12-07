# Customer Management System

A comprehensive customer management system with advanced database operations, featuring complete CRUD functionality and order management capabilities. The system implements a RESTful API architecture with robust transaction handling.

## Key Features

### Customer Management (CRUD Operations)
- Create new customer records with validation
- Read customer information with filtering and sorting
- Update customer details with real-time validation
- Delete customer records with cascading effects

### Data Validation with Zod
- Type-safe schemas for all data models
- Real-time form validation
- Custom validation rules for business logic
- Integrated with React Hook Form

### Order Management with Triggers
- Automated order logging system
- Status tracking for orders
- Prevent deletion of shipped orders
- Historical tracking of order changes

### Transaction Management
- Atomic operations for data consistency
- Rollback on failure
- Concurrent operation handling
- Isolated transaction scope

### RESTful API Architecture
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent endpoint structure
- Proper error handling and status codes
- JSON response format

## Code Examples

### Customer Creation with Zod Validation
```typescript
// Schema Definition
export const insertCustomerSchema = createInsertSchema(customers, {
  age: z.number().min(0).optional(),
  email: z.string().email(),
  name: z.string().min(2),
});

// API Endpoint
app.post("/api/customers", async (req, res) => {
  try {
    const customer = await db.insert(customers).values(req.body).returning();
    res.json(customer[0]);
  } catch (error) {
    res.status(400).json({ error: "Invalid customer data" });
  }
});
```

### Transaction Example
```typescript
// Order Creation with Transaction
app.post("/api/orders", async (req, res) => {
  try {
    await db.transaction(async (tx) => {
      const order = await tx
        .insert(orders)
        .values({ customerId, quantity })
        .returning();

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
```

## Technical Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Shadcn UI components
- Wouter for routing
- Zod for form validation
- React Hook Form for form management

### Backend
- Express.js
- PostgreSQL with Drizzle ORM
- Transaction management
- Database triggers for order logging

## Database Schema

### Customers Table
```sql
customers {
  id: integer (Primary Key, Auto-increment)
  name: text (Not Null)
  email: text (Not Null)
  age: real
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Orders Table
```sql
orders {
  id: integer (Primary Key, Auto-increment)
  customerId: integer (Foreign Key -> customers.id)
  quantity: integer (Not Null)
  status: text (Not Null, Default: 'pending')
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Order Logs Table
```sql
orderLogs {
  id: integer (Primary Key, Auto-increment)
  orderId: integer
  action: text (Not Null)
  timestamp: timestamp
}
```

## API Endpoints

### Customers

#### GET /api/customers
- Description: Fetch all customers
- Response: Array of customer objects
```typescript
[{
  id: number,
  name: string,
  email: string,
  age?: number,
  createdAt: string,
  updatedAt: string
}]
```

#### POST /api/customers
- Description: Create a new customer
- Request Body: Customer data without ID
```typescript
{
  name: string,
  email: string,
  age?: number
}
```
- Response: Created customer object

#### PUT /api/customers/:id
- Description: Update existing customer
- Parameters: id (customer ID)
- Request Body: Updated customer data
```typescript
{
  name?: string,
  email?: string,
  age?: number
}
```
- Response: Updated customer object

#### DELETE /api/customers/:id
- Description: Delete a customer
- Parameters: id (customer ID)
- Response: Success message

### Orders

#### GET /api/customers/:id/orders
- Description: Fetch orders for a specific customer
- Parameters: id (customer ID)
- Response: Array of order objects

#### POST /api/orders
- Description: Create a new order
- Request Body:
```typescript
{
  customerId: number,
  quantity: number
}
```
- Response: Created order object

#### DELETE /api/orders/:id
- Description: Delete an order (not allowed for shipped orders)
- Parameters: id (order ID)
- Response: Success message

## Data Validation

The system uses Zod schemas for robust data validation:

### Customer Validation
```typescript
insertCustomerSchema = {
  age: number().min(0).optional(),
  email: string().email(),
  name: string().min(2)
}

updateCustomerSchema = {
  id: number(),
  ...insertCustomerSchema
}
```

## Frontend Components

### CustomerTable
- Displays customer data in a paginated table
- Supports sorting and filtering
- Provides Edit and Delete actions for each customer

### CustomerForm
- Handles both creation and updates
- Real-time validation using Zod schemas
- Integrated with React Hook Form
- Displays validation errors inline

## Contributing

### Getting Started
1. Fork the repository
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following our development guidelines
4. Write or update tests as needed
5. Push to your fork and submit a pull request

### Development Guidelines
1. Follow the existing code style and structure
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Add comments for complex logic
5. Update documentation for API changes

### Code Review Process
1. All contributions require review
2. Address review feedback promptly
3. Ensure CI checks pass
4. Keep pull requests focused and atomic

### Testing
1. Write unit tests for new features
2. Update existing tests when modifying features
3. Ensure all tests pass locally before submitting

### Documentation
1. Update README.md for new features
2. Document API changes in the API section
3. Include code examples for complex features
4. Keep documentation clear and concise

## Transaction Management

The system implements transaction management for critical operations:

1. Order Creation:
   - Creates new order record
   - Generates order log entry
   - All operations are atomic

2. Order Deletion:
   - Verifies order status
   - Deletes order record
   - Creates deletion log entry
   - All operations are atomic

## Setup and Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd customer-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGHOST=your_db_host
PGPORT=5432
PGDATABASE=your_db_name

# Optional Configuration
NODE_ENV=development
PORT=5000
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5000

### Deployment on Replit

1. Create a new Repl and select "Import from GitHub"
2. Enter the repository URL
3. In the Replit environment:
   - The database will be automatically configured
   - Environment variables will be set automatically
   - Click "Run" to start the application

### Verifying Installation
After starting the server, verify the following:

1. Server Status:
   - "serving on port 5000" message in console
   - No error messages in the logs

2. Database Connection:
   - Tables are created automatically
   - No database connection errors

3. Frontend Access:
   - Web interface loads at http://localhost:5000 (or Replit URL)
   - UI components render correctly
   - No console errors

4. Feature Testing:
   - Create a test customer record
   - View the customer list
   - Edit customer details
   - Delete a customer record
   - Create and view orders

## Development Guidelines

1. Database Changes:
   - Add new models in `db/schema.ts`
   - Use `npm run db:push` to update the database schema
   - Always backup data before schema changes
   - Test migrations in development first

2. API Routes:
   - Add new routes in `server/routes.ts`
   - Follow RESTful conventions
   - Implement proper error handling
   - Use transaction blocks for data consistency

3. Frontend Components:
   - Place components in `client/src/components`
   - Use Shadcn UI components when possible
   - Implement proper loading and error states
   - Follow accessibility guidelines

4. Keyboard Shortcuts:
   - Toggle Sidebar: Ctrl/Cmd + B
   - Navigation: Use Tab for form fields
   - Form Submission: Enter

5. Development Workflow:
   - Start development server: `npm run dev`
   - Run type checking: `npm run check`
   - Test API endpoints using Postman or curl
   - Check console for real-time logs

## Error Handling

The system implements comprehensive error handling at multiple levels:

### API Level
1. HTTP Status Codes:
   - 200: Successful operation
   - 400: Invalid input/Bad request
   - 404: Resource not found
   - 500: Server error

2. Error Response Format:
```json
{
  "error": "Error message",
  "details": ["Validation error details"],
  "code": "ERROR_CODE"
}
```

3. Transaction Management:
   - Automatic rollback on failures
   - Consistent database state
   - Error logging for debugging

### Frontend Level
1. Form Validation:
   - Real-time field validation
   - Custom error messages
   - Inline error display
```typescript
// Example form validation
const form = useForm<CustomerFormData>({
  resolver: zodResolver(insertCustomerSchema),
  defaultValues: {
    name: "",
    email: "",
    age: undefined,
  },
});
```

2. API Error Handling:
   - Toast notifications for errors
   - Retry mechanisms for failed requests
   - Graceful degradation
```typescript
useMutation({
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});
```

3. Loading States:
   - Skeleton loaders for data fetching
   - Disabled buttons during operations
   - Progress indicators for long operations

## Security Considerations

1. Input Validation:
   - All inputs are validated using Zod schemas
   - SQL injection prevention through Drizzle ORM
   - XSS prevention through React's built-in protections

2. Database:
   - Secure connection through environment variables
   - Prepared statements for all queries
   - Transaction isolation for data consistency
