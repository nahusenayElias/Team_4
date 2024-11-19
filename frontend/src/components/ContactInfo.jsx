import React from "react";
import PropTypes from "prop-types";

const ContactInfo = ({ imageUrl, imageAltText, bodyContent }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Half Orange Background */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-customOrange"></div>

      {/* Image and Text Container */}
      <div className="relative w-3/4 rounded-lg shadow-lg overflow-hidden">
        {/* Image Container */}
        <div
          className="w-full h-[400px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
          alt={imageAltText}
        ></div>

        {/* Text Container (Attached to Image) */}
        <div className="w-full bg-white p-9">
          {bodyContent ? (
            <div
              className="text-base text-gray-800 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{
                __html: bodyContent,
              }}
            />
          ) : (
            <p className="text-base text-gray-500">No content available</p>
          )}
        </div>
      </div>
    </div>
  );
};

ContactInfo.propTypes = {
  imageUrl: PropTypes.string.isRequired, // URL for the hero image
  imageAltText: PropTypes.string, // Alt text for accessibility
  bodyContent: PropTypes.string, // Sanitized HTML for the text
};

export default ContactInfo;
