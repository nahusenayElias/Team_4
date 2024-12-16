import axios from "axios";

const drupalLocalhostAddress = import.meta.env.VITE_DRUPAL_BASE_URL;
const API_URL = `${drupalLocalhostAddress}/jsonapi`;

export const fetchContent = async (contentType) => {
  try {
    const response = await axios.get(`${API_URL}/${contentType}`);
    // console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error(`Error fetching content for ${contentType}:`, error);
    throw error;
  }
};

export { drupalLocalhostAddress };
