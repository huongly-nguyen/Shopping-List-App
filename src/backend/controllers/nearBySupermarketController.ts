import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

const handleErrors = (err: unknown, res: Response) => {
  console.error(err);
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const router = express.Router();
interface OverpassElement {
  tags: {
      name?: string;
      addr_full?: string;
  };
  lat: number;
  lon: number;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export const getAllNearBySupermarkets = async (req: Request, res: Response) => {
  console.log('Received request for nearby supermarkets');
  const { location, radius = 500 } = req.query;

  if (!location || typeof location !== 'string') {
      res.status(400).json({ error: 'Please provide the location coordinates (latitude,longitude).' });
      return;
  }

  try {
      console.log('Location:', location);
      const [latitude, longitude] = location.split(',');
      console.log('Latitude:', latitude, 'Longitude:', longitude);

      const overpassQuery = `
          [out:json];
          (
              node["shop"="supermarket"](around:${radius},${latitude},${longitude});
          );
          out body;
      `;

      console.log('Overpass Query:', overpassQuery);

      const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: overpassQuery,
      });

      if (!response.ok) {
          throw new Error('Unable to connect to Overpass API');
      }

      const data: OverpassResponse = await response.json();

      const supermarkets = data.elements.map((place: OverpassElement) => ({
          name: place.tags.name || 'Unknown',
          address: place.tags.addr_full || 'No address information available',
          latitude: place.lat,
          longitude: place.lon,
      }));

      res.json(supermarkets);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch supermarket list.' });
  }
};

export default router;
