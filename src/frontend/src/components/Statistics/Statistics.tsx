import React, { useEffect, useState } from 'react';
import './Statistics.css';

interface StatisticsData {
  totalShoppingLists: number;
  totalItems: number;
  purchasedItems: number;
  pendingItems: number;
}

interface PendingItem {
  itemId: string;  // itemId từ backend
  itemName: string; // Tên item từ backend
  totalQuantity: number; // Tổng số lượng pending của item
}

interface Item {
  _id: string;
  name: string;
}

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);  // Đổi kiểu dữ liệu cho pending items
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        const [totalListsRes, totalItemsRes, purchasedItemsNumberRes, pendingItemsNumberRes, allPendingItemsRes, itemsRes] = await Promise.all([
          fetch('http://localhost:5000/api/statistics/totalShoppingLists'),
          fetch('http://localhost:5000/api/statistics/totalItems'),
          fetch('http://localhost:5000/api/statistics/purchasedItems'),
          fetch('http://localhost:5000/api/statistics/pendingItems'),
          fetch('http://localhost:5000/api/statistics/pendingItemsList'),
          fetch('http://localhost:5000/api/items'),
        ]);

        if (
          !totalListsRes.ok ||
          !totalItemsRes.ok ||
          !purchasedItemsNumberRes.ok ||
          !pendingItemsNumberRes.ok ||
          !allPendingItemsRes.ok ||
          !itemsRes.ok
        ) {
          throw new Error('Failed to fetch statistics');
        }

        const totalLists = await totalListsRes.json();
        const totalItems = await totalItemsRes.json();
        const purchasedItemsNumber = await purchasedItemsNumberRes.json();
        const pendingItemsNumber = await pendingItemsNumberRes.json();
        const allPendingItems = await allPendingItemsRes.json();
        const items = await itemsRes.json();

        setStatistics({
          totalShoppingLists: totalLists.totalShoppingLists,
          totalItems: totalItems.totalItems,
          purchasedItems: purchasedItemsNumber.purchasedItems,
          pendingItems: pendingItemsNumber.pendingItems,
        });

        // Chuyển đổi pendingItems thành dạng đúng theo dữ liệu backend trả về
        const updatedPendingItems = allPendingItems.pendingItems.map((pending: any) => {
          const name = pending.itemName || 'Unknown Item';
          return { itemId: pending.itemId, itemName: name, totalQuantity: pending.totalQuantity };
        });

        setPendingItems(updatedPendingItems);  // Cập nhật pendingItems với dữ liệu đúng
        setError(null);
      } catch (err) {
        setError((err as Error).message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="statistics-container">
      <div className="header">
        <h1>Statistics</h1>
      </div>

      {statistics && (
        <div className="statistics">
          <div className="statistic-item">
            <h2>Total Shopping Lists:</h2>
            <p>{statistics.totalShoppingLists}</p>
          </div>
          <div className="statistic-item">
            <h2>Total Items:</h2>
            <p>{statistics.totalItems}</p>
          </div>
          <div className="statistic-item">
            <h2>Purchased Items:</h2>
            <p>{statistics.purchasedItems}</p>
          </div>
          <div className="statistic-item">
            <h2>Pending Items:</h2>
            <p>{statistics.pendingItems}</p>
          </div>
        </div>
      )}

      {pendingItems.length > 0 && (
        <div className="pending-items">
          <h2>List of Pending Items:</h2>
          <ul>
            {pendingItems.map((item) => (
              <li key={item.itemId}> {/* itemId dùng làm key để phân biệt từng item */}
                <p>{item.itemName} : {item.totalQuantity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Statistics;
