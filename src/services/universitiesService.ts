import { writeFileSync, existsSync } from 'fs';
import { parse } from 'json2csv';
import axios from 'axios';
import path from 'path';
import { validateApiResponse } from '../validations/validationUtils';

const CSV_DIR = path.join(__dirname, '..', 'CSVfileData');


export const fetchDataAndStoreCSV = async (): Promise<string> => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to fetch data`);
      const response = await axios.get('http://universities.hipolabs.com/search?country=United+States');

      const validatedData = validateApiResponse(response?.data);

      if (validatedData instanceof Error) {
        throw validatedData;
      }

      const csvData = parse(validatedData);

      const baseFilePath = path.join(CSV_DIR, 'universities_data.csv');
      const filePath = existsSync(baseFilePath) ? baseFilePath : baseFilePath;

      writeFileSync(filePath, csvData);

      console.log('Data successfully saved to CSV at:', filePath);
      return filePath;
    } catch (error: any) {
      console.error(`Error on attempt ${attempt}:`, error);

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error('All retry attempts failed');
        throw new Error('Failed to fetch or save data after multiple attempts');
      }
    }
  }

  throw new Error('This code path should not be reached'); 
};



