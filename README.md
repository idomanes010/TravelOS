# TravelOS

A full-stack vacation discovery platform with AI-powered travel recommendations. Users can browse vacations, like their favorites, and get personalized travel suggestions using OpenAI's GPT-4 and Model Context Protocol (MCP) integration.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [About](#about)

## ✨ Features

### User Features
- **User Authentication**: Secure login and registration with JWT tokens
- **Vacation Discovery**: Browse and filter vacations by destination and dates
- **Social Interactions**: Like/unlike vacations and see trending destinations
- **AI Travel Assistant**: Get personalized travel recommendations from GPT-4
- **MCP Integration**: Query vacation data using natural language with the Model Context Protocol
- **Responsive Design**: Mobile-friendly interface with React and Material-UI

### Admin Features
- **Vacation Management**: Add, update, and delete vacation listings
- **Image Upload**: Upload and manage vacation images
- **Analytics Dashboard**: View vacation statistics and user engagement metrics (📊 Report)
- **Access to AI Tools**: Admins can also use AskAI and AskMCP features alongside regular users

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Material-UI (MUI), CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Form Management**: React Hook Form
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Notifications**: Notyf

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **Database**: MySQL 2
- **Authentication**: JWT (jsonwebtoken)
- **AI Integration**: OpenAI SDK (GPT-4o-mini)
- **MCP Server**: Model Context Protocol integration
- **File Upload**: Express-fileupload
- **Development**: Nodemon, ts-node

### Database
- **MySQL** with connection pooling

## 📦 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MySQL** database server
- **Git**

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/TravelOS.git
cd TravelOS
```

### 2. Install Backend Dependencies
```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../Frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Setup

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Environment
ENVIRONMENT=development
PORT=4000

# Database
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=travel_os

# JWT & Security
JWT_SECRET=your_jwt_secret_key_here
HASH_SALT=10

# File Upload
IMAGES_LOCATION=./1-assets/images

# OpenAI API
CHAT_GPT_API_KEY=your_openai_api_key_here

# MCP Server
MCP_SERVER_URL=http://localhost:4000/mcp
```

### Frontend Environment Setup

Create a `.env.local` file in the `Frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Frontend Configuration (AppConfig.ts)

Update `Frontend/src/Utils/AppConfig.ts` with your API endpoints:

```typescript
export const appConfig = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
    gptUrl: "http://localhost:4000/api/ai",
    mcpUrl: "http://localhost:4000/api/ai/mcp",
    vacationUrl: "http://localhost:4000/api/vacations",
    // ... other endpoints
};
```

## 🎯 Running the Project

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Start Backend Server
```bash
cd Backend
npm start
```
Backend will run on: `http://localhost:4000`

#### Terminal 2 - Start Frontend Development Server
```bash
cd Frontend
npm start
```
Frontend will run on: `http://localhost:5173`

### Option 2: Run Both Concurrently (from root directory)
```bash
# Make sure you have concurrently installed globally
npm install -g concurrently

# From root directory
concurrently "cd Backend && npm start" "cd Frontend && npm start"
```

## 📁 Project Structure

```
TravelOS/
├── Backend/
│   ├── src/
│   │   ├── 1-assets/          # Static assets (images)
│   │   ├── 2-utils/           # Utility functions & config
│   │   ├── 3-models/          # Data models & enums
│   │   ├── 4-services/        # Business logic & MCP
│   │   ├── 5-controllers/     # Route controllers
│   │   ├── 6-middleware/      # Express middleware
│   │   └── app.ts             # Main application file
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── Components/        # React components
│   │   │   ├── AdminArea/     # Admin-only components
│   │   │   ├── LayoutArea/    # Layout & routing
│   │   │   ├── PagesArea/     # Page components
│   │   │   ├── UserArea/      # Auth components
│   │   │   ├── VacationArea/  # Vacation components
│   │   │   └── SharedArea/    # Shared components
│   │   ├── Models/            # TypeScript interfaces
│   │   ├── Redux/             # State management
│   │   ├── Services/          # API services
│   │   ├── Utils/             # Utility functions
│   │   └── main.tsx           # Entry point
│   └── package.json
│
├── Database/                  # Database schema & migrations
└── .gitignore
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Vacations
- `GET /api/vacations` - Get all vacations
- `POST /api/vacations/:id/like` - Like a vacation
- `DELETE /api/vacations/:id/like` - Unlike a vacation

### Admin
- `POST /api/admin/add` - Add new vacation
- `PUT /api/admin/update/:id` - Update vacation
- `DELETE /api/admin/delete/:id` - Delete vacation
- `GET /api/admin/report` - Get vacation report

### AI Features
- `POST /api/ai` - Get GPT recommendations
- `POST /api/ai/mcp` - Query with MCP

## 📊 Available Scripts

### Backend
```bash
npm start       # Start development server with nodemon
```

### Frontend
```bash
npm start       # Start Vite development server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## 🧪 Testing

To lint the frontend code:
```bash
cd Frontend
npm run lint
```

## 🌟 Key Features in Detail

### AI Travel Recommendations
The platform integrates with OpenAI's GPT-4o-mini model to provide intelligent travel suggestions. Pre-built prompts help users discover vacations by:
- Region and climate preferences
- Budget constraints
- Travel duration
- Activity interests

### Model Context Protocol (MCP)
Query vacation data using natural language:
- "How many active vacations are there?"
- "What is the average vacation price?"
- "Show me upcoming vacations in Europe"
- "Which vacations have the most likes?"

### Admin Dashboard
Comprehensive analytics showing:
- Total vacations and likes
- Most liked destinations
- User engagement metrics
- Revenue insights

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- XSS prevention middleware
- SQL injection prevention with parameterized queries
- CORS enabled for secure cross-origin requests
- Role-based access control (Admin/User)

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check `.env` file configuration
- Verify database credentials
- Check port 4000 is not in use

### Frontend build errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

### Database connection issues
- Verify MySQL service is running
- Check `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD` in `.env`
- Ensure the database specified in `MYSQL_DATABASE` exists

## 📝 License

This project is created for educational purposes at John Bryce Coding Academy.

## 👨‍💻 About

**Developer**: Ido Manes  
**Age**: 26  
**Location**: Rosh HaAyin, Israel  
**Role**: Full Stack Developer  
**Education**: John Bryce Coding Academy  

This project represents my journey in full-stack web development, combining frontend expertise with backend services, database management, and modern AI integration.

---

**Happy Traveling! 🌍✈️**
