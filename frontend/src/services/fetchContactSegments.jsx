import axios from "axios";
import { drupalLocalhostAddress } from "../services/api";

// Helper function to get cookie value by name
export const getCookieValue = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(name + "="));
  return cookie ? cookie.split("=")[1] : null;
};

// Service function to fetch contact segments
export const fetchContactSegments = async () => {
  const contactId = getCookieValue("mtc_id");

  if (!contactId) {
    throw new Error("mtc_id cookie not found.");
  }

  try {
    const response = await axios.get(
      `${drupalLocalhostAddress}/api/mautic/contact/${contactId}`
    );
    // console.log("Raw Response:", response);
    const data = response.data;
    // console.log("Parsed Data:", data);

    return data;
  } catch (err) {
    throw new Error(`Error fetching contact segments: ${err.message}`);
  }
};
