const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`);
    next();
});

const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    try {
        // Create error if user posts password
        if (req.body.password || req.body.passwordConfirm) {
            return next(new AppError('This route is not for password updates. Please use /updateMyPassword instead.', 400));
        }

        // Filter unwanted field names not allowed to be updated
        const filteredBody = filteredObj(req.body, 'name', 'email');
        if (req.file) filteredBody.photo = req.file.filename;

        // Debugging logs
        console.log('Filtered Body:', filteredBody);
        console.log('User ID:', req.user.id);

        // Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        // Debugging logs
        console.log('Updated User:', updatedUser);

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            }
        });
    } catch (error) {
        // Handle and log the error
        console.error('Error in updateMe:', error);
        next(error);
    }
});


exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(200).json({
        status: 'success',
        data: null
    })
})
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, ['tracks', 'albums', 'playlists']);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);

exports.createUser = (req, res) => {
    res.status(500).json({ status: 'error', message: 'this url is not defined, Please use /signup instead' });
};