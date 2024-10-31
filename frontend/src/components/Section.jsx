import PropTypes from "prop-types";

const Section = ({ children }) => {
  return (
    <section className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-4">
      {children}
    </section>
  );
};

// To stop vscode from complaining about passed children
Section.propTypes = {
  children: PropTypes.node,
};
export default Section;
