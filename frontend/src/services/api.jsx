import axios from "axios";

const localhostAddress = "http://localhost:52142"; // Update this if your localhost address changes. No trailing forward slash.
const API_URL = `${localhostAddress}/jsonapi`;

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

export { localhostAddress };
