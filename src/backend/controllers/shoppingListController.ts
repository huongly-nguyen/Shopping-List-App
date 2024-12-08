import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import ShoppingList from '../models/shoppingLists';
import ShoppingListItem from '../models/shoppingListItems';
import Item from '../models/items';

const handleErrors = (err: unknown, res: Response) => {
  console.error(err);
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const router = express.Router();

export const getAllShoppingLists = async (req: Request, res: Response) => {
  try {
    const shoppingLists = await ShoppingList.find();
    res.json(shoppingLists);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getShoppingListById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }
    const shoppingList = await ShoppingList.findById(id);
    if (!shoppingList) {
      res.status(404).json({ message: 'Shopping List not found' });
      return;
    }
    res.json(shoppingList);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const createShoppingList = async (req: Request, res: Response) => {
  try {
    const { name, description} = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const shoppingList = new ShoppingList({
      name,
      description
    });

    const newShoppingList = await shoppingList.save();
    res.status(201).json(newShoppingList);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const updateShoppingList = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }
    const { name, description} = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const updatedData = {
      name,
      description
    };

    const updatedShoppingList = await ShoppingList.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedShoppingList) {
      res.status(404).json({ message: 'Shopping List not found' });
      return;
    }
    res.json(updatedShoppingList);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const deleteShoppingList = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid shopping list ID' });
      return;
    }
    const deletedShoppingList = await ShoppingList.findByIdAndDelete(id);
    if (!deletedShoppingList) {
      res.status(404).json({ message: 'Shopping List not found' });
      return;
    }
    res.status(204).json({ message: 'ShoppingList deleted' });
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getShoppingListsByItem = async (req: Request, res: Response): Promise<void> => {
  const { itemId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    }
    const itemExists = await Item.findById(itemId);
    if (!itemExists) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    const shoppingListItems = await ShoppingListItem.find({ itemId });

    if (!shoppingListItems || shoppingListItems.length === 0) {
      res.status(200).json([]);       
      return;
    }

    const shoppingListIds = shoppingListItems.map(item => item.shoppingListId);

    const shoppingLists = await ShoppingList.find({ '_id': { $in: shoppingListIds } });

    res.json(shoppingLists);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const searchShoppingLists = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  if (!query) {
    res.status(400).json({ message: 'Query parameter is required' });
    return;
  }

  try {
    const shoppingLists = await ShoppingList.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, 
        { description: { $regex: query, $options: 'i' } }, 
      ],
    });

    if (!shoppingLists || shoppingLists.length === 0) {
      res.status(200).json([]); 
      return;
    }

    res.json(shoppingLists); 
  } catch (err) {
    handleErrors(err, res); 
  }
};

export default router;
