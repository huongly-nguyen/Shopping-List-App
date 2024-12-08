import express from 'express';
import {
  addItemToShoppingList,
  removeItemFromShoppingList,
  updateShoppingListItemStatus,
  getItemsInShoppingList,
  updateShoppingListItemQuantity,
} from '../controllers/shoppingListItemController';

const router = express.Router();

router.post('/:shoppingListId', addItemToShoppingList); 
router.delete('/:shoppingListId/:itemId', removeItemFromShoppingList); 
router.patch('/:shoppingListId/:itemId/status', updateShoppingListItemStatus); 
router.patch('/:shoppingListId/:itemId/quantity', updateShoppingListItemQuantity); 
router.get('/:shoppingListId', getItemsInShoppingList); 

export default router;
