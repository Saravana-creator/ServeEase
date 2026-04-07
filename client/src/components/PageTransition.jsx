// Page Transition is now handled globally in Layout.jsx
// This component acts as a passthrough to avoid breaking existing imports.
const PageTransition = ({ children }) => {
  return children;
};

export default PageTransition;
