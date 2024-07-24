const Track = require('../models/trackModel');
const Playlist = require('../models/playlistModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.alerts = (req, res, next) => {
//     const { alert } = req.query;
//     if (alert === 'booking')
//         res.locals.alert =
//             "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
//     next();
// };

exports.getPlaylist = catchAsync(async (req, res, next) => {
    // 1) Get track data from collection
    const tours = await Playlist.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Playlist',
        playlist
    });
});

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tracks from collection
    const tracks = await Track.find().populate({
        path: 'artiste',
        select: 'username photo'
    });
    const playlists = await Playlist.find().populate({ path: 'user' });
    const users = await User.find();
    const artistes = users.filter(user => user.role === 'artiste');

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('index', {
        title: 'All Tours',
        tracks,
        playlists,
        artistes
    });
});

exports.getTrack = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Track.findById(req.params.id).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!track) {
        return next(new AppError('There is no track with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render('track', {
        title: `${track.title}`,
        track
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});
