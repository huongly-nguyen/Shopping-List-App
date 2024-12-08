import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import ShoppingList from '../models/shoppingLists';
import ShoppingListItem from '../models/shoppingListItems';
import Item from '../models/items';
import router from '../routes/shoppingListItemRoutes';

const app = express();
app.use(express.json());
app.use('/api/shoppingListItems', router);

const TEST_IDS = {
  NOT_FOUND_ID: '000000000000000000000000',
  WRONG_FORMAT_ID: 'invalid-id',
} as const;

describe('ShoppingListItems API', () => {
  let shoppingListId: mongoose.Types.ObjectId; 
  let itemId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testShoppingListApp', {});
  });

  afterAll(async () => {
    await ShoppingList.deleteMany({});
    await ShoppingListItem.deleteMany({});
    await Item.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await ShoppingList.deleteMany({});
    await ShoppingListItem.deleteMany({});
    await Item.deleteMany({});
  });

  describe('POST /api/shoppingListItems/:shoppingListId', () => {
    it('should add an item to a shopping list', async () => {
      const shoppingList = await ShoppingList.create({ name: 'List 1' });
      const item = await Item.create({ name: 'Item 1'});

      shoppingListId = shoppingList._id as mongoose.Types.ObjectId; 
      itemId = item._id as mongoose.Types.ObjectId;

      const response = await request(app)
        .post(`/api/shoppingListItems/${shoppingList._id}`)
        .send({ itemId: item._id, quantity: 2 });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        shoppingListId: shoppingListId.toString(),
        itemId: itemId.toString(),
        quantity: 2,
        status: false,
      });
    });

    it('should return 404 if shopping list is not found', async () => {
      const item = await Item.create({ name: 'Item 1'});

      const response = await request(app)
        .post(`/api/shoppingListItems/${TEST_IDS.NOT_FOUND_ID}`)
        .send({ itemId: item._id, quantity: 2 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Shopping List not found');
    });

    it('should return 400 for invalid shopping list ID format', async () => {
      const item = await Item.create({ name: 'Item 1'});

      const response = await request(app)
        .post(`/api/shoppingListItems/${TEST_IDS.WRONG_FORMAT_ID}`)
        .send({ itemId: item._id, quantity: 2 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid shopping list ID');
    });
  });

  describe('GET /api/shoppingListItems/:shoppingListId', () => {
    it('should get all items in a shopping list', async () => {
      const shoppingList = await ShoppingList.create({ name: 'List 1' });
      const item = await Item.create({ name: 'Item 1'});
      await ShoppingListItem.create({
        shoppingListId: shoppingList._id,
        itemId: item._id,
        quantity: 1,
      });

      const response = await request(app).get(`/api/shoppingListItems/${shoppingList._id}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].itemId.name).toBe('Item 1');
    });

    it('should return 404 if shopping list is not found', async () => {
      const response = await request(app).get(`/api/shoppingListItems/${TEST_IDS.NOT_FOUND_ID}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Shopping List not found');
    });
  });

  describe('DELETE /api/shoppingListItems/:shoppingListId/:itemId', () => {
    it('should remove an item from a shopping list', async () => {
      const shoppingList = await ShoppingList.create({ name: 'List 1' });
      const item = await Item.create({ name: 'Item 1'});
      const shoppingListItem = await ShoppingListItem.create({
        shoppingListId: shoppingList._id,
        itemId: item._id,
        quantity: 1,
      });

      const response = await request(app).delete(
        `/api/shoppingListItems/${shoppingList._id}/${item._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item removed from shopping list');
      const exists = await ShoppingListItem.findById(shoppingListItem._id);
      expect(exists).toBeNull();
    });

    it('should return 404 if item is not found in shopping list', async () => {
      const shoppingList = await ShoppingList.create({ name: 'List 1' });
      const item = await Item.create({ name: 'Item 1'});

      const response = await request(app).delete(
        `/api/shoppingListItems/${shoppingList._id}/${item._id}`
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found in the shopping list');
    });
  });

  describe('PATCH /api/shoppingListItems/:shoppingListId/:itemId/quantity', () => {
    it('should update the quantity of an item', async () => {
      const shoppingList = await ShoppingList.create({ name: 'List 1' });
      const item = await Item.create({ name: 'Item 1'});
      const shoppingListItem = await ShoppingListItem.create({
        shoppingListId: shoppingList._id,
        itemId: item._id,
        quantity: 1,
      });

      const response = await request(app)
        .patch(`/api/shoppingListItems/${shoppingList._id}/${item._id}/quantity`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(5);
    });

    it('should return 400 for invalid shopping list ID format', async () => {
      const item = await Item.create({ name: 'Item 1'});

      const response = await request(app)
        .patch(`/api/shoppingListItems/${TEST_IDS.WRONG_FORMAT_ID}/${item._id}/quantity`)
        .send({ quantity: 5 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid shopping list ID');
    });
  });
});
