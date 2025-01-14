import db from "../knex";


interface University {
    name: string;
    country: string;
    stateProvince?: any;
    alphaTwoCode: string;
    webPages: string[];
}

export const saveUniversityDataToDatabase = async (universities: University[]) => {
    try {
        for (const university of universities) {
            await db('universities')
                .insert({
                    name: university.name,
                    country: university.country,
                    state_province: university.stateProvince || null,
                    alpha_two_code: university.alphaTwoCode,
                    web_pages: university.webPages, 
                })
                .onConflict(['name', 'country'])
                .merge(); // Use the merge strategy for upserting
        }

        console.log('Data successfully saved to the database.');
    } catch (error) {
        console.error('Error saving data to the database:', error);
        throw error;
    }
};
