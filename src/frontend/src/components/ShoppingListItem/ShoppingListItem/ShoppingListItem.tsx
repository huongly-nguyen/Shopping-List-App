import React, { useEffect, useState } from 'react';
import './ShoppingListItem.css';
import AddItemToShoppingListModal from '../AddItemToShoppingListModal/AddItemToShoppingListModal';

interface ShoppingListItem {
  _id: string;
  shoppingListId: string;
  itemId: {
    _id: string;
    name: string;
    description: string;
    __v: number;
  };
  quantity: number;
  status: boolean;
}

interface ShoppingListItemsProps {
  shoppingListId?: string;
}

const ShoppingListItems: React.FC<ShoppingListItemsProps> = ({ shoppingListId }) => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/shoppingListItems/${shoppingListId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch shopping list items');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching shopping list items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (shoppingListId) {
      fetchItems();
    }
  }, [shoppingListId]);

  const handleToggleStatus = (itemId: string, currentStatus: boolean) => {
    fetch(`http://localhost:5000/api/shoppingListItems/${shoppingListId}/${itemId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: !currentStatus }),
    })
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.itemId._id === itemId ? { ...item, status: !currentStatus } : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating item status:', error);
      });
  };

  const handleEditQuantity = (itemId: string, newQuantity: number) => {
    fetch(`http://localhost:5000/api/shoppingListItems/${shoppingListId}/${itemId}/quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update item quantity');
        }
        return response.json();
      })
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.itemId._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating item quantity:', error);
      });
  };

  const handleDeleteItem = (itemId: string) => {
    fetch(`http://localhost:5000/api/shoppingListItems/${shoppingListId}/${itemId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.itemId._id !== itemId));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  const handleAddItemToList = (itemId: string, quantity: number) => {
    const existingItem = items.find((item) => item.itemId._id === itemId);
    if (existingItem) {
      setErrorMessage('This item is already in the shopping list!');
      return;
    }
  
    fetch(`http://localhost:5000/api/items/${itemId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }
        return response.json();
      })
      .then((itemData) => {
        fetch(`http://localhost:5000/api/shoppingListItems/${shoppingListId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemId: itemData._id,
            quantity,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to add item to shopping list');
            }
            return response.json();
          })
          .then((newItem) => {
            setItems((prevItems) => [
              ...prevItems,
              {
                _id: newItem._id,
                shoppingListId: shoppingListId!,
                itemId: {
                  _id: itemData._id,
                  name: itemData.name,
                  description: itemData.description,
                  __v: itemData.__v,
                },
                quantity: newItem.quantity,
                status: false,
              },
            ]);
            setErrorMessage(null); 
          })
          .catch((error) => {
            console.error('Error adding item to shopping list:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching item details:', error);
      });
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="shopping-list-items-content">
      <h1>Items inside this list</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button className="add-shopping-item-to-btn" onClick={() => setIsAddModalOpen(true)}>Add Item to List</button>      
      <ul>
        {items.map((item) => (
          <li key={item._id} className="shopping-list-item">
            <div className="item-details">
              <label>
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={() => handleToggleStatus(item.itemId._id, item.status)}
                />
              </label>
              <span>{item.itemId.name}</span>
              <div className="item-actions">
                <button onClick={() => handleEditQuantity(item.itemId._id, item.quantity - 1)}>-</button>
              </div>
              <span>{item.quantity}</span>
              <div className="item-actions">
                <button onClick={() => handleEditQuantity(item.itemId._id, item.quantity + 1)}>+</button>              
                <button onClick={() => handleDeleteItem(item.itemId._id)}>❌</button>
              </div>
            </div>                
          </li>
        ))}
      </ul>

      {isAddModalOpen && (
        <AddItemToShoppingListModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddItemToList} />
      )}
    </div>
  );
};

export default ShoppingListItems;
