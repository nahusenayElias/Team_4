import TextParagraph from "./TextParagraph";
import ImageParagraph from "./ImageParagraph";
import TextWithImageParagraph from "./TextWithImageParagraph";

const ParagraphRenderer = ({ paragraph, included, findImageUrl }) => {
  const paragraphComponents = {
    "paragraph--text": TextParagraph,
    "paragraph--image": ImageParagraph,
    "paragraph--text_with_image": TextWithImageParagraph,
  };

  console.log("Rendering paragraph:", paragraph.type, paragraph);

  const Component = paragraphComponents[paragraph.type];
  if (!Component) return null;

  return (
    <div className="mt-8">
      <Component
        paragraph={paragraph}
        included={included}
        findImageUrl={findImageUrl}
      />
    </div>
  );
};

export default ParagraphRenderer;
