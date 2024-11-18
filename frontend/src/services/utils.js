import { drupalLocalhostAddress } from "./api";

export const findImageUrl = (fieldImage, included) => {
    if (!fieldImage || !included) return null;
  
    // Get the media entity ID from the paragraph's field_image relationship
    const mediaEntityId = fieldImage.data?.id;
    if (!mediaEntityId) return null;
  
    // Find the media entity
    const mediaEntity = included.find(
      item => item.type === "media--image" && item.id === mediaEntityId
    );
    if (!mediaEntity) return null;
  
    // Get the file ID from the media entity's field_media_image relationship
    const fileId = mediaEntity.relationships?.field_media_image?.data?.id;
    if (!fileId) return null;
  
    // Find the file entity
    const fileEntity = included.find(
      item => item.type === "file--file" && item.id === fileId
    );
    
    if (fileEntity?.attributes?.uri?.url) {
      return `${drupalLocalhostAddress}${fileEntity.attributes.uri.url}`;
    }
    return null;
  };