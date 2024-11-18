import PropTypes from "prop-types";

const Section = ({ children, className = "" }) => {
  return (
    <section className={`max-w-7xl mx-auto px-4 py-16 ${className}`}>
      {children}
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Section;
