import React, { useState } from 'react';
import './ShoppingListDetail.css';

interface ShoppingListDetailProps {
  shoppingList: {
    _id: string;
    name: string;
    description: string;
    createdAt: Date; 
  };
  onClose: () => void;
  onSave: (updatedShoppingList: {
    _id: string;
    name: string;
    description: string;
    createdAt: Date; 
  }) => void;
}

const ShoppingListDetail: React.FC<ShoppingListDetailProps> = ({
  shoppingList,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(shoppingList.name);
  const [description, setDescription] = useState(shoppingList.description);

  const handleSubmit = () => {
    onSave({
      _id: shoppingList._id,
      name,
      description,
      createdAt: shoppingList.createdAt, 
    });
    onClose();
  };

  return (
    <div className="shopping-list-detail-overlay">
      <div className="shopping-list-detail">
        <h2>Edit Shopping List</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Created At:
          <input
            type="text"
            value={new Date(shoppingList.createdAt).toLocaleString()} 
            disabled 
          />
        </label>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ShoppingListDetail;
