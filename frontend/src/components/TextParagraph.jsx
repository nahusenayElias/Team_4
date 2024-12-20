import React from "react";
import DOMPurify from "dompurify";

const TextParagraph = ({ paragraph }) => {
  if (!paragraph || !paragraph.attributes.field_text) {
    console.log("Invalid content for TextParagraph:", paragraph);
    return null;
  }

  // Sanitize the HTML content and create a temporary container to parse it
  const sanitizedHtml = DOMPurify.sanitize(
    paragraph.attributes.field_text.processed
  );

  // Create a temporary div to parse the HTML and select all relevant elements
  const parsedHtml = new DOMParser().parseFromString(
    sanitizedHtml,
    "text/html"
  );

  // Select the first heading if present
  const headingElement = parsedHtml.querySelector("h2, h3, h4, h5, h6");

  // Remove the heading element from the parsed HTML body to avoid duplicate rendering
  if (headingElement) {
    headingElement.remove();
  }

  // Select all paragraph elements
  const paragraphElements = Array.from(parsedHtml.querySelectorAll("p"));

  // Check if two-column layout is enabled
  const isTwoColumns = paragraph.attributes?.field_two_columns || false;

  // If two columns are enabled, split the paragraphs into two columns
  let twoColumnLayout = null;
  if (isTwoColumns && paragraphElements.length > 1) {
    twoColumnLayout = (
      <div className="text-left font-sans mx-auto w-4/5 md:grid md:grid-cols-2 md:gap-10 lg:text-2xl md:text-xl sm:text-lg">
        <div>
          {React.createElement("div", {}, paragraphElements[0].innerHTML)}
        </div>
        <div>
          {React.createElement("div", {}, paragraphElements[1].innerHTML)}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Render the heading if it exists */}
      {headingElement &&
        React.createElement(
          headingElement.nodeName.toLowerCase(),
          { className: "font-semibold text-3xl mb-5" },
          headingElement.innerHTML
        )}

      {/* Render the remaining content */}
      {!twoColumnLayout ? (
        <div
          className="font-sans lg:text-2xl md:text-xl sm:text-lg text-left prose flex flex-col items-center justify-center my-0 mx-auto w-full"
          dangerouslySetInnerHTML={{
            __html: parsedHtml.body.innerHTML, // Render the original HTML without the heading
          }}
        />
      ) : (
        twoColumnLayout // If two-column layout is active, render that
      )}
    </>
  );
};

export default TextParagraph;
