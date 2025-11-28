const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                username: true,
                gender: true,
                preference: true,
                nsfwEnabled: true,
                avatarUrl: true,
                onlineStatus: true,
                currentRoom: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { gender, preference, nsfwEnabled, avatarUrl } = req.body;

        const updateData = {};
        if (gender) updateData.gender = gender;
        if (preference) updateData.preference = preference;
        if (typeof nsfwEnabled === 'boolean') updateData.nsfwEnabled = nsfwEnabled;
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                gender: true,
                preference: true,
                nsfwEnabled: true,
                avatarUrl: true
            }
        });

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
