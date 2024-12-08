import mongoose, { Document, Schema, Model } from 'mongoose';

/** Interface for ShoppingList */
export interface IShoppingList extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
}

/** Schema for ShoppingList */
const shoppingListSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

/** Model for ShoppingList */
const ShoppingList: Model<IShoppingList> = mongoose.model<IShoppingList>('ShoppingList', shoppingListSchema);
export default ShoppingList;
