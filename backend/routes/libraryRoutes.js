const express = require('express');
const { addGameToLibrary, getUserLibrary } = require('../controllers/libraryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/library/add', authMiddleware, addGameToLibrary);
router.get('/library/:userId', authMiddleware, getUserLibrary);

module.exports = router;
