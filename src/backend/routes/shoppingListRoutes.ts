import express from 'express';
import {
  getAllShoppingLists,
  getShoppingListById,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  getShoppingListsByItem,
  searchShoppingLists
} from '../controllers/shoppingListController';

const router = express.Router();

router.get('/search', searchShoppingLists);
router.get('/item/:itemId', getShoppingListsByItem);
router.get('/', getAllShoppingLists);
router.get('/:id', getShoppingListById);
router.post('/', createShoppingList);
router.patch('/:id', updateShoppingList);
router.delete('/:id', deleteShoppingList);



export default router;
