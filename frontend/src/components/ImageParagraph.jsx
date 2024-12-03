import { findImageUrl } from "../services/utils";

const ImageParagraph = ({ paragraph, included }) => {
  const { imageUrl, altText } = findImageUrl(
    paragraph.relationships?.field_image,
    included
  );

  return (
    <div>
      <h3 className="font-semibold">
        {paragraph.attributes?.field_title || ""}
      </h3>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={altText || "n/a"}
          className="mt-4 max-w-full h-auto rounded-lg shadow-md"
        />
      )}
    </div>
  );
};

export default ImageParagraph;
