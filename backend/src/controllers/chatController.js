const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Upload file (image or voice)
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.fieldname === 'image' ? 'images' : 'voice'}/${req.file.filename}`;

        res.json({
            success: true,
            fileUrl,
            type: req.file.fieldname
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// Get chat history
exports.getHistory = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Verify user is part of the room
        const room = await prisma.chatRoom.findUnique({
            where: { id: parseInt(roomId) }
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.user1Id !== req.userId && room.user2Id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get messages
        const messages = await prisma.message.findMany({
            where: { roomId: parseInt(roomId) },
            orderBy: { timestamp: 'asc' },
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

        res.json({ messages });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

// Get partner info
exports.getPartner = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.chatRoom.findUnique({
            where: { id: parseInt(roomId) },
            include: {
                user1: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        onlineStatus: true
                    }
                },
                user2: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        onlineStatus: true
                    }
                }
            }
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Return the partner (not the current user)
        const partner = room.user1Id === req.userId ? room.user2 : room.user1;

        res.json({ partner });
    } catch (error) {
        console.error('Get partner error:', error);
        res.status(500).json({ error: 'Failed to fetch partner info' });
    }
};
