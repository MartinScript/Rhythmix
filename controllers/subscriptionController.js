const Subscription = require('../models/subscriptionModel');
const factory = require('./handlerFactory');

exports.getAllSubscriptions = factory.getAll(Subscription);
exports.getSubscription = factory.getOne(Subscription);
exports.deleteSubscription = factory.deleteOne(Subscription);
exports.updateSubscription = factory.updateOne(Subscription);