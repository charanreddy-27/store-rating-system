# Store Rating System

A comprehensive fullstack web application for rating and managing stores with role-based access control.

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: Class Validator & Class Transformer

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Styling**: Custom CSS (Tailwind-inspired utility classes)

## Features

### User Roles & Capabilities

#### System Administrator
- ✅ Add new stores, normal users, and admin users
- ✅ View dashboard with system statistics (total users, stores, ratings)
- ✅ Manage users with filtering by name, email, address, and role
- ✅ View store listings with ratings
- ✅ Full CRUD operations on users and stores

#### Normal User
- ✅ User registration and login
- ✅ Browse and search stores by name and address
- ✅ Submit ratings (1-5 stars) with optional comments
- ✅ Update existing ratings
- ✅ View personal rating history
- ✅ Update password

#### Store Owner
- ✅ Login to dedicated dashboard
- ✅ View store performance metrics
- ✅ See customer ratings and feedback
- ✅ Update password

### Form Validations
- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters with at least one uppercase letter and one special character
- **Email**: Standard email validation

### Additional Features
- ✅ Sorting capabilities on all data tables
- ✅ Real-time average rating calculation
- ✅ Responsive design
- ✅ JWT-based authentication
- ✅ Role-based route protection
- ✅ Search and filter functionality

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd store-rating-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Configuration**
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` in the backend folder
   - Update database credentials in the `.env` file:
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=postgres
     DB_PASSWORD=your_password
     DB_NAME=store_rating_db
     JWT_SECRET=your-super-secret-jwt-key
     PORT=3001
     ```

5. **Frontend Configuration**
   - Copy `.env.example` to `.env` in the frontend folder
   - Update API URL if needed:
     ```env
     REACT_APP_API_URL=http://localhost:3001
     ```

### Running the Application

#### Option 1: Using VS Code Tasks (Recommended)
1. Open the project in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select "Start Full Application"

This will start both backend and frontend servers simultaneously.

#### Option 2: Manual Start

**Start Backend:**
```bash
cd backend
npm run start:dev
```
Backend will run on http://localhost:3001

**Start Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

### Initial Setup

1. **Create Admin User** (via API or database)
   - The system requires an initial admin user to be created
   - You can create one using the registration endpoint with role: "admin"

2. **Create Test Data**
   - Admin can then create stores and normal users through the web interface

## Project Structure

```
store-rating-system/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── stores/         # Store management
│   │   ├── ratings/        # Rating system
│   │   ├── dashboard/      # Dashboard statistics
│   │   ├── entities/       # Database entities
│   │   └── dto/            # Data transfer objects
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── App.tsx
│   ├── .env.example        # Environment variables template
│   └── package.json
├── .vscode/
│   └── tasks.json          # VS Code tasks configuration
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Users (Admin only)
- `GET /users` - List all users with filtering
- `POST /users` - Create new user
- `GET /users/:id` - Get user details
- `PUT /users/password` - Update password

### Stores
- `GET /stores` - List stores with search
- `POST /stores` - Create store (Admin only)
- `GET /stores/:id` - Get store details
- `GET /stores/:id/ratings` - Get store ratings

### Ratings
- `POST /ratings` - Submit rating (Normal users)
- `PUT /ratings/:id` - Update rating
- `GET /ratings` - Get user ratings

### Dashboard
- `GET /dashboard/admin` - Admin statistics
- `GET /dashboard/store-owner` - Store owner dashboard

## Database Schema

### Users Table
- id, name, email, password, address, role, rating, timestamps

### Stores Table
- id, name, email, password, address, averageRating, totalRatings, timestamps

### Ratings Table
- id, rating, comment, userId, storeId, timestamps
- Unique constraint on (userId, storeId)

## Development

### Backend Development
```bash
cd backend
npm run start:dev    # Development mode with hot reload
npm run build        # Production build
npm run test         # Run tests
```

### Frontend Development
```bash
cd frontend
npm start           # Development server
npm run build       # Production build
npm test            # Run tests
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection prevention with TypeORM

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Image upload for stores
- [ ] Advanced analytics
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Automated testing suite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository or contact the development team.
