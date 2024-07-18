const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router({ mergeParams: true });

router.route('/').get(albumController.getAllAlbums);

router.route('/:id')
    .get(albumController.getAlbum)
    .patch(albumController.updateAlbum)
    .delete(albumController.deleteAlbum);

module.exports = router;