import PropTypes from "prop-types";

const SectionHeading = ({ children, className = "" }) => {
  return (
    <h1 className={`text-3xl md:text-4xl font-bold text-center mb-6 ${className}`}>
      {children}
    </h1>
  );
};

SectionHeading.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SectionHeading;
