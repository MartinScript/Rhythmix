const { faker } = require('@faker-js/faker');
const slugify = require('slugify');
const fs = require('fs').promises;
const path = require('path');
const Track = require('../../models/trackModel');
const User = require('../../models/userModel');
const Album = require('../../models/albumModel');
const Playlist = require('../../models/playlistModel');
const Subscription = require('../../models/subscriptionModel');

const filePath = path.join(__dirname, '../uploads/audio');
const password = 'test1234';

const getRandomElements = (array, count) => {
    if (!array || !Array.isArray(array)) {
        throw new Error('Expected an array');
    }
    return array.sort(() => 0.5 - Math.random()).slice(0, count);
};

const getArtistes = (users) => users.filter(user => user.role === 'artiste');

const getListeners = (users) => users.filter(user => user.role === 'listener');

// Asynchronous function to list all files in a directory
const listFilesAsync = async (dirPath, fileList = []) => {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            await listFilesAsync(filePath, fileList); // Recursively list files in subdirectories
        } else {
            fileList.push(filePath);
        }
    }

    return fileList;
};

const getAudioFiles = async (dirPath) => {
    const audioList = [];
    const files = await listFilesAsync(dirPath); // Await the async function
    files.forEach((file) => {
        if (file.endsWith('.mp3')) {
            audioList.push(file);
        }
    });
    return audioList;
};

const generateUniqueSlug = async (title) => {
    let slug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = slug;
    let counter = 1;

    while (await Track.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
};

const generateRandomUser = (subscriptionId) => {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        role: getRandomElements(['listener', 'artiste', 'admin'], 1)[0],
        subscription: subscriptionId,
        password,
        passwordConfirm: password,
        photo: faker.image.avatarLegacy()
    };
};

const generateRandomSubscription = (userId) => {
    return {
        category: getRandomElements(['Premium', 'Basic', 'Free']),
        user: userId,
        price: faker.number.int({ min: 5, max: 20 }),
        paid: faker.datatype.boolean(),
        duration: getRandomElements([30, 360], 1)
    };
};

const generateRandomAlbum = (artisteId, tracks) => {
    const numTracks = faker.number.int({ min: 1, max: Math.min(10, tracks.length) });
    return {
        title: faker.lorem.words(3),
        artiste: artisteId,
        releaseDate: faker.date.past(),
        tracks: getRandomElements(tracks, numTracks)
    };
};

const generateRandomPlaylist = (user, tracks) => {
    const numTracks = faker.number.int({ min: 1, max: Math.min(10, tracks.length) });
    return {
        name: faker.lorem.words(3),
        user: user,
        description: faker.lorem.paragraph(),
        tracks: getRandomElements(tracks, numTracks)
    };
};

const generateRandomTrack = async (artiste, listeners, features, audioFiles) => {
    if (audioFiles.length === 0) {
        throw new Error('No audio files available');
    }
    const numPlayers = faker.number.int({ min: 1, max: Math.min(10, listeners.length) });
    const numFeatures = faker.number.int({ min: 1, max: Math.min(5, features.length) });
    const title = faker.music.songName();
    const slug = await generateUniqueSlug(title);
    return {
        title: title,
        slug: slug,
        artiste: artiste,
        uploadedAt: faker.date.past(),
        audioFile: audioFiles.pop(), // Ensure this line doesn't exhaust audioFiles too quickly
        trackImage: faker.image.url(),
        players: getRandomElements(listeners, numPlayers),
        features: getRandomElements(features, numFeatures)
    };
};

// Insert random data into the database
exports.insertRandomData = async (numData) => {
    try {
        // Insert random users
        const users = [];
        for (let i = 0; i < numData; i++) {
            users.push(generateRandomUser());
        }

        await User.create(users);
        const insertedUsers = await User.find();
        console.log(`${numData} random users inserted`);
        // console.log(insertedUsers);

        // Load audio files once
        const audioFiles = await getAudioFiles(filePath);


        // Insert random tracks
        const tracks = [];
        const artistes = getArtistes(insertedUsers);
        const listeners = getListeners(insertedUsers);
        // console.log(artistes);
        // console.log(listeners);
        for (let i = 0; i < numData; i++) {
            const randomArtiste = artistes[Math.floor(Math.random() * artistes.length)];
            tracks.push(await generateRandomTrack(randomArtiste, listeners, artistes, audioFiles));
        }

        const insertedTracks = await Track.create(tracks);
        console.log(`${numData} random tracks inserted`);

        // Insert random albums
        const albums = [];
        artistes.forEach(artiste => {
            const albumTracks = insertedTracks.filter(track => track.artiste === artiste);
            console.log(albumTracks);
            if (albumTracks.length > 0) {
                albums.push(generateRandomAlbum(artiste, albumTracks));
            }
        });
        await Album.create(albums);
        console.log(`${albums.length} random albums inserted`);

        // Insert random playlists
        const playlists = [];
        listeners.forEach(listener => {
            playlists.push(generateRandomPlaylist(listener._id, insertedTracks));
        });
        await Playlist.create(playlists);
        console.log(`${playlists.length} random playlists inserted`);
    } catch (err) {
        console.error('Error inserting data:', err);
    }
};
