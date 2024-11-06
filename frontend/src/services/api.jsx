import axios from "axios";

const drupalLocalhostAddress = "http://localhost:63683"; // Update this if your Drupal localhost address changes. No trailing forward slash.

const API_URL = `${drupalLocalhostAddress}/jsonapi`;

export const fetchContent = async (contentType) => {
  try {
    const response = await axios.get(`${API_URL}/${contentType}`);
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error(`Error fetching content for ${contentType}:`, error);
    throw error;
  }
};

export { drupalLocalhostAddress };
