const Album = require('../models/albumModel');
const factory = require('./handlerFactory');

exports.getAllAlbums = factory.getAll(Album);
exports.getAlbum = factory.getOne(Album);
exports.deleteAlbum = factory.deleteOne(Album);
exports.updateAlbum = factory.updateOne(Album);