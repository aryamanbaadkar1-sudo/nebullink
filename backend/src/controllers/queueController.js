const MatchmakingService = require('../services/matchmakingService');
const { io } = require('../server');

const matchmaking = new MatchmakingService(io);

// Add user to matchmaking queue
exports.enqueue = async (req, res) => {
    try {
        const result = await matchmaking.enqueue(req.userId);
        res.json(result);
    } catch (error) {
        console.error('Enqueue error:', error);
        res.status(500).json({ error: 'Failed to join queue' });
    }
};

// Remove user from queue
exports.cancel = async (req, res) => {
    try {
        const result = await matchmaking.dequeue(req.userId);
        res.json(result);
    } catch (error) {
        console.error('Cancel queue error:', error);
        res.status(500).json({ error: 'Failed to leave queue' });
    }
};

// Expose matchmaking service for socket handler
exports.matchmakingService = matchmaking;
