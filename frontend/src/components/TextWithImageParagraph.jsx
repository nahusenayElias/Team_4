import DOMPurify from "dompurify";
import { findImageUrl } from "../services/utils";
import SectionHeading from "./SectionHeading";

const TextWithImageParagraph = ({ paragraph, included }) => {
  const { imageUrl, altText } = findImageUrl(
    paragraph.relationships?.field_image,
    included
  );

  // Check if toggle "field_image_first" is set to true or false by user in drupal paragraph:
  const isImageFirst = paragraph.attributes?.field_image_first || false;

  return (
    <div className="mt-32 mb-20">
      <SectionHeading>{paragraph.attributes?.field_title || ""}</SectionHeading>
      <div className="flex flex-col md:flex-row items-center gap-6 mt-10">
        {isImageFirst && imageUrl && (
          <div className="md:w-1/2">
            <img
              src={imageUrl}
              alt={altText || "n/a"}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
        <div className="md:w-1/2">
          <div
            className="w-full prose lg:text-2xl md:text-xl sm:text-lg text-left mr-10 p-5"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(paragraph.attributes?.field_long_text),
            }}
          />
        </div>
        {!isImageFirst && imageUrl && (
          <div className="md:w-1/2">
            <img
              src={imageUrl}
              alt={altText || "n/a"}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextWithImageParagraph;
