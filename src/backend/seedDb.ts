import mongoose from 'mongoose';
import connectDB from '../config/database';
import Item from './models/items'; 
import ShoppingList from './models/shoppingLists';
import ShoppingListItem from './models/shoppingListItems';

// Function to seed the database with sample data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    connectDB();

    // Clear existing data from collections
    await Item.deleteMany({});
    await ShoppingList.deleteMany({});
    await ShoppingListItem.deleteMany({});
    console.log('Cleared existing data');

    // Seed data into `items` collection
    const items = await Item.insertMany([
      { name: 'Apples', description: 'Fresh red apples' },
      { name: 'Bananas', description: 'Ripe bananas' },
      { name: 'Carrots', description: 'Crunchy carrots' },
      { name: 'Bread', description: 'Whole grain bread' },
      { name: 'Milk', description: '1-liter organic milk' },
      { name: 'Eggs', description: 'Free-range eggs, pack of 12' },
      { name: 'Chicken', description: 'Fresh chicken breast' },
      { name: 'Rice', description: 'Basmati rice, 5kg bag' },
      { name: 'Tomatoes', description: 'Juicy tomatoes' },
      { name: 'Potatoes', description: 'Starchy potatoes, 3kg bag' },
    ]);
    console.log('Inserted items:', items);

    // Seed data into `shoppingLists` collection
    const shoppingLists = await ShoppingList.insertMany([
      { name: 'Weekly Groceries', description: 'Groceries for the week' },
      { name: 'Party Supplies', description: 'Items for the birthday party' },
      { name: 'Camping Trip', description: 'Essentials for camping trip' },
      { name: 'Holiday Feast', description: 'Special items for holiday dinner' },
      { name: 'Quick Snacks', description: 'Snacks and beverages for guests' },
    ]);
    console.log('Inserted shopping lists:', shoppingLists);

    // Seed data into `shoppingListItems` collection
    const shoppingListItems = await ShoppingListItem.insertMany([
      {
        shoppingListId: shoppingLists[0]._id,
        itemId: items[0]._id,
        quantity: 5,
        status: false,
      },
      {
        shoppingListId: shoppingLists[0]._id,
        itemId: items[1]._id,
        quantity: 10,
        status: true,
      },
      {
        shoppingListId: shoppingLists[0]._id,
        itemId: items[2]._id,
        quantity: 3,
        status: false,
      },
      {
        shoppingListId: shoppingLists[1]._id,
        itemId: items[3]._id,
        quantity: 2,
        status: false,
      },
      {
        shoppingListId: shoppingLists[1]._id,
        itemId: items[4]._id,
        quantity: 6,
        status: false,
      },
      {
        shoppingListId: shoppingLists[2]._id,
        itemId: items[5]._id,
        quantity: 12,
        status: true,
      },
      {
        shoppingListId: shoppingLists[2]._id,
        itemId: items[6]._id,
        quantity: 4,
        status: false,
      },
      {
        shoppingListId: shoppingLists[3]._id,
        itemId: items[7]._id,
        quantity: 1,
        status: false,
      },
      {
        shoppingListId: shoppingLists[3]._id,
        itemId: items[8]._id,
        quantity: 8,
        status: false,
      },
      {
        shoppingListId: shoppingLists[4]._id,
        itemId: items[9]._id,
        quantity: 15,
        status: true,
      },
    ]);
    console.log('Inserted shopping list items:', shoppingListItems);

    // Close the connection after seeding
    mongoose.connection.close();
    console.log('Database seed completed');
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

seedDatabase();
