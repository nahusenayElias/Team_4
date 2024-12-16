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

  // If no contactId, return an empty segments object instead of throwing an error
  if (!contactId) {
    console.warn("mtc_id cookie not found. Returning empty segments.");
    return { segments: {} };
  }

  try {
    console.log("Fetching contact segments for contactId:", contactId);
    const response = await axios.get(
      `${drupalLocalhostAddress}/api/mautic/contact/${contactId}`
    );

    // console.log("Full Segments Response:", response.data);

    // Ensure the response has a segments property
    if (!response.data.segments) {
      console.warn("No segments found in response", response.data);
      return { segments: {} };
    }

    return response.data;
  } catch (err) {
    console.error("Error fetching contact segments:", err);
    // Return an empty segments object instead of throwing an error
    return { segments: {} };
  }
};
