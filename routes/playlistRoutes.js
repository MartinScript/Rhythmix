const express = require('express');
const playlistController = require('../controllers/playlistController');

const router = express.Router({ mergeParams: true });

router.route('/').get(playlistController.getAllPlaylists);

router.route('/:id')
    .get(playlistController.getPlaylist)
    .patch(playlistController.updatePlaylist)
    .delete(playlistController.deletePlaylist);

module.exports = router;