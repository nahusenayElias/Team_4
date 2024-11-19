import React from "react";
import PropTypes from "prop-types";

const ContactLayout = ({ contactInfo, contactForm }) => {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Left: Contact Info */}
      <div className="md:w-1/2 w-full h-full flex">{contactInfo}</div>

      {/* Right: Contact Form */}
      <div className="md:w-1/2 w-full h-full flex">{contactForm}</div>
    </div>
  );
};

ContactLayout.propTypes = {
  contactInfo: PropTypes.node.isRequired,
  contactForm: PropTypes.node.isRequired,
};

export default ContactLayout;
