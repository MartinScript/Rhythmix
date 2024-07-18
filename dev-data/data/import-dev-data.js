const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Track = require('../../models/trackModel');
const Album = require('../../models/albumModel');
const Playlist = require('../../models/playlistModel');
const Subscription = require('../../models/subscriptionModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE_LOCAL;


mongoose.connect(DB, {
    // connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>
    console.log('connection was successfully established'));

const tracks = JSON.parse(fs.readFileSync(`${__dirname}/tracks.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const albums = JSON.parse(fs.readFileSync(`${__dirname}/albums.json`, 'utf-8'));
const playlists = JSON.parse(fs.readFileSync(`${__dirname}/playlists.json`, 'utf-8'));
const subscriptions = JSON.parse(fs.readFileSync(`${__dirname}/subscriptions.json`, 'utf-8'));

//IMPORT DATA
const importData = async () => {
    try {
        await Track.create(tracks);
        await User.create(users, { validateBeforeSave: false });
        await Album.create(albums);
        await Playlist.create(playlists);
        await Subscription.create(subscriptions);
        console.log('Data successfully created');
    } catch (err) {
        console.log(err);
    };
    process.exit();
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Track.deleteMany();
        await Playlist.deleteMany();
        await Album.deleteMany();
        await Subscription.deleteMany();
        await User.deleteMany();
        console.log('Data successfully deleted');

    } catch (err) {
        console.log(err);
    };
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
};