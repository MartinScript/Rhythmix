const Track = require('../models/trackModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createTrack = async (req, res, next) => {
    const newTrack = await Track.create({
        title: req.body.title,
        album: req.body.album,
        duration: req.body.duration,
        uploadedAt: Date.now(),
        audioFile: req.body.audioFile,
    });

    // Remove the buffer data before sending the response
    const responseTrack = {
        ...newTrack._doc,
        audioFile: undefined,
        trackImage: undefined
    };

    res.status(201).json({
        status: 'success',
        data: {
            track: responseTrack
        }
    });
};

exports.getAllTracks = factory.getAll(Track);
exports.getTrack = factory.getOne(Track);
exports.deleteTrack = factory.deleteOne(Track);
exports.updateTrack = factory.updateOne(Track);


exports.getTrackStats = catchAsync(async (req, res, next) => {
    const stats = await Track.aggregate([
        // {
        //     $match: { ratingsAverage: { $gte: 4.5 } }
        // },
        {
            $group: {
                numListeners: { $sum: '$players' },
                // numRatings: { $sum: '$ratingsQuantity' },
                // avgRating: { $avg: '$ratingsAverage' },
                // avgPrice: { $avg: '$price' },
                // minPrice: { $min: '$price' },
                // maxPrice: { $max: '$price' }
            }
        },
        // {
        //     $sort: { avgPrice: 1 }
        // }
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});
