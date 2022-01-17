import mongoose from 'mongoose';
import logger from './logger.js';

const database = async() => {
    try {
        const DATABASE =
            process.env.NODE_ENV === 'test' ?
            process.env.DATABASE_TEST :
            process.env.DATABASE;


        await mongoose.connect(DATABASE, {
            useFindAndModify: false,
            useCreateIndex: true,
            autoIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('Connected to the database.');
    } catch (error) {
        logger.error('Could not connect to the database.', error);
    }
};
export default database;