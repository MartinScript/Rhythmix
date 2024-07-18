const express = require('express');
const trackController = require('../controllers/trackController');
const uploadController = require('../controllers/uploadController');

const router = express.Router({ mergeParams: true });

router.route('/').get(trackController.getAllTracks);
router.route('/uploadTrack').post(uploadController.uploadAudioFile, uploadController.handleAudioFile, trackController.createTrack);

router.route('/tour-stats').get(trackController.getTrackStats);

router.route('/:id')
    .get(trackController.getTrack)
    .patch(trackController.updateTrack)
    .delete(trackController.deleteTrack);

module.exports = router;
