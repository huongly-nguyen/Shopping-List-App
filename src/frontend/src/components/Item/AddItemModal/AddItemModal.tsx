import React, { useState } from 'react';
import './AddItemModal.css';

interface AddItemModalProps {
  onClose: () => void;
  onSubmit: (item: { name: string; description: string }) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onSubmit }) => {
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
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Item Description"
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

export default AddItemModal;
