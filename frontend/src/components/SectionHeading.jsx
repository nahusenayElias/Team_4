import PropTypes from "prop-types";

const SectionHeading = ({ children }) => {
  return <h1 className="text-3xl font-bold mb-4"> {children}</h1>;
};

// To stop vscode from complaining about passed children
SectionHeading.propTypes = {
  children: PropTypes.node,
};
export default SectionHeading;
