import express, { Request, Response } from 'express';
import path from 'path';
import { fetchDataAndStoreCSV } from '../services/universitiesService';
import fs from 'fs';
import cron from 'node-cron';
import { validateApiResponse } from '../validations/validationUtils';
import axios from 'axios';



const router = express.Router();

router.post('/fetch-save-universities', async (req: Request, res: Response) => {
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

router.get('/download-csv', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '..', 'CSVfileData', 'universities_data.csv');

  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    res.status(404).send('CSV file not found');
    return;
  }

  res.download(filePath, 'universities_data.csv', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});






//--cron to fetch and save csv --//


cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running scheduled task: Fetching and saving universities data...');
    await fetchDataAndStoreCSV();
    console.log('Scheduled task completed successfully.');
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});

export default router;
