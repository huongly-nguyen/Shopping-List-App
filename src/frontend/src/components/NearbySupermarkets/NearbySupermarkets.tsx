import React, { useState, useEffect } from 'react';
import './NearbySupermarkets.css'

const NearBySupermarkets = () => {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [supermarkets, setSupermarkets] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError("Could not retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      setLoading(true);
      setError(null);

      const { latitude, longitude } = location;
      const radius = 1000; // Set radius as 1000 meters

      fetch(`http://localhost:5000/api/nearby-supermarkets?location=${latitude},${longitude}&radius=${radius}`)
        .then((response) => response.json())
        .then((data) => {
          setSupermarkets(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching supermarkets.");
          setLoading(false);
        });
    }
  }, [location]); 

  return (
    <div className="nearby-supermarkets-container">
      <h1>Nearby Supermarkets</h1>
      
      {error && <p className="error">{error}</p>}
  
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div>
          {supermarkets.length === 0 ? (
            <p className="no-supermarkets">No supermarkets found.</p>
          ) : (
            <ul>
              {supermarkets.map((supermarket, index) => (
                <li key={index}>
                  <strong>{supermarket.name}</strong>
                  <p>{supermarket.address}</p>
                  <p>Location: Latitude {supermarket.latitude}, Longitude {supermarket.longitude}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
  
};

export default NearBySupermarkets;
