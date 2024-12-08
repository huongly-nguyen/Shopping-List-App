import mongoose, { Document, Schema, Model } from 'mongoose';

/** Interface for ShoppingListItem */
export interface IShoppingListItem extends Document {
  shoppingListId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  status: boolean;
}

/** Schema for ShoppingListItem */
const shoppingListItemSchema: Schema = new Schema({
  shoppingListId: { type: Schema.Types.ObjectId, ref: 'ShoppingList', required: true },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true },
  status: { type: Boolean, default: false },
});

/** Model for ShoppingListItem */
const ShoppingListItem: Model<IShoppingListItem> = mongoose.model<IShoppingListItem>('ShoppingListItem', shoppingListItemSchema);
export default ShoppingListItem;
