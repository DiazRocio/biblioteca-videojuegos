const express = require('express');
const { getGames } = require('../controllers/gameController');

const router = express.Router();

router.get('/games', getGames);

module.exports = router;
