import ProseWrapper from "../components/ProseWrapper";
import DOMPurify from "dompurify";

const TextParagraph = ({ paragraph }) => {
  if (
    !paragraph ||
    // !paragraph.attributes.field_heading ||
    !paragraph.attributes.field_text
  ) {
    console.log("Invalid content for TextParagraph:", paragraph);
    return null;
  }

  return (
    <ProseWrapper>
      {paragraph.attributes.field_heading && (
        <h3 className="font-semibold">{paragraph.attributes.field_heading}</h3>
      )}{" "}
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(paragraph.attributes.field_text.processed),
        }}
      />
    </ProseWrapper>
  );
};

export default TextParagraph;
