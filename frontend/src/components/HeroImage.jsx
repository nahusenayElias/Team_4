// src/components/Image.jsx
import PropTypes from "prop-types";

const HeroImage = ({ src, altText }) => {
  return (
    <img
      src={src}
      alt={altText || "Alt text not available"}
      className={`w-full h-64 object-cover rounded-md mb-6`}
    />
  );
};

HeroImage.propTypes = {
  src: PropTypes.string.isRequired,
  altText: PropTypes.string,
};

export default HeroImage;
