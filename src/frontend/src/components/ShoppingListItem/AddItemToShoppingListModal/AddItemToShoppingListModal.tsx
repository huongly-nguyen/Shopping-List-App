import React, { useState, useEffect } from 'react';
import './AddItemToShoppingListModal.css';

interface Item {
  _id: string;
  name: string;
}

interface AddItemToShoppingListProps {
  onClose: () => void;
  onSubmit: (itemId: string, quantity: number) => void;
}

const AddItemToShoppingListModal: React.FC<AddItemToShoppingListProps> = ({ onClose, onSubmit }) => {
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchAvailableItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items'); 
        if (!response.ok) {
          throw new Error('Failed to fetch available items');
        }
        const data = await response.json();
        setAvailableItems(data);
      } catch (error) {
        console.error('Error fetching available items:', error);
      }
    };

    fetchAvailableItems();
  }, []);

  const handleSubmit = () => {
    if (selectedItemId && quantity > 0) {
      onSubmit(selectedItemId, quantity);
      onClose();
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h4>Add Item</h4>
        <label>
          Item:
          <select onChange={(e) => setSelectedItemId(e.target.value)} value={selectedItemId}>
            <option value="">Select Item</option>
            {availableItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
          />
        </label>
        <button onClick={handleSubmit}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddItemToShoppingListModal;
