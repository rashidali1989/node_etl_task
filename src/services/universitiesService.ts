import { writeFileSync, existsSync } from 'fs';
import { parse } from 'json2csv';
import axios from 'axios';
import path from 'path';
import { validateApiResponse } from '../validations/validationUtils';

const CSV_DIR = path.join(__dirname, '..', 'CSVfileData');


const getUniqueFileName = (basePath: string): string => {
    if (existsSync(basePath)) {
      return basePath;
    }
  
    return basePath;
  };

export const fetchDataAndStoreCSV = async (): Promise<string> => {
  try {
    const response = await axios.get('http://universities.hipolabs.com/search?country=United+States');
    
    const validatedData = validateApiResponse(response?.data);

    if (validatedData instanceof Error) {
      throw validatedData; 
    }

    const csvData = parse(validatedData);

    const baseFilePath = path.join(CSV_DIR, 'universities_data.csv');

    const filePath = getUniqueFileName(baseFilePath);

    writeFileSync(filePath, csvData);

    console.log('Data successfully saved to CSV at:', filePath);

    return filePath;
  } catch (error: any) {
    console.error('Error fetching or saving data:', error);
    throw new Error('Failed to fetch or save data');
  }
};