const express = require('express');
const router = express.Router();
const merchController = require('../controllers/merchController');

router.get('/artist/:artistId', merchController.getMerchByArtistId);
router.post('/', merchController.createMerch);


module.exports = router;
