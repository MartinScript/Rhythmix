const mongoose = require('mongoose');
const slugify = require('slugify');

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Track must have a title']
    },
    trackDuration: {
        type: Number,
    },
    uploadedAt: {
        type: Date,
        default: Date.now()
    },
    audioFile: {
        type: String,
        required: [true, 'Track must have an audio file']
    },
    trackImage: {
        type: String,
        default: 'default.jpeg',
    },
    players: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    artiste: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    features: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    }],
    slug: String
},
    {
        toJSON: { virtuals: true }, //enabling virtual properties
        toObject: { virtuals: true }
    }
);

// trackSchema.pre('save', function (next) {
//     this.slug = slugify(`${this.title}-${this.artiste.username}`, { lower: true });
//     next();
// });

// trackSchema.index({ artiste: 1, audioFile: 1 }, {
//     unique: true
// });

trackSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'artiste',
        select: 'username photo'
    })
    next();
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;