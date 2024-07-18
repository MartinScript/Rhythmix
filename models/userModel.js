const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: ['listener', 'artiste', 'admin'],
        default: 'listener'
    },
    subscription:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'Subscription'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide confirm your password'],
        validate: {
            //This only works on CREATE and SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password does not match'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    photo: {
        type: String,
        default: 'default.jpg'
    }
},
    {
        toJSON: { virtuals: true }, //enabling virtual properties
        toObject: { virtuals: true }
    }
);

// Middleware function to handle album assignment based on user role.
//  * If the user role is not 'artiste', the album field is set to undefined.
// userSchema.pre('save', async function (next) {
//     if (this.role !== 'artiste') {
//         this.album = undefined;
//     }
//     next();
// });

userSchema.virtual('tracks', {
    ref: 'Track',
    foreignField: 'artiste',
    localField: '_id'
});

userSchema.virtual('albums', {
    ref: 'Album',
    foreignField: 'artiste',
    localField: '_id'
});

userSchema.virtual('playlists', {
    ref: 'Playlist',
    foreignField: 'user',
    localField: '_id'
});

userSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'subscription',
        select: '-__v -passwordChangedAt'
    })
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.pre('save', async function (next) {
    //Only run this function if password was modified
    if (!this.isModified('password')) {
        return next();
    }
    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next()
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    //false means not changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;