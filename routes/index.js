//middleware about JWT Check
import JWTcheckMiddleware from '../middlewares/jwtDecode';
import cors from 'cors';

//import modules;
import express from 'express';
import account from './account';
import schedule from './schedule';
import vote from './vote';
import group from './group';

//Router setting
const router = express.Router();

//Account Router
router.use('/account', account);

//secret Router use JWT
router.use('/secret', JWTcheckMiddleware);

//Schedule Router
router.use('/secret/schedule', schedule);
//Vote Router
router.use('/secret/vote', vote);
//Group Router
router.use('/secret/group', group);

export default router;
