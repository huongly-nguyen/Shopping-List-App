import React, { useState, useEffect } from 'react';
import './ShoppingList.css';
import ShoppingListDetail from '../ShoppingListDetail/ShoppingListDetail';
import AddShoppingListModal from '../AddShoppingListModal/AddShoppingListModal';
import ShoppingListItems from '../../ShoppingListItem/ShoppingListItem/ShoppingListItem';

interface ShoppingList {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
}

interface Item {
  _id: string;
  name: string;
}

const ShoppingList: React.FC = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedShoppingListforEditting, setSelectedShoppingListforEditting] = useState<ShoppingList | null>(null);
  const [selectedShoppingListforViewing, setSelectedShoppingListforViewing] = useState<ShoppingList | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'name-description' | 'item'>('name-description');
  const [selectedItem, setSelectedItem] = useState<string>('');

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  // Fetch shopping lists
  useEffect(() => {
    const fetchShoppingLists = async () => {
      let url = 'http://localhost:5000/api/shoppingLists';
      
      if (searchType === 'name-description' && searchQuery ) {
        url = `http://localhost:5000/api/shoppingLists/search?query=${searchQuery}`;
      } else       
      if (searchType === 'item' && selectedItem) {
        url = `http://localhost:5000/api/shoppingLists/item/${selectedItem}`;
      }

      try {
        const response = await fetch(url);
        console.log(url);
        if (!response.ok) {
          throw new Error('Failed to fetch shopping lists');
        }
        const data = await response.json();
        setShoppingLists(data);
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      }
    };

    fetchShoppingLists();
  }, [searchQuery, searchType, selectedItem]);

  const handleAddShoppingList = (newShoppingList: { name: string; description: string }) => {
    fetch('http://localhost:5000/api/shoppingLists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newShoppingList),
    })
      .then((response) => response.json())
      .then((data) => {
        setShoppingLists((prevShoppingLists) => [...prevShoppingLists, data]);
        setIsAddModalOpen(false);
      })
      .catch((error) => {
        console.error('Error adding shopping list:', error);
      });
  };

  const handleEditShoppingListForEditting = (shoppingList: ShoppingList) => {
    setSelectedShoppingListforEditting(shoppingList);
  };

  const handleDeleteShoppingList = (id: string) => {
    fetch(`http://localhost:5000/api/shoppingLists/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setShoppingLists((prevShoppingLists) => prevShoppingLists.filter((shoppingList) => shoppingList._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting shopping list:', error);
      });
  };

  const handleSelectShoppingListForViewing = (shoppingList: ShoppingList) => {
    setSelectedShoppingListforViewing(shoppingList);
  };

  const handleSaveShoppingList = (updatedShoppingList: ShoppingList) => {
    fetch(`http://localhost:5000/api/shoppingLists/${updatedShoppingList._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedShoppingList),
    })
      .then((response) => response.json())
      .then((data) => {
        setShoppingLists((prevShoppingLists) =>
          prevShoppingLists.map((shoppingList) =>
            shoppingList._id === data._id ? { ...shoppingList, ...data } : shoppingList
          )
        );
        setSelectedShoppingListforEditting(null);
      })
      .catch((error) => {
        console.error('Error updating shopping list:', error);
      });
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(e.target.value as 'name-description' | 'item');
    setSearchQuery(''); 
    setSelectedItem(''); 
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(e.target.value);
  };

  return (
    <div className="shopping-list-container">
      <div className="shopping-list">
        <div className="header">
          <h1>Shopping Lists</h1>

          <div className="search-container">
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  name="searchType"
                  value="name-description"
                  checked={searchType === 'name-description'}
                  onChange={handleSearchTypeChange}
                />
                Search by Name/Description
              </label>

              <label>
                <input
                  type="radio"
                  name="searchType"
                  value="item"
                  checked={searchType === 'item'}
                  onChange={handleSearchTypeChange}
                />
                Search by Item
              </label>
            </div>

            {searchType === 'name-description' && (
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by Name/Description..."
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                />
              </div>
            )}

            {searchType === 'item' && (
              <div className="search-box">
                <select
                  value={selectedItem} 
                  onChange={handleItemSelectChange} 
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button className="add-shopping-list-btn" onClick={() => setIsAddModalOpen(true)}>
            Add Shopping List
          </button>
        </div>

        <ul>
          {shoppingLists.map((shoppingList) => (
            <div key={shoppingList._id} className="shopping-list-item">
              <h2 onClick={() => handleSelectShoppingListForViewing(shoppingList)}>{shoppingList.name}</h2>
              <p>{shoppingList.description}</p>
              <button onClick={() => handleEditShoppingListForEditting(shoppingList)}>✏️</button>
              <button onClick={() => handleDeleteShoppingList(shoppingList._id)}>❌</button>
            </div>
          ))}
        </ul>
      </div>

      <div className="shopping-list-items">
        {selectedShoppingListforViewing ? (
          <ShoppingListItems shoppingListId={selectedShoppingListforViewing._id} />
        ) : (
          <p>Please select a shopping list to view items.</p>
        )}
      </div>

      {selectedShoppingListforEditting && (
        <ShoppingListDetail
          shoppingList={selectedShoppingListforEditting}
          onClose={() => setSelectedShoppingListforEditting(null)}
          onSave={handleSaveShoppingList}
        />
      )}

      {isAddModalOpen && (
        <AddShoppingListModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddShoppingList}
        />
      )}
    </div>
  );
};

export default ShoppingList;
