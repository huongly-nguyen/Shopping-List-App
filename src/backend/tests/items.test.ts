import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import Item from '../models/items';
import router from '../routes/itemRoutes';

const app = express();
app.use(express.json());
app.use('/api/items', router);

const TEST_IDS = {
  NOT_FOUND_ID: '000000000000000000000000',
  WRONG_FORMAT_ID: 'invalid-id',
} as const;

describe('Item API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testShoppingListApp', {});
  });

  afterAll(async () => {
    await Item.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Item.deleteMany({});
  });

  it('should create a new item', async () => {
    const response = await request(app).post('/api/items').send({
      name: 'Test Item',
      description: 'Test Description',
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Item');
    expect(response.body.description).toBe('Test Description');
  });

  it('should get all items', async () => {
    await Item.create({ name: 'Item 1', description: 'Description 1' });
    await Item.create({ name: 'Item 2', description: 'Description 2' });

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Item 1');
    expect(response.body[1].name).toBe('Item 2');
  });

  it('should get item by id', async () => {
    const item = await Item.create({ name: 'Test Item', description: 'Test Description' });

    const response = await request(app).get(`/api/items/${item._id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Item');
    expect(response.body.description).toBe('Test Description');
  });

  it('should return 400 for invalid item ID', async () => {
    const url = `/api/items/${TEST_IDS.WRONG_FORMAT_ID}`;
    const response = await request(app).get(url);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid item ID');
  });

  it('should return 404 for not found ID', async () => {
    const url = `/api/items/${TEST_IDS.NOT_FOUND_ID}`;
    const response = await request(app).get(url);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Item not found');
  });

  it('should update an item', async () => {
    const item = await Item.create({ name: 'Old Item', description: 'Old Description' });

    const response = await request(app)
      .patch(`/api/items/${item._id}`)
      .send({ name: 'Updated Item', description: 'Updated Description' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Item');
    expect(response.body.description).toBe('Updated Description');
  });

  it('should return 400 for invalid item ID to update', async () => {
    const url = `/api/items/${TEST_IDS.WRONG_FORMAT_ID}`;
    const response = await request(app)
      .patch(url)
      .send({ name: 'Updated Item', description: 'Updated Description' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid item ID');
  });

  it('should return 404 for invalid item ID to update', async () => {
    const url = `/api/items/${TEST_IDS.NOT_FOUND_ID}`;
    const response = await request(app)
      .patch(url)
      .send({ name: 'Updated Item', description: 'Updated Description' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Item not found');
  });

  it('should delete an item', async () => {
    const item = await Item.create({ name: 'Item to delete', description: 'Description to delete' });

    const response = await request(app).delete(`/api/items/${item._id}`);

    expect(response.status).toBe(204);
  });

  it('should return 400 for invalid item ID to delete', async () => {
    const url = `/api/items/${TEST_IDS.WRONG_FORMAT_ID}`;
    const response = await request(app).delete(url);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid item ID');
  });

  it('should return 404 for invalid item ID to delete', async () => {
    const url = `/api/items/${TEST_IDS.NOT_FOUND_ID}`;
    const response = await request(app).delete(url);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Item not found');
  });
});
