import DOMPurify from "dompurify";
import { findImageUrl } from "../services/utils";

const TextWithImageParagraph = ({ paragraph, included }) => {
  const imageUrl = findImageUrl(paragraph.relationships?.field_image, included);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="md:w-1/2">
        <h3 className="font-semibold">
          {paragraph.attributes?.field_heading || ""}
        </h3>
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(paragraph.attributes?.field_text?.value),
          }}
        />
      </div>
      <div className="md:w-1/2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={paragraph.attributes?.field_heading || "Project image"}
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        )}
      </div>
    </div>
  );
};

export default TextWithImageParagraph;
