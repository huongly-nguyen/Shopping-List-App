import mongoose, { Document, Schema, Model } from 'mongoose';

/** Interface for Item */
export interface IItem extends Document {
  name: string;
  description?: string;
}

/** Schema for Item */
const itemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
});

/** Model for Item */
const Item: Model<IItem> = mongoose.model<IItem>('Item', itemSchema);
export default Item;
