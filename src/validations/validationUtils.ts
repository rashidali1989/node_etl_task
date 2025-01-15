export interface FormattedUniversity {
  name: string;
  webPages: string[];
  alphaTwoCode: string;
  country: string;
  stateProvince?: string | null; // Optional field, will be excluded if null
}

export const validateApiResponse = (data: any, dbSaving: boolean = false): FormattedUniversity[] | Error => {
  try {
    if (!Array.isArray(data)) {
      return new Error('Response data should be an array');
    }

    const validatedData: FormattedUniversity[] = data.map((university, index) => {
      if (
        typeof university.name !== 'string' ||
        !Array.isArray(university.web_pages) ||
        typeof university.alpha_two_code !== 'string' ||
        typeof university.country !== 'string'
      ) {
        throw new Error(`Invalid data format at index ${index}`);
      }
      let webPages = university.web_pages;
      if (!dbSaving) {
        webPages = university.web_pages.join(',');
      }

      // Construct the valid university object with required fields
      const formattedUniversity: FormattedUniversity = {
        name: university.name,
        webPages: webPages,
        alphaTwoCode: university.alpha_two_code,
        country: university.country,
      };

      // Only include stateProvince if it is not null
      if (university['state-province'] !== null) {
        formattedUniversity.stateProvince = university['state-province'];
      }

      return formattedUniversity;
    });

    // Return the validated data if all validations pass
    return validatedData;
  } catch (error: any) {
    return new Error(`Error validating API response: ${error.message}`);
  }
};
