import React from "react";
import PropTypes from "prop-types";

const ContactLayout = ({ contactInfo, contactForm }) => {
  return (
    <div className="flex flex-col md:flex-row w-full h-full md:h-screen">
      {/* Left: Contact Info */}
      <div className="w-full md:w-1/2 flex">{contactInfo}</div>

      {/* Right: Contact Form */}
      <div className="w-full md:w-1/2 flex">{contactForm}</div>
    </div>
  );
};

ContactLayout.propTypes = {
  contactInfo: PropTypes.node.isRequired,
  contactForm: PropTypes.node.isRequired,
};

export default ContactLayout;
