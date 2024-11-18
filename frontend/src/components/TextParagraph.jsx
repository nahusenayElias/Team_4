import ProseWrapper from "../components/ProseWrapper";
import DOMPurify from "dompurify";

const TextParagraph = ({ content }) => {
  if (!content || !content.field_heading || !content.field_text) {
    return null;
  }

  return (
    <ProseWrapper>
      <h3 className="font-semibold">{content.field_heading}</h3>
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content.field_text.value),
        }}
      />
    </ProseWrapper>
  );
};

export default TextParagraph;
