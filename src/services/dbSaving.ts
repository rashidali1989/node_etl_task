import db from "../knex";
import axios from 'axios';
import cron from 'node-cron';

const fetchPaginatedData = async (page: number, pageSize: number) => {
  const url = `http://universities.hipolabs.com/search?country=United+States&page=${page}&limit=${pageSize}`;
  const response = await axios.get(url);
  return response.data;
};

const saveDataToDatabase = async (universities: any[]) => {
    try {
      const batchSize = 1000;  // Insert data in batches of 1000 rows to improve performance
      for (let i = 0; i < universities.length; i += batchSize) {
        const batch = universities.slice(i, i + batchSize);
  
        // Insert or update universities data
        await db('universities')
          .insert(batch)
          .onConflict(['name', 'country'])  // Handle duplicate entries based on university name and country
          .merge();  // If duplicates exist, update them with new data
      }
  
      console.log('Data successfully saved to the database.');
    } catch (error) {
      console.error('Error saving data to the database:', error);
    }
  };


//('This will run once every month on the 1st day at midnight UTC');
cron.schedule('0 0 1 * *', async () => {
    try {
    const pageSize = 10;  
    let page = 1;         
    let dataFetched = true; 

    while (dataFetched) {
      console.log(`Fetching data for page ${page}`);
      const universitiesData = await fetchPaginatedData(page, pageSize);

      if (universitiesData && universitiesData.length > 0) {
        // Save data to the database in batches
        await saveDataToDatabase(universitiesData);
        console.log(`Data for page ${page} saved successfully.`);
        page++;  
      } else {
        // No more data available, stop paginating
        dataFetched = false;
        console.log('No more data to fetch.');
      }
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});




