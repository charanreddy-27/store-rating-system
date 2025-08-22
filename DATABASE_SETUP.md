# Database Setup Guide

## PostgreSQL Installation & Setup

### 1. Install PostgreSQL

**Windows:**
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember the superuser password you set during installation
- Default port is usually 5432

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database

Open PostgreSQL command line or use pgAdmin:

```sql
-- Connect as postgres user
CREATE DATABASE store_rating_db;
CREATE USER store_app WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE store_rating_db TO store_app;
```

### 3. Configure Environment Variables

Update the `backend/.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=store_app
DB_PASSWORD=your_password
DB_NAME=store_rating_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

### 4. Test Database Connection

Run the backend to test database connection:

```bash
cd backend
npm run start:dev
```

The application will automatically create the database tables using TypeORM synchronization.

### 5. Create Initial Admin User

Once the backend is running, you can create an initial admin user by making a POST request to:

```
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "name": "System Administrator Account",
  "email": "admin@storerating.com",
  "password": "AdminPass123!",
  "address": "123 Admin Street, Admin City, AC 12345",
  "role": "admin"
}
```

Or use the following curl command:

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Administrator Account",
    "email": "admin@storerating.com", 
    "password": "AdminPass123!",
    "address": "123 Admin Street, Admin City, AC 12345",
    "role": "admin"
  }'
```

### 6. Test Login

After creating the admin user, test login:

```
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "admin@storerating.com",
  "password": "AdminPass123!"
}
```

### 7. Create Test Data

Use the admin account to create some test stores and users through the web interface, or use the API endpoints.

## Database Schema

The application will automatically create these tables:

### Users Table
- id (Primary Key)
- name (varchar 60)
- email (unique)
- password (hashed)
- address (varchar 400)
- role (enum: admin, normal_user, store_owner)
- rating (decimal, for store owners)
- createdAt, updatedAt

### Stores Table
- id (Primary Key)
- name (varchar 60)
- email (unique)
- password (hashed)
- address (varchar 400)
- averageRating (decimal)
- totalRatings (integer)
- createdAt, updatedAt

### Ratings Table
- id (Primary Key)
- rating (integer 1-5)
- comment (text, optional)
- userId (Foreign Key)
- storeId (Foreign Key)
- createdAt, updatedAt
- Unique constraint on (userId, storeId)

## Troubleshooting

### Connection Issues
1. Check if PostgreSQL service is running
2. Verify database credentials in .env file
3. Ensure the database exists
4. Check firewall settings

### Permission Issues
```sql
-- Grant additional permissions if needed
GRANT ALL ON ALL TABLES IN SCHEMA public TO store_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO store_app;
```

### Reset Database
If you need to reset the database:
```sql
DROP DATABASE store_rating_db;
CREATE DATABASE store_rating_db;
```

The application will recreate all tables on next startup.
