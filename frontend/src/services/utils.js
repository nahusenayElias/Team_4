import { drupalLocalhostAddress } from "./api";

export const findImageUrl = (fieldImage, included) => {
  console.log("findImageUrl Debug:", {
    fieldImage,
    included,
  });
  if (!fieldImage || !included) {
    console.log("Missing required data:", {
      fieldImage: !!fieldImage,
      included: !!included,
    });
    return null;
  }

  // Get the media entity ID from the paragraph's field_image relationship
  const mediaEntityId = fieldImage.data?.id;
  if (!mediaEntityId) {
    console.log("No media entity ID found in fieldImage");
    return null;
  }

  // Find the media entity
  const mediaEntity = included.find(
    (item) => item.type === "media--image" && item.id === mediaEntityId
  );
  if (!mediaEntity) {
    console.log(
      "No media entity found in included items for ID:",
      mediaEntityId
    );
    return null;
  }

  // Get the file ID from the media entity's field_media_image relationship
  const fileId = mediaEntity.relationships?.field_media_image?.data?.id;
  if (!fileId) {
    console.log("No file ID found in media entity");
    return null;
  }

  // Find the file entity
  const fileEntity = included.find(
    (item) => item.type === "file--file" && item.id === fileId
  );
  console.log("Found file entity:", fileEntity);

  if (fileEntity?.attributes?.uri?.url) {
    const fullUrl = `${drupalLocalhostAddress}${fileEntity.attributes.uri.url}`;
    console.log("Generated full URL:", fullUrl);
    return fullUrl;
  }
  console.log("No URL found in file entity");
  return null;
};

// Helper function to capitalize the first letter of each word (for dynamic page title in App.jsx)
export const capitalizeFirstLetter = (text) => {
  return text
    .toLowerCase()
    .split(/[-_]/) // Handles hyphenated or underscored words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
