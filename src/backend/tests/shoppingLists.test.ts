import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import ShoppingList from '../models/shoppingLists';
import ShoppingListItem from '../models/shoppingListItems';
import Item from '../models/items';
import router from '../routes/shoppingListRoutes'; 

const app = express();
app.use(express.json());
app.use('/api/shoppingLists', router);

const TEST_IDS = {
  NOT_FOUND_ID: '000000000000000000000000',
  WRONG_FORMAT_ID: 'invalid-id',
} as const;

describe('ShoppingList API', () => {
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

  describe('GET /api/shoppingLists', () => {
    it('should get all shopping lists', async () => {
      await ShoppingList.create({ name: 'List 1', description: 'Description 1' });
      await ShoppingList.create({ name: 'List 2', description: 'Description 2' });

      const response = await request(app).get('/api/shoppingLists');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('List 1');
      expect(response.body[1].name).toBe('List 2');
    });
  });

  describe('GET /api/shoppingLists/:id', () => {
    it('should return a shopping list by ID', async () => {
      const list = await ShoppingList.create({ name: 'Test List', description: 'Test Description' });
      
      const response = await request(app).get(`/api/shoppingLists/${list._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test List');
    });

    it('should return 400 for invalid shopping list ID', async () => {
      const response = await request(app).get(`/api/shoppingLists/${TEST_IDS.WRONG_FORMAT_ID}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid shopping list ID');
    });

    it('should return 404 for non-existent shopping list', async () => {
      const response = await request(app).get(`/api/shoppingLists/${TEST_IDS.NOT_FOUND_ID}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Shopping List not found');
    });
  });

  describe('POST /api/shoppingLists', () => {
    it('should create a new shopping list', async () => {
      const payload = { name: 'New List', description: 'New Description' };

      const response = await request(app).post('/api/shoppingLists').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(payload.name);
      expect(response.body.description).toBe(payload.description);
    });

    it('should return 400 when name is missing', async () => {
      const payload = { description: 'Missing name' };

      const response = await request(app).post('/api/shoppingLists').send(payload);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required');
    });
  });

  describe('PATCH /api/shoppingLists/:id', () => {
    it('should update an existing shopping list', async () => {
      const list = await ShoppingList.create({ name: 'Old Name', description: 'Old Description' });

      const response = await request(app)
        .patch(`/api/shoppingLists/${list._id}`)
        .send({ name: 'Updated Name', description: 'Updated Description' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });

    it('should return 400 for invalid shopping list ID', async () => {
      const response = await request(app)
        .patch(`/api/shoppingLists/${TEST_IDS.WRONG_FORMAT_ID}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid shopping list ID');
    });

    it('should return 404 for non-existent shopping list', async () => {
      const response = await request(app)
        .patch(`/api/shoppingLists/${TEST_IDS.NOT_FOUND_ID}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Shopping List not found');
    });
  });

  describe('DELETE /api/shoppingLists/:id', () => {
    it('should delete a shopping list', async () => {
      const list = await ShoppingList.create({ name: 'List to delete', description: 'To be deleted' });

      const response = await request(app).delete(`/api/shoppingLists/${list._id}`);

      expect(response.status).toBe(204);
    });

    it('should return 400 for invalid shopping list ID', async () => {
      const response = await request(app).delete(`/api/shoppingLists/${TEST_IDS.WRONG_FORMAT_ID}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid shopping list ID');
    });

    it('should return 404 for non-existent shopping list', async () => {
      const response = await request(app).delete(`/api/shoppingLists/${TEST_IDS.NOT_FOUND_ID}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Shopping List not found');
    });
  });

  describe('GET /api/shoppingLists/search', () => {
    it('should return matching shopping lists for query', async () => {
      await ShoppingList.create({ name: 'List Alpha', description: 'Description Alpha' });
      await ShoppingList.create({ name: 'List Beta', description: 'Description Beta' });

      const response = await request(app).get('/api/shoppingLists/search?query=Alpha');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('List Alpha');
    });

    it('should return 400 if query parameter is missing', async () => {
      const response = await request(app).get('/api/shoppingLists/search');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Query parameter is required');
    });
  });
});
