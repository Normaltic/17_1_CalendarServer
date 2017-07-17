//middleware about JWT Check
import JWTcheckMiddleware from '../middlewares/jwtDecode';

//import modules;
import express from 'express';
import account from './account';
import schedule from './schedule';
import vote from './vote';

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

export default router;
