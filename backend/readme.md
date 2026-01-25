## Backend

**Node.js + Express.js** - Lightweight and flexible server framework

**MongoDB + Mongoose** - Document database perfect for property listings

**JWT** - Secure authentication with role claims

**Cloudinary** - Professional image hosting and optimization

**Multer** - File upload handling

**Helmet + CORS** - Security middleware

## Frontend

**React + Vite** - Fast development and hot reload

**React Router** - Client-side routing with protected routes

**TanStack Query** - Smart data fetching, caching, and synchronization

**React Context** - Simple global state management

**Tailwind CSS** - Utility-first styling for rapid UI development

**React Hook Form** - Form handling with validation

**Lucide React** - Beautiful icons

## Backend Setup

```
git clone https://github.com/yourusername/property-platform.git
cd property-platform/backend

# Install dependencies
npm install

# Configure environment
touch .env
# Edit .env with your MongoDB, JWT, Cloudinary, Node env, and PORT

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

## Frontend Setup

```
cd ../frontend

# Install dependencies
npm install

# Configure environment
touch .env
# Edit .env: VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# App runs on http://localhost:5173
```

## Key Endpoints

### Authentication

- `POST` `/api/auth/register` - Register new user
- `POST` `/api/auth/login` - Login user
- `GET` `/api/auth/me` - Get current user profile
- `PUT` `/api/auth/update` - Update user profile
- `POST` `/api/auth/logout` - Logout user

### Properties (Public)

- `GET` `/api/properties` - List properties with filters and pagination
- `GET` `/api/properties/:id` - Get property details

## Properties (Owner Only)

- `POST` `/api/properties` - Create new property (with images)
- `PUT` `/api/properties/:id` - Update property (draft only)
- `DELETE` `/api/properties/:id` - Soft delete property
- `PUT` `/api/properties/:id/publish` - Publish draft property
- `GET` `/api/properties/my-properties/all` - Get owner's properties

## Favorites (Authenticated Users)

- `POST` `/api/favorites/:propertyId` - Add to favorites
- `DELETE` `/api/favorites/:propertyId` - Remove from favorites
- `GET` `/api/favorites` - Get user's favorites
- `GET` `/api/favorites/check/:propertyId` - Check if favorited

## Admin (Admin Only)

- `GET` `/api/admin/metrics` - Get system metrics
- `PUT` `/api/admin/properties/:id/toggle` - Disable/enable property
- `GET` `/api/admin/users` - Get all users
- `GET` `/api/admin/properties` - Get all properties

## API Documentation

Download the [Postman Collection](./docs/Property%20Platform%20API%20Collection.postman_collection.json) and import it into Postman.

**Import Instructions:**

1. Open Postman
2. Click Import → Upload Files
3. Select the JSON file
4. Set `baseUrl` variable to: `http://localhost:5000` for local testing
