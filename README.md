# InstaChat - Modern Social Media Application

A full-stack social media application built with React, Node.js, and MongoDB, featuring real-time messaging, video calling, stories, and group chat functionality.

## 🚀 Features

### Core Features
- **User Management**: Registration, authentication, profile management
- **Social Features**: Friend requests, mutual friends, user discovery
- **Real-time Chat**: One-on-one and group messaging with Stream Chat
- **Video Calling**: WebRTC-based video calls with call notifications
- **Stories System**: Text and media stories with 24-hour expiration
- **Group Management**: Create and manage group chats
- **Notifications**: Real-time notifications for various activities
- **Theming**: Light/Dark themes with custom theme selection

### Technical Features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Real-time Updates**: WebSocket connections for live updates
- **File Upload**: Profile pictures and story media with validation
- **Authentication**: JWT-based authentication with protected routes
- **State Management**: TanStack Query for server state, Zustand for client state

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS + DaisyUI** - Styling and component library
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Stream Chat React SDK** - Real-time messaging
- **Stream Video SDK** - Video calling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Passport.js** - Authentication middleware
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
instachat/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── lib/           # Utility functions
│   │   └── server.js      # Main server file
│   ├── uploads/           # File uploads directory
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/          # API and utility functions
│   │   ├── store/        # State management
│   │   └── App.jsx       # Main app component
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Stream Chat account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd instachat
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend .env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   BASE_URL=http://localhost:5001
   STREAM_API_KEY=your_stream_api_key
   STREAM_SECRET=your_stream_secret
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Endpoints
- `GET /api/users/` - Get recommended users
- `GET /api/users/friends` - Get user's friends
- `POST /api/users/friend-request/:id` - Send friend request
- `PUT /api/users/friend-request/:id/accept` - Accept friend request
- `POST /api/users/profile-picture` - Upload profile picture
- `GET /api/users/:userId/mutual-friends` - Get mutual friends

### Story Endpoints
- `POST /api/stories/` - Create new story
- `GET /api/stories/feed` - Get stories feed
- `GET /api/stories/my-stories` - Get user's stories
- `POST /api/stories/upload-media` - Upload story media
- `PUT /api/stories/:id/view` - Mark story as viewed
- `DELETE /api/stories/:id` - Delete story

### Group Endpoints
- `POST /api/groups/` - Create new group
- `GET /api/groups/` - Get user's groups
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `POST /api/groups/:id/members` - Add group members
- `DELETE /api/groups/:id/members/:userId` - Remove group member

## 🗄️ Database Schema

### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  password: String,
  googleId: String (unique, sparse),
  bio: String,
  profilePic: String,
  location: String,
  isOnboarded: Boolean,
  friends: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Story Model
```javascript
{
  author: ObjectId (ref: User),
  content: String,
  media: {
    type: String,
    url: String,
    thumbnail: String,
    duration: Number,
    size: Number
  },
  views: [ObjectId],
  isActive: Boolean,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### FriendRequest Model
```javascript
{
  sender: ObjectId (ref: User),
  recipient: ObjectId (ref: User),
  status: String (pending/accepted/rejected),
  createdAt: Date,
  updatedAt: Date
}
```

### Group Model
```javascript
{
  name: String,
  description: String,
  admin: ObjectId (ref: User),
  members: [ObjectId],
  isPrivate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

The application uses JWT-based authentication with the following flow:

1. **User Registration/Login**: Credentials are validated and JWT token is issued
2. **Token Storage**: JWT token is stored in httpOnly cookies for security
3. **Request Authentication**: Each API request includes token in Authorization header
4. **Token Validation**: Server validates token and extracts user information
5. **Protected Routes**: Frontend routes are protected with authentication guards

## 🎨 Theming

The application supports multiple themes:
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Dark mode for low-light usage
- **Custom Themes**: 10+ predefined themes including Coffee, Forest, Synthwave, Cyberpunk, etc.

Themes are managed using Zustand store and persisted in localStorage.

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: Optimized for smartphones with touch-friendly interface
- **Tablet**: Adapted layout for medium screens
- **Desktop**: Full-featured desktop experience with sidebar navigation

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   BASE_URL=your_production_url
   ```

2. **Backend Deployment**
   ```bash
   cd backend
   npm install --production
   npm start
   ```

3. **Frontend Deployment**
   ```bash
   cd frontend
   npm run build
   # Deploy dist/ folder to your hosting service
   ```

### Recommended Hosting
- **Backend**: Heroku, Railway, or DigitalOcean
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3 or Cloudinary

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint and Prettier configurations
- Use meaningful commit messages
- Write tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stream Chat](https://getstream.io/chat/) for real-time messaging
- [Stream Video](https://getstream.io/video/) for video calling
- [TailwindCSS](https://tailwindcss.com/) for styling
- [DaisyUI](https://daisyui.com/) for component library
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework

## 📞 Support

For support, email support@instachat.com or join our Discord community.

---

**Built with ❤️ by the InstaChat Team**