const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('Uncaught Exception, Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');
dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE_LOCAL;


mongoose.connect(DB, {
    // connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>
    console.log('connection was successfully established'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`listening on ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection, Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

