import TextParagraph from "./TextParagraph";
import ImageParagraph from "./ImageParagraph";
import TextWithImageParagraph from "./TextWithImageParagraph";
import { useSelector } from "react-redux";

const ParagraphRenderer = ({ paragraph, included }) => {
  
  const visitorSegments = useSelector((state) => state.visitorSegments.data);
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
      {visitorSegments.map((segment) => (
        <p key={segment.id}>{segment.name}</p>
      ))}
      <Component paragraph={paragraph} included={included} />
    </div>
  );
};

export default ParagraphRenderer;
