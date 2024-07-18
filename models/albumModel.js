const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Album must have a title']
    },
    artiste: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Album must have an artiste']
    },
    releaseDate: {
        type: Date,
        default: Date.now(),
        required: [true, 'Album must have a release date']
    },
    tracks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Track',
        required: [true, 'Track must have at least a track']
    }]
});

albumSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'tracks',
    })
    next();
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;