const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, password, gender, preference, nsfwEnabled, avatarUrl } = req.body;

        // Validate input
        if (!username || !password || !gender || !preference) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                passwordHash,
                gender,
                preference,
                nsfwEnabled: nsfwEnabled || false,
                avatarUrl: avatarUrl || null
            }
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                gender: user.gender,
                preference: user.preference,
                nsfwEnabled: user.nsfwEnabled,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing credentials' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update online status
        await prisma.user.update({
            where: { id: user.id },
            data: { onlineStatus: true, lastSeen: new Date() }
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                gender: user.gender,
                preference: user.preference,
                nsfwEnabled: user.nsfwEnabled,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
