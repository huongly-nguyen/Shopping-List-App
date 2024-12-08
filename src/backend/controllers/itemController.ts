import express, { Request, Response } from 'express';
import Item from '../models/items';
import mongoose from 'mongoose';

const handleErrors = (err: unknown, res: Response) => {
  console.error(err);
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const router = express.Router();

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    }
    const item = await Item.findById(id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(item);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, description} = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const item = new Item({
      name,
      description
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid item ID' });
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

    const updatedItem = await Item.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(updatedItem);
  } catch (err) {
    handleErrors(err, res);
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid item ID' });
      return;
    } 
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.status(204).json({ message: 'Item deleted' });
  } catch (err) {
    handleErrors(err, res);
  }
};

export default router;
