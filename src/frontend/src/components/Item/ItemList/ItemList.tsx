import React, { useEffect, useState } from 'react';
import './ItemList.css';
import ItemDetail from '../ItemDetail/ItemDetail';
import AddItemModal from '../AddItemModal/AddItemModal'; 

interface Item {
  _id: number;
  name: string;
  description: string;
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false); 

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  const handleAddItem = (newItem: { name: string; description: string }) => {
    fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem), 
    })
      .then((response) => response.json())
      .then((data) => {
        setItems((prevItems) => [...prevItems, data]); 
        setIsAddModalOpen(false); 
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleSaveItem = (updatedItem: Item) => {
    fetch(`http://localhost:5000/api/items/${updatedItem._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === data._id ? { ...item, ...data } : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating item:', error);
      });
  };

  const handleDeleteItem = (id: number) => {
    fetch(`http://localhost:5000/api/items/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  return (
    <div className="item-list">
      <div className="header">
        <h1>List of all items</h1>
        <button className="add-item-btn" onClick={() => setIsAddModalOpen(true)}>
          Add Item
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <div key={item._id} className="item">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <button onClick={() => handleEditItem(item)}>✏️</button>
            <button onClick={() => handleDeleteItem(item._id)}>❌</button>
          </div>
        ))}
      </ul>

      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={handleSaveItem}
        />
      )}

      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddItem}
        />
      )}
    </div>
  );
};

export default ItemList;
