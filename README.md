# Tech Community Website

A modern tech community platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

- User authentication and authorization
- Interactive forum for tech discussions
- Resource sharing and cheat sheets
- Placement preparation materials
- User profiles and dashboards
- Real-time notifications

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Material-UI
- React Router
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.IO
- Multer (File Uploads)

## 📁 Project Structure

```
tech-community-website/
├── .github/                    # GitHub Actions workflows
├── .vscode/                    # VS Code settings
├── backend/                    # Backend application
│   ├── src/
│   │   ├── api/               # API routes
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Database models
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── app.js             # Express app setup
│   ├── tests/                 # Backend tests
│   └── package.json
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable components
│   │   ├── features/          # Feature-based modules
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Layout components
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   ├── styles/            # Global styles
│   │   └── types/             # TypeScript types
│   ├── public/                # Public assets
│   └── package.json
├── docs/                       # Documentation
├── scripts/                    # Build and deployment scripts
├── .env.example               # Environment variables example
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
└── package.json              # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tech-community-website.git
cd tech-community-website
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# In the root directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- List any acknowledgments here