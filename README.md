# SHV11 Inventory Management System

A modern web-based inventory management system built with React, Node.js, Express, and MongoDB.

## Features

- User authentication with admin approval system
- Inventory management with item tracking
- Item checkout system
- Excel export with barcodes
- Role-based access control
- Modern and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Project Structure

```
shv11-inventory/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shv11-inventory
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Create environment files:

   Backend (.env):
   ```
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/shv11-inventory
   JWT_SECRET=your-secret-key
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_BUCKET_NAME=your-bucket-name
   AWS_REGION=your-region
   ```

   Frontend (.env):
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ```

5. Start MongoDB:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   ```

6. Start the development servers:

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend:
   ```bash
   cd client
   npm start
   ```

## Usage

1. Access the application at `http://localhost:3000`
2. Register a new account (first user will be automatically assigned as admin)
3. Admin users can approve new registrations and manage the system
4. Regular users can view inventory, check out items, and export data

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- GET `/api/auth/pending` - Get pending user approvals (admin only)
- POST `/api/auth/approve/:id` - Approve a user (admin only)
- POST `/api/auth/reject/:id` - Reject a user (admin only)

### Inventory
- GET `/api/inventory` - Get all inventory items
- POST `/api/inventory` - Add a new item
- PUT `/api/inventory/:id` - Update an item
- DELETE `/api/inventory/:id` - Delete an item
- POST `/api/inventory/checkout` - Checkout items
- GET `/api/inventory/export` - Export inventory to Excel

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 