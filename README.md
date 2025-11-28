# NebulaLink — The Neon Stranger Universe

A complete, production-grade, full-stack real-time communication platform with gender-based matchmaking, NSFW filtering, and a stunning neon cyberpunk UI.

## 🌟 Features

- **Real-Time Chat**: Text, emojis, GIFs, images, and voice messages
- **Video Calls**: WebRTC-powered face-to-face communication
- **Smart Matchmaking**: Gender-based preferences and NSFW mode filtering
- **Neon UI**: Vaporwave-inspired Discord-like interface
- **Instant Matching**: Low-latency matchmaking engine
- **Typing Indicators**: Real-time typing status
- **Read Receipts**: Message seen indicators
- **Next Chat**: Quick disconnect and re-match

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL with Prisma ORM
- Socket.IO for real-time communication
- JWT authentication
- Multer for file uploads
- WebRTC signaling

### Frontend
- React 18 with Vite
- TailwindCSS with custom neon theme
- Zustand for state management
- Socket.IO client
- SimplePeer for WebRTC
- Framer Motion for animations
- Tenor API for GIF search
- Emoji Mart for emoji picker

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone or navigate to the project

```bash
cd C:\Users\arbbi\.gemini\antigravity\scratch\nebulalink
```

### 2. Install dependencies

```bash
npm run setup
```

This will install dependencies for both backend and frontend.

### 3. Configure PostgreSQL

Make sure PostgreSQL is running on `localhost:5432`.

Create a database named `nebulalink`:

```sql
CREATE DATABASE nebulalink;
```

### 4. Configure Environment Variables

Update `backend/.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/nebulalink?schema=public"
JWT_SECRET="your_secret_key_here"
PORT=5000
```

### 5. Run Database Migrations

```bash
npm run migrate
```

This will create all necessary tables in PostgreSQL.

### 6. Start the Application

```bash
npm run dev
```

This will start both:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

## 🎮 Usage

1. Open `http://localhost:3000` in your browser
2. Click "Enter Universe"
3. Create an account with:
   - Username and password
   - Your gender (Male/Female/Other)
   - Preference (Male/Female/All)
   - NSFW mode toggle
4. Click "Start Chat" to enter matchmaking
5. Once matched, enjoy chatting with features:
   - Text messages
   - Emoji picker
   - GIF search (Tenor API)
   - Image upload
   - Voice messages
   - Video calls
6. Click "Next" to disconnect and find a new match

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run setup

# Run both backend and frontend
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Run database migrations
npm run migrate

# Open Prisma Studio (database GUI)
npm run studio
```

## 🎨 Matchmaking Logic

### Gender Matching
- **Male → Female**: Males seeking females match with females seeking males
- **Female → Male**: Females seeking males match with males seeking females
- **All → All**: Users selecting "All" match ONLY with other "All" users

### NSFW Filtering
- **NSFW ON**: Matches only with other NSFW ON users
- **NSFW OFF**: Matches only with other NSFW OFF users
- No cross-matching between NSFW modes

## 📁 Project Structure

```
nebulalink/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Auth & upload middleware
│   │   ├── routes/           # API routes
│   │   ├── services/         # Matchmaking logic
│   │   ├── socket/           # Socket.IO handlers
│   │   └── server.js         # Express server
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── uploads/              # File storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── screens/          # Page components
│   │   ├── services/         # API & Socket services
│   │   ├── store/            # Zustand stores
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   └── package.json
└── package.json              # Root scripts

```

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Configure CORS properly for production domains
- Use environment variables for sensitive data
- Implement rate limiting for production

## 🌐 Deployment

For production deployment:

1. Set up PostgreSQL on your hosting provider
2. Update `DATABASE_URL` with production credentials
3. Build frontend: `cd frontend && npm run build`
4. Deploy backend to Railway/Render/Heroku
5. Deploy frontend to Vercel/Netlify
6. Configure CORS to allow your frontend domain

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Create new user
- `POST /auth/login` - Login user

### User
- `GET /user/profile` - Get user profile
- `PUT /user/update` - Update profile

### Matchmaking
- `POST /queue/enqueue` - Join matchmaking queue
- `POST /queue/cancel` - Leave queue

### Chat
- `POST /chat/upload/image` - Upload image
- `POST /chat/upload/voice` - Upload voice message
- `GET /chat/history/:roomId` - Get chat history
- `GET /chat/partner/:roomId` - Get partner info

## 🎯 Socket.IO Events

### Client → Server
- `sendMessage` - Send chat message
- `typing` - Typing indicator
- `seenMessage` - Mark message as seen
- `offer/answer/iceCandidate` - WebRTC signaling
- `endCall` - End video call
- `nextChat` - Leave room and re-queue

### Server → Client
- `matchFound` - Match notification
- `newMessage` - Receive message
- `partnerTyping` - Partner typing status
- `messageSeen` - Message seen confirmation
- `partnerDisconnected` - Partner left
- `callEnded` - Video call ended

## 🐛 Troubleshooting

### PostgreSQL Connection Error
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Verify database exists

### Socket.IO Connection Failed
- Check backend is running on port 5000
- Verify CORS configuration
- Check browser console for errors

### WebRTC Not Working
- Allow camera/microphone permissions
- Check HTTPS in production (required for WebRTC)
- Verify STUN servers are accessible

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🙏 Credits

- Tenor API for GIF search
- SimplePeer for WebRTC
- Emoji Mart for emoji picker
- Framer Motion for animations

---

Built with ❤️ and neon lights 🌈
