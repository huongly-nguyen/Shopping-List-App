import express, { Request, Response } from 'express';
import Item from '../models/items';
import ShoppingList from '../models/shoppingLists';
import ShoppingListItem from '../models/shoppingListItems';

const handleErrors = (err: unknown, res: Response) => {
  console.error(err);
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTotalShoppingLists = async (req: Request, res: Response) => {
  try {
    const totalLists = await ShoppingList.countDocuments();
    res.status(200).json({ totalShoppingLists: totalLists });
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getTotalItems = async (req: Request, res: Response) => {
  try {
    const totalItems = await Item.countDocuments();
    res.status(200).json({ totalItems });
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getNumberOfPurchasedItems = async (req: Request, res: Response) => {
  try {
    const purchasedItems = await ShoppingListItem.countDocuments({ status: true });
    res.status(200).json({ purchasedItems });
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getNumberOfPendingItems = async (req: Request, res: Response) => {
  try {
    const pendingItems = await ShoppingListItem.countDocuments({ status: false });
    res.status(200).json({ pendingItems });
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getAllPendingItems = async (req: Request, res: Response) => {
  try {
    const pendingItems = await ShoppingListItem.aggregate([
      { $match: { status: false } },
      {
        $group: {
          _id: "$itemId",
          totalQuantity: { $sum: "$quantity" },
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "itemDetails"
        }
      },
      { $unwind: "$itemDetails" },
      {
        $project: {
          itemId: "$_id",
          itemName: "$itemDetails.name",
          totalQuantity: 1,
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    res.status(200).json({ pendingItems });
  } catch (err) {
    handleErrors(err, res);
  }
};
