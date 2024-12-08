import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import Item from '../models/items';
import ShoppingList from '../models/shoppingLists';
import ShoppingListItem from '../models/shoppingListItems';
import router from '../routes/statisticsRoutes';

const app = express();
app.use(express.json());
app.use('/api/statistics', router);

describe('Statistics API', () => {
  let shoppingListId1: mongoose.Types.ObjectId; 
  let shoppingListId2: mongoose.Types.ObjectId; 
  let itemId1: mongoose.Types.ObjectId;
  let itemId2: mongoose.Types.ObjectId;

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
    await Item.deleteMany({});
    await ShoppingListItem.deleteMany({});
  });

  describe('GET /api/statistics/totalShoppingLists', () => {
    it('should return total shopping lists', async () => {
      await ShoppingList.create({ name: 'Test Shopping List 1' });
      await ShoppingList.create({ name: 'Test Shopping List 2' });

      const response = await request(app).get('/api/statistics/totalShoppingLists');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalShoppingLists');
      expect(response.body.totalShoppingLists).toBe(2);  
    });
  });

  describe('GET /api/statistics/totalItems', () => {
    it('should return total items', async () => {
      await Item.create({ name: 'Test Item 1' });
      await Item.create({ name: 'Test Item 2' });

      const response = await request(app).get('/api/statistics/totalItems');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalItems');
      expect(response.body.totalItems).toBe(2);  
    });
  });

  describe('GET /api/statistics/purchasedItems', () => {
    it('should return number of purchased items', async () => {
      const shoppingList = await ShoppingList.create({ name: 'Test Shopping List' });
      const item1 = await Item.create({ name: 'Test Item 1' });
      const item2 = await Item.create({ name: 'Test Item 2' });

      shoppingListId1 = shoppingList._id as mongoose.Types.ObjectId; 
      itemId1 = item1._id as mongoose.Types.ObjectId;                
      itemId2 = item2._id as mongoose.Types.ObjectId;  

      await ShoppingListItem.create({
        shoppingListId: shoppingListId1,
        itemId: itemId1,
        quantity: 2,
        status: true,
      });
      await ShoppingListItem.create({
        shoppingListId: shoppingListId1,
        itemId: itemId2,
        quantity: 3,
        status: false,
      });

      const response = await request(app).get('/api/statistics/purchasedItems');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('purchasedItems');
      expect(response.body.purchasedItems).toBe(1);  
    });
  });

  describe('GET /api/statistics/pendingItems', () => {
    it('should return number of pending items', async () => {
      const shoppingList = await ShoppingList.create({ name: 'Test Shopping List' });
      const item1 = await Item.create({ name: 'Test Item 1' });
      const item2 = await Item.create({ name: 'Test Item 2' });

      shoppingListId1 = shoppingList._id as mongoose.Types.ObjectId; 
      itemId1 = item1._id as mongoose.Types.ObjectId;                
      itemId2 = item2._id as mongoose.Types.ObjectId;

      await ShoppingListItem.create({
        shoppingListId: shoppingListId1,
        itemId: itemId1,
        quantity: 5,
        status: false,
      });
      await ShoppingListItem.create({
        shoppingListId: shoppingListId1,
        itemId: itemId2,
        quantity: 2,
        status: true,
      });

      const response = await request(app).get('/api/statistics/pendingItems');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pendingItems');
      expect(response.body.pendingItems).toBe(1); 
    });
  });

  describe('GET /api/statistics/pendingItemsList', () => {
    it('should return a list of pending items with correct quantities', async () => {
      const shoppingList1 = await ShoppingList.create({ name: 'Test Shopping List 1' });
      const shoppingList2 = await ShoppingList.create({ name: 'Test Shopping List 2' });
      const item1 = await Item.create({ name: 'Test Item' });

      shoppingListId1 = shoppingList1._id as mongoose.Types.ObjectId; 
      shoppingListId2 = shoppingList2._id as mongoose.Types.ObjectId; 
      itemId1 = item1._id as mongoose.Types.ObjectId;                

      await ShoppingListItem.create({
        shoppingListId: shoppingListId1,
        itemId: itemId1,
        quantity: 5,
        status: false,
      });
      await ShoppingListItem.create({
        shoppingListId: shoppingListId2,
        itemId: itemId1,
        quantity: 3,
        status: false,
      });

      const response = await request(app).get('/api/statistics/pendingItemsList');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pendingItems');
      expect(Array.isArray(response.body.pendingItems)).toBe(true);

      const pendingItem = response.body.pendingItems.find((item: any) => item.itemId === itemId1.toString());

      expect(pendingItem).toHaveProperty('totalQuantity');
      expect(pendingItem.totalQuantity).toBe(8);  
    });
  });

  describe('Error handling', () => {
    it('should return 404 for an unknown route', async () => {
      const response = await request(app).get('/api/statistics/unknown');
      expect(response.status).toBe(404);
    });
  });
});
