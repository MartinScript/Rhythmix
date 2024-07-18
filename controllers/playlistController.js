const Playlist = require('../models/playlistModel');
const factory = require('./handlerFactory');

exports.getAllPlaylists = factory.getAll(Playlist);
exports.getPlaylist = factory.getOne(Playlist);
exports.deletePlaylist = factory.deleteOne(Playlist);
exports.updatePlaylist = factory.updateOne(Playlist);