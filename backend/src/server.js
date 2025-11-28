const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'https://nebullink.vercel.app',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const queueRoutes = require('./routes/queueRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/queue', queueRoutes);
app.use('/chat', chatRoutes);

// Socket.IO
const socketHandler = require('./socket/socketHandler');
socketHandler(io);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'NebulaLink server is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 NebulaLink server running on port ${PORT}`);
    console.log(`🔌 Socket.IO ready for connections`);
});

module.exports = { io };
