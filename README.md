# MERN Task Management System

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, task CRUD operations, search, filtering, sorting, and pagination.

## Features

### Authentication
- User registration with validation
- Secure login with JWT tokens
- HTTP-only cookie storage for tokens
- Protected routes
- Profile management
- Logout functionality

### Task Management
- Create, read, update, delete tasks
- Task ownership authorization
- Status tracking: Todo, In Progress, Completed
- Priority levels: Low, Medium, High
- Due dates with overdue detection
- Search by title/description
- Filter by status and priority
- Sort by created date, due date, or title
- Pagination support

### Dashboard
- Task statistics overview
- Recent tasks preview
- Quick navigation to filtered views

### UI/UX
- Modern, responsive design with Tailwind CSS
- Mobile-first approach
- Toast notifications
- Loading states
- Form validation
- Accessible components

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs for authentication
- express-validator for validation
- cookie-parser for cookie handling

### Frontend
- React 18 + Vite
- React Router v6
- Redux Toolkit for state management
- Tailwind CSS for styling
- Axios for API requests
- React Hot Toast for notifications
- Heroicons for icons
- date-fns for date formatting

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── hooks/          # Custom hooks
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── store/          # Redux store & slices
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLIENT_URL=http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with query params) |
| GET | `/api/tasks/dashboard` | Get dashboard statistics |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Task Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search in title/description |
| status | string | Filter by status (todo, in_progress, completed) |
| priority | string | Filter by priority (low, medium, high) |
| sortBy | string | Sort field (createdAt, dueDate, title) |
| sortOrder | string | Sort order (asc, desc) |
| page | number | Page number |
| limit | number | Items per page |

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| NODE_ENV | Environment (development/production) |
| PORT | Server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRE | JWT expiration time |
| JWT_COOKIE_EXPIRE | Cookie expiration in days |
| CLIENT_URL | Frontend URL for CORS |

### Frontend
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Set secure `CLIENT_URL`
4. Use MongoDB Atlas or production MongoDB instance
5. Run `npm start`

### Frontend
1. Run `npm run build`
2. Deploy `dist` folder to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables

## License

MIT