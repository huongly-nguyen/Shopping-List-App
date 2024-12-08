import express from 'express';
import {
  getTotalShoppingLists,
  getTotalItems,
  getNumberOfPurchasedItems,
  getNumberOfPendingItems,
  getAllPendingItems
} from '../controllers/statisticsController';

const router = express.Router();

router.get('/totalShoppingLists', getTotalShoppingLists);
router.get('/totalItems', getTotalItems);
router.get('/purchasedItems', getNumberOfPurchasedItems);                        
router.get('/pendingItems', getNumberOfPendingItems);
router.get('/pendingItemsList', getAllPendingItems);

export default router;
