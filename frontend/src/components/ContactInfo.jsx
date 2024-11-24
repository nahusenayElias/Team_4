import React from "react";
import PropTypes from "prop-types";

const ContactInfo = ({ imageUrl, imageAltText, bodyContent }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center p-16 md:p-10 lg:p-16 min-h-[70vh] md:min-h-screen bg-customOrange md:bg-transparent z-0">
      {/* Orange Background */}
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-customOrange z-0"></div>

      {/* Content Card */}
      <div className="relative w-full max-w-lg md:max-w-3xl rounded-lg shadow-lg bg-white z-10">
        {/* Image Container */}
        <div
          className="w-full h-48 sm:h-64 md:h-[400px] bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-label={imageAltText}
        ></div>

        {/* Text Container */}
        <div className="p-6 sm:p-8">
          {bodyContent ? (
            <div
              className="text-sm sm:text-base md:text-lg text-gray-800"
              dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
          ) : (
            <p className="text-sm text-gray-500">No content available</p>
          )}
        </div>
      </div>
    </div>
  );
};

ContactInfo.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageAltText: PropTypes.string,
  bodyContent: PropTypes.string,
};

export default ContactInfo;
