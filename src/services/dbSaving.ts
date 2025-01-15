import db from "../knex";
import axios from 'axios';
import cron from 'node-cron';


export const fetchData = async (): Promise<[] | null> => {
  const url = `http://universities.hipolabs.com/search?country=United+States`;

  try {
    const response = await axios.get(url);
    console.log("API Response:", response.data);

    return response.data;

  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return null; // Return null if an error occurs during fetching
  }
};



export const saveDataToDatabase = async (universities: any[]) => {
  try {
    const batchSize = 50; // Insert data in batches to improve performance
    for (let i = 0; i < universities.length; i += batchSize) {
      const batch = universities.slice(i, i + batchSize);

      console.log(`Processing batch: ${batch.length} universities`);


      // Extract university data for the `university_data` table
      const universityData = batch.map((university: any) => ({
        name: university.name,
        country: university.country,
        state_province: university['state-province'] || null,
        alpha_two_code: university.alpha_two_code,
      }));
      console.log(`University data for batch:`, universityData); // Log data

      // Insert or update universities data
      const insertedUniversities = await db('university_data')
        .insert(universityData)
        .onConflict(['name', 'country']) // Handle duplicate entries
        .merge() 
        .returning(['id', 'name']); 

        console.log(`Inserted universities:`, insertedUniversities); 


      // Create a map of university names to IDs
      const universityIdMap = Object.fromEntries(
        insertedUniversities.map((university: any) => [university.name, university.id])
      );

      // Extract and prepare web pages data
      const webPagesData = batch.flatMap((university: any) => {
        const universityId = universityIdMap[university.name];
        if (!universityId || !university.web_pages) return [];
        return university.web_pages.map((webPage: string) => ({
          university_id: universityId,
          web_page: webPage,
        }));
      });

      console.log(`Web pages data for batch:`, webPagesData); // Log web pages data

      // Insert or update web pages data
      for (let j = 0; j < webPagesData.length; j += batchSize) {
        const webPageBatch = webPagesData.slice(j, j + batchSize);

        await db('web_pages')
          .insert(webPageBatch)
          .onConflict(['university_id', 'web_page']) // Handle duplicates
          .ignore(); // Skip duplicates without updating
      }
    }

    console.log('Data successfully saved to the database.');
  } catch (error) {
    console.error('Error saving data to the database:', error);
  }
};



//       const batchSize = 50;  // Insert data in batches of 1000 rows to improve performance
//       for (let i = 0; i < universities.length; i += batchSize) {
//         const batch = universities.slice(i, i + batchSize);
  
//         // Insert or update universities data
//         await db('university_data')
//           .insert(batch)
//           .onConflict(['name', 'country'])  // Handle duplicate entries based on university name and country
//           .merge();  // If duplicates exist, update them with new data
//       }
  
//       console.log('Data successfully saved to the database.');
//     } catch (error) {
//       console.error('Error saving data to the database:', error);
//     }
//   };


//('This will run once every month on the 1st day at midnight UTC');