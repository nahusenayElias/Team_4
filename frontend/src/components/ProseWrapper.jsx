import PropTypes from "prop-types";

const ProseWrapper = ({ children }) => {
  return <div className="prose prose-lg text-gray-700">{children}</div>;
};

// To stop vscode from complaining about passed children
ProseWrapper.propTypes = {
  children: PropTypes.node,
};
export default ProseWrapper;
