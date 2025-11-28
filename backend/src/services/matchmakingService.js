const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MatchmakingService {
    constructor(io) {
        this.io = io;
    }

    // Check if two users are compatible for matching
    isCompatible(user1, user2) {
        // NSFW filtering: NSFW ON must match with NSFW ON, OFF with OFF
        if (user1.nsfwEnabled !== user2.nsfwEnabled) {
            return false;
        }

        // "All" preference matching logic: "All" only matches with "All"
        if (user1.preference === 'All' || user2.preference === 'All') {
            return user1.preference === 'All' && user2.preference === 'All';
        }

        // Gender-based matching
        // User1 wants user2's gender AND user2 wants user1's gender
        const user1WantsUser2 = user1.preference === user2.gender;
        const user2WantsUser1 = user2.preference === user1.gender;

        return user1WantsUser2 && user2WantsUser1;
    }

    // Add user to queue and try to find a match
    async enqueue(userId) {
        try {
            // Get user details
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Check if user is already in queue
            const existingEntry = await prisma.matchQueue.findFirst({
                where: { userId }
            });

            if (existingEntry) {
                return { status: 'already_queued' };
            }

            // Add to queue
            await prisma.matchQueue.create({
                data: {
                    userId,
                    gender: user.gender,
                    preference: user.preference,
                    nsfwEnabled: user.nsfwEnabled
                }
            });

            // Try to find a match
            const match = await this.findMatch(userId);

            if (match) {
                return { status: 'matched', match };
            }

            return { status: 'queued' };
        } catch (error) {
            console.error('Enqueue error:', error);
            throw error;
        }
    }

    // Find a compatible match for the user
    async findMatch(userId) {
        try {
            const currentUser = await prisma.matchQueue.findFirst({
                where: { userId },
                include: { user: true }
            });

            if (!currentUser) {
                return null;
            }

            // Get all other users in queue
            const otherUsers = await prisma.matchQueue.findMany({
                where: {
                    userId: { not: userId }
                },
                include: { user: true },
                orderBy: { queuedAt: 'asc' }
            });

            // Find first compatible user
            for (const otherUser of otherUsers) {
                if (this.isCompatible(currentUser, otherUser)) {
                    // Create chat room
                    const room = await this.createChatRoom(currentUser.userId, otherUser.userId, currentUser.nsfwEnabled);

                    // Remove both from queue
                    await prisma.matchQueue.deleteMany({
                        where: {
                            userId: { in: [currentUser.userId, otherUser.userId] }
                        }
                    });

                    // Update users' current room
                    await prisma.user.updateMany({
                        where: { id: { in: [currentUser.userId, otherUser.userId] } },
                        data: { currentRoom: room.id }
                    });

                    // Notify both users via Socket.IO
                    this.notifyMatch(currentUser.userId, otherUser.userId, room.id);

                    return {
                        roomId: room.id,
                        partnerId: otherUser.userId,
                        partnerUsername: otherUser.user.username,
                        partnerAvatar: otherUser.user.avatarUrl
                    };
                }
            }

            return null;
        } catch (error) {
            console.error('Find match error:', error);
            throw error;
        }
    }

    // Create a chat room for matched users
    async createChatRoom(user1Id, user2Id, nsfwState) {
        const room = await prisma.chatRoom.create({
            data: {
                user1Id,
                user2Id,
                nsfwState
            }
        });

        // Create system message
        await prisma.message.create({
            data: {
                roomId: room.id,
                senderId: user1Id,
                type: 'system',
                content: 'You are now connected with a stranger. Say hi!'
            }
        });

        return room;
    }

    // Notify both users of the match
    notifyMatch(user1Id, user2Id, roomId) {
        // Get socket IDs from connected users
        const sockets = this.io.sockets.sockets;

        sockets.forEach((socket) => {
            if (socket.userId === user1Id) {
                socket.emit('matchFound', {
                    roomId,
                    partnerId: user2Id
                });
                socket.join(`room_${roomId}`);
            } else if (socket.userId === user2Id) {
                socket.emit('matchFound', {
                    roomId,
                    partnerId: user1Id
                });
                socket.join(`room_${roomId}`);
            }
        });
    }

    // Remove user from queue
    async dequeue(userId) {
        await prisma.matchQueue.deleteMany({
            where: { userId }
        });

        return { status: 'removed' };
    }

    // Periodic match checking (called every few seconds)
    async checkAllMatches() {
        try {
            const queuedUsers = await prisma.matchQueue.findMany({
                orderBy: { queuedAt: 'asc' }
            });

            for (const user of queuedUsers) {
                await this.findMatch(user.userId);
            }
        } catch (error) {
            console.error('Check all matches error:', error);
        }
    }
}

module.exports = MatchmakingService;
