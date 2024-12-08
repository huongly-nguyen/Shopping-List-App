import React, { useState } from 'react';
import './AddShoppingListModal.css';

interface AddShoppingListModalProps {
  onClose: () => void;
  onSubmit: (shoppingList: { name: string; description: string }) => void;
}

const AddShoppingListModal: React.FC<AddShoppingListModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      alert('Please fill in both fields.');
      return;
    }
    onSubmit({ name, description });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Shopping List</h2>
        <input
          type="text"
          placeholder="Shopping List Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Shopping List Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddShoppingListModal;
