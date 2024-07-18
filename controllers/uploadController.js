const multer = require('multer');
const AppError = require('../utils/appError');
const multerStorage = multer.memoryStorage();

// File filter function to restrict file types
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('audio')) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file format! Please upload Track file.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

// Middleware to handle multiple file uploads
exports.uploadAudioFile = upload.single('audioFile');
// exports.uploadAudioFile = uploadAudio.single('audioFile');
// exports.uploadTrackFiles = upload.fields([
//     { name: 'trackImage', maxCount: 1 },
//     { name: 'audioFile', maxCount: 1 }
// ]);

exports.handleAudioFile = async (req, res, next) => {
    console.log(req.file);
    try {
        if (!req.file) {
            return next(new AppError('Please upload both an audio file.', 400));
        }
        // Extract the file buffers
        if (req.file.fieldname === 'audioFile') {
            audioBuffer = req.file.buffer;
        }

        // Define custom filenames
        const trackName = `track--${Date.now()}.mp3`;
        req.body.audioFile = trackName;
    } catch (err) {
        console.error(err);
    }
    next();
};
