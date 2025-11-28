const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

module.exports = (io) => {
    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            socket.username = decoded.username;

            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`✅ User connected: ${socket.username} (ID: ${socket.userId})`);

        // Update user online status
        await prisma.user.update({
            where: { id: socket.userId },
            data: { onlineStatus: true }
        });

        // Join user's current room if they have one
        const user = await prisma.user.findUnique({
            where: { id: socket.userId }
        });

        if (user.currentRoom) {
            socket.join(`room_${user.currentRoom}`);
            console.log(`User ${socket.username} rejoined room ${user.currentRoom}`);
        }

        // Send message
        socket.on('sendMessage', async (data) => {
            try {
                const { roomId, type, content, fileUrl } = data;

                // Save message to database
                const message = await prisma.message.create({
                    data: {
                        roomId: parseInt(roomId),
                        senderId: socket.userId,
                        type,
                        content: content || null,
                        fileUrl: fileUrl || null
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true
                            }
                        }
                    }
                });

                // Broadcast to room
                io.to(`room_${roomId}`).emit('newMessage', message);
            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', async (data) => {
            try {
                const { roomId, isTyping } = data;

                // Get partner in the room
                const room = await prisma.chatRoom.findUnique({
                    where: { id: parseInt(roomId) }
                });

                if (room) {
                    const partnerId = room.user1Id === socket.userId ? room.user2Id : room.user1Id;

                    // Find partner's socket and emit typing event
                    io.sockets.sockets.forEach((s) => {
                        if (s.userId === partnerId) {
                            s.emit('partnerTyping', { isTyping });
                        }
                    });
                }
            } catch (error) {
                console.error('Typing indicator error:', error);
            }
        });

        // Mark message as seen
        socket.on('seenMessage', async (data) => {
            try {
                const { messageId, roomId } = data;

                await prisma.message.update({
                    where: { id: parseInt(messageId) },
                    data: { seen: true }
                });

                // Notify sender
                io.to(`room_${roomId}`).emit('messageSeen', { messageId });
            } catch (error) {
                console.error('Seen message error:', error);
            }
        });

        // WebRTC Signaling - Offer
        socket.on('offer', async (data) => {
            try {
                const { roomId, offer } = data;

                const room = await prisma.chatRoom.findUnique({
                    where: { id: parseInt(roomId) }
                });

                if (room) {
                    const partnerId = room.user1Id === socket.userId ? room.user2Id : room.user1Id;

                    io.sockets.sockets.forEach((s) => {
                        if (s.userId === partnerId) {
                            s.emit('offer', { offer, from: socket.userId });
                        }
                    });
                }
            } catch (error) {
                console.error('WebRTC offer error:', error);
            }
        });

        // WebRTC Signaling - Answer
        socket.on('answer', async (data) => {
            try {
                const { roomId, answer } = data;

                const room = await prisma.chatRoom.findUnique({
                    where: { id: parseInt(roomId) }
                });

                if (room) {
                    const partnerId = room.user1Id === socket.userId ? room.user2Id : room.user1Id;

                    io.sockets.sockets.forEach((s) => {
                        if (s.userId === partnerId) {
                            s.emit('answer', { answer, from: socket.userId });
                        }
                    });
                }
            } catch (error) {
                console.error('WebRTC answer error:', error);
            }
        });

        // WebRTC Signaling - ICE Candidate
        socket.on('iceCandidate', async (data) => {
            try {
                const { roomId, candidate } = data;

                const room = await prisma.chatRoom.findUnique({
                    where: { id: parseInt(roomId) }
                });

                if (room) {
                    const partnerId = room.user1Id === socket.userId ? room.user2Id : room.user1Id;

                    io.sockets.sockets.forEach((s) => {
                        if (s.userId === partnerId) {
                            s.emit('iceCandidate', { candidate, from: socket.userId });
                        }
                    });
                }
            } catch (error) {
                console.error('ICE candidate error:', error);
            }
        });

        // End video call
        socket.on('endCall', async (data) => {
            try {
                const { roomId } = data;

                const room = await prisma.chatRoom.findUnique({
                    where: { id: parseInt(roomId) }
                });

                if (room) {
                    const partnerId = room.user1Id === socket.userId ? room.user2Id : room.user1Id;

                    io.sockets.sockets.forEach((s) => {
                        if (s.userId === partnerId) {
                            s.emit('callEnded', { from: socket.userId });
                        }
                    });
                }
            } catch (error) {
                console.error('End call error:', error);
            }
        });

        // Next chat (leave current room and re-enter queue)
        socket.on('nextChat', async () => {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: socket.userId }
                });

                if (user.currentRoom) {
                    const room = await prisma.chatRoom.findUnique({
                        where: { id: user.currentRoom }
                    });

                    if (room) {
                        // Notify partner
                        const partnerId = room.user1Id === socket.userId ? room.user2Id : room.user1Id;

                        io.sockets.sockets.forEach((s) => {
                            if (s.userId === partnerId) {
                                s.emit('partnerDisconnected');
                                s.leave(`room_${user.currentRoom}`);
                            }
                        });

                        // Create disconnect message
                        await prisma.message.create({
                            data: {
                                roomId: user.currentRoom,
                                senderId: socket.userId,
                                type: 'system',
                                content: 'Stranger has disconnected'
                            }
                        });

                        // Mark room as inactive
                        await prisma.chatRoom.update({
                            where: { id: user.currentRoom },
                            data: { active: false }
                        });
                    }

                    // Leave room
                    socket.leave(`room_${user.currentRoom}`);

                    // Clear current room
                    await prisma.user.update({
                        where: { id: socket.userId },
                        data: { currentRoom: null }
                    });
                }

                socket.emit('readyForQueue');
            } catch (error) {
                console.error('Next chat error:', error);
            }
        });

        // Disconnect
        socket.on('disconnect', async () => {
            console.log(`❌ User disconnected: ${socket.username}`);

            try {
                // Update online status
                await prisma.user.update({
                    where: { id: socket.userId },
                    data: {
                        onlineStatus: false,
                        lastSeen: new Date()
                    }
                });

                // Notify partner if in a room
                const user = await prisma.user.findUnique({
                    where: { id: socket.userId }
                });

                if (user.currentRoom) {
                    const room = await prisma.chatRoom.findUnique({
                        where: { id: user.currentRoom }
                    });

                    if (room) {
                        const partnerId = room.user1Id === socket.userId ? room.user2Id : room.user1Id;

                        io.sockets.sockets.forEach((s) => {
                            if (s.userId === partnerId) {
                                s.emit('partnerDisconnected');
                            }
                        });

                        // Create disconnect message
                        await prisma.message.create({
                            data: {
                                roomId: user.currentRoom,
                                senderId: socket.userId,
                                type: 'system',
                                content: 'Stranger has disconnected'
                            }
                        });
                    }
                }

                // Remove from queue if queued
                await prisma.matchQueue.deleteMany({
                    where: { userId: socket.userId }
                });
            } catch (error) {
                console.error('Disconnect cleanup error:', error);
            }
        });
    });

    console.log('🔌 Socket.IO handlers initialized');
};
