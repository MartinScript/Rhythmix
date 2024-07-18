const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

router.route('/').get(subscriptionController.getAllSubscriptions);

module.exports = router;