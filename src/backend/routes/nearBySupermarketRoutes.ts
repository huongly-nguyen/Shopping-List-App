import express from 'express';
import {getAllNearBySupermarkets} from '../controllers/nearBySupermarketController';

const router = express.Router();

router.get('/', getAllNearBySupermarkets);

export default router;
