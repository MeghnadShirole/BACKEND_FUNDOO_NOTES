import express from 'express';
const router = express.Router();

import userRoute from './user.route.js';
import noteRoute from './note.routes.js'
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {
    router.get('/', (req, res) => {
        res.json('Welcome To FundooNotes App');
    });
    router.use('/users', userRoute);
    router.use('/notes', noteRoute);

    return router;
};

export default routes;