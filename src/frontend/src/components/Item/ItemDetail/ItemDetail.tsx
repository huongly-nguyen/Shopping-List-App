import React, { useState } from 'react';
import './ItemDetail.css';

interface ItemDetailProps {
  item: {
    _id: number;
    name: string;
    description: string;
  };
  onClose: () => void;
  onSave: (updatedItem: { _id: number; name: string; description: string }) => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);

  const handleSubmit = () => {
    onSave({ _id: item._id, name, description });
    onClose();
  };

  return (
    <div className="item-detail-overlay">
      <div className="item-detail">
        <h2>Edit Item</h2>
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
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ItemDetail;
