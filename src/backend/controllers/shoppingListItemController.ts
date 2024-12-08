import express, { Request, Response } from 'express';
import ShoppingList from '../models/shoppingLists';
import Item from '../models/items';
import ShoppingListItem from '../models/shoppingListItems';
import mongoose from 'mongoose';

const handleErrors = (err: unknown, res: Response) => {
  console.error(err);
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addItemToShoppingList = async (req: Request, res: Response) => {
  try {    
    const { shoppingListId } = req.params;
    const { itemId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(shoppingListId)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    }

    if (!shoppingListId || !itemId || !quantity) {
      res.status(400).json({ error: 'shoppingListId, itemId, and quantity are required' });
      return;
    }

    const shoppingListExists = await ShoppingList.findById(shoppingListId);
    if (!shoppingListExists) {
      res.status(404).json({ error: 'Shopping List not found' });
      return;
    }

    const itemExists = await Item.findById(itemId);
    if (!itemExists) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const existingItem = await ShoppingListItem.findOne({ shoppingListId, itemId });
    if (existingItem) {
      res.status(400).json({ error: 'Item already exists in the shopping list' });
      return;
    }

    const newShoppingListItem = new ShoppingListItem({
      shoppingListId,
      itemId,
      quantity,
      status: false, 
    });

    const savedItem = await newShoppingListItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const removeItemFromShoppingList = async (req: Request, res: Response) => {
  const { shoppingListId, itemId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(shoppingListId)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    }

    if (!shoppingListId || !itemId) {
      res.status(400).json({ error: 'shoppingListId and itemId are required' });
      return;
    }

    const existingItem = await ShoppingListItem.findOne({ shoppingListId, itemId });
    if (!existingItem) {
      res.status(404).json({ error: 'Item not found in the shopping list' });
      return;
    }

    await existingItem.deleteOne();
    res.status(200).json({ message: 'Item removed from shopping list' });
  } catch (err) {
    handleErrors(err, res);
  }
};

export const updateShoppingListItem = async (req: Request, res: Response) => {
  const { shoppingListId, itemId } = req.params;
  const { quantity, status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(shoppingListId)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    }

    if (!shoppingListId || !itemId) {
      res.status(400).json({ error: 'shoppingListId and itemId are required' });
      return;
    }

    const existingItem = await ShoppingListItem.findOne({ shoppingListId, itemId });
    if (!existingItem) {
      res.status(404).json({ error: 'Item not found in the shopping list' });
      return; 
    }

    if (quantity !== undefined) existingItem.quantity = quantity;
    if (status !== undefined) existingItem.status = status;

    const updatedItem = await existingItem.save();
    res.status(200).json(updatedItem);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getItemsInShoppingList = async (req: Request, res: Response) => {
  const { shoppingListId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(shoppingListId)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }

    if (!shoppingListId) {
      res.status(400).json({ error: 'shoppingListId is required' });
      return;
    }

    const shoppingListExists = await ShoppingList.findById(shoppingListId);
    if (!shoppingListExists) {
      res.status(404).json({ error: 'Shopping List not found' });
      return;
    }

    const items = await ShoppingListItem.find({ shoppingListId }).populate('itemId');
    res.status(200).json(items);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const updateShoppingListItemStatus = async (req: Request, res: Response) => {
  const { shoppingListId, itemId } = req.params;
  const { status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(shoppingListId)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    }

    if (!shoppingListId || !itemId) {
      res.status(400).json({ error: 'shoppingListId and itemId are required' });
      return;
    }

    const existingItem = await ShoppingListItem.findOne({ shoppingListId, itemId });
    if (!existingItem) {
      res.status(404).json({ error: 'Item not found in the shopping list' });
      return;
    }

    if (status !== undefined) existingItem.status = status;

    const updatedItem = await existingItem.save();
    res.status(200).json(updatedItem);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const updateShoppingListItemQuantity = async (req: Request, res: Response) => {
  const { shoppingListId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(shoppingListId)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    }
    
    if (!shoppingListId || !itemId) {
      res.status(400).json({ error: 'shoppingListId and itemId are required' });
      return;
    }

    const existingItem = await ShoppingListItem.findOne({ shoppingListId, itemId });
    if (!existingItem) {
      res.status(404).json({ error: 'Item not found in the shopping list' });
      return;
    }

    if (quantity !== undefined) existingItem.quantity = quantity;

    const updatedItem = await existingItem.save();
    res.status(200).json(updatedItem);
  } catch (err) {
    handleErrors(err, res);
  }
};
