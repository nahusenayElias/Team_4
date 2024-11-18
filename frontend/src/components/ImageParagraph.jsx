import { findImageUrl } from "../services/utils";

const ImageParagraph = ({ paragraph, included }) => {
  const imageUrl = findImageUrl(paragraph.relationships?.field_image, included);

  return (
    <div>
      <h3 className="font-semibold">
        {paragraph.attributes?.field_heading || ""}
      </h3>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={paragraph.attributes?.field_heading || "Project image"}
          className="mt-4 max-w-full h-auto rounded-lg shadow-md"
        />
      )}
    </div>
  );
};

export default ImageParagraph;
