const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Premium', 'Basic', 'Free'],
        required: [true, 'Subscription must belong to a category']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    price: {
        type: Number,
        required: [true, 'Subcription must have a price'],
    },
    paid: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    duration: {
        type: Number,
        required: [true, 'Subscription must have a duration'],
        default: 30
    }
});


const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;