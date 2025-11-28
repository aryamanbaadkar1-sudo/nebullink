const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload/image', authenticate, upload.single('image'), chatController.uploadFile);
router.post('/upload/voice', authenticate, upload.single('voice'), chatController.uploadFile);
router.get('/history/:roomId', authenticate, chatController.getHistory);
router.get('/partner/:roomId', authenticate, chatController.getPartner);

module.exports = router;
