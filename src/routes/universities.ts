import express from 'express';
import path from 'path';
import { fetchDataAndStoreCSV } from '../services/universitiesService';

const router = express.Router();

// Route to fetch and store universities data in CSV format
router.get('/fetch-universities', async (req, res) => {
  try {
    const filePath = await fetchDataAndStoreCSV(); 
    
    res.json({
      message: 'Universities data has been successfully fetched and stored as CSV.',
      filePath,
    });
  } catch (error) {
    console.error('Error fetching universities data:', error);
    res.status(500).json({ message: 'Error fetching universities data' });
  }
});

router.get('/download-csv', (req, res) => {
  const filePath = path.join(__dirname, '..', 'CSVfileData', 'universities_data.csv');

  // Check if the file exists
  res.download(filePath, 'universities_data.csv', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

export default router;
