const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/enqueue', authenticate, queueController.enqueue);
router.post('/cancel', authenticate, queueController.cancel);

module.exports = router;
