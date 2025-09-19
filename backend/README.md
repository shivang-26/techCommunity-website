# Tech Community Backend

A production-ready Node.js backend for the Tech Community website with authentication, OTP verification, forum functionality, and Google OAuth integration.

## 🚀 Features

- **Authentication System**
  - Email/password registration with OTP verification
  - Session-based authentication
  - JWT token support
  - Google OAuth integration
  - Password hashing with bcrypt

- **Forum System**
  - Create, read, update, delete posts
  - Voting system
  - Answer system
  - User activity tracking

- **Security Features**
  - Helmet.js for security headers
  - CORS configuration
  - Rate limiting
  - Input validation
  - SQL injection protection (MongoDB)

- **Production Ready**
  - Environment-based configuration
  - Error handling middleware
  - Logging with Morgan
  - Health check endpoints
  - Graceful shutdown

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)
- SMTP email service (Yahoo, Gmail, etc.)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tech-community-website/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if using local)
   mongod
   
   # Or use MongoDB Atlas
   # Update MONGO_URI in .env
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/tech-community

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Security
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-super-secret-jwt-key

# Email (SMTP)
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── api/
│   │   └── routes/          # API route handlers
│   ├── config/              # Configuration files
│   ├── controllers/         # Business logic
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── services/            # External services
│   └── server.js           # Main server file
├── routes/
│   └── auth.js             # Authentication routes
├── server.js               # Entry point
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth

### Forum
- `GET /api/forum` - Get all posts
- `POST /api/forum` - Create new post
- `PUT /api/forum/:id/vote` - Vote on post
- `POST /api/forum/:id/answer` - Add answer
- `DELETE /api/forum/:id` - Delete post

### Health Check
- `GET /health` - Server health status

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Secrets**: Use strong, unique secrets for SESSION_SECRET and JWT_SECRET
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Configure appropriate rate limits
5. **Input Validation**: All inputs are validated
6. **CORS**: Configure CORS for your domain

## 🚀 Deployment

### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your-mongodb-uri
# Set other environment variables
git push heroku main
```

### Docker
```bash
# Build image
docker build -t tech-community-backend .

# Run container
docker run -p 5000:5000 tech-community-backend
```

### VPS/Cloud
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "tech-community-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@techcommunity.com or create an issue in the repository. 