import { useEffect, useState } from "react";
import { fetchContent } from "../services/api";
import DOMPurify from "dompurify";

const FrontPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sanitizedDrupalContent, setSanitizedDrupalContent] = useState(null);

  useEffect(() => {
    fetchContent("node/frontpage")
      .then((data) => {
        console.log("Fetched data:", data);
        setContent(data.data[0]); // Access the first item in the data array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching content:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Sanitize body text coming in from Drupal
  useEffect(() => {
    if (content?.attributes?.body?.value) {
      setSanitizedDrupalContent(
        DOMPurify.sanitize(content.attributes.body.value)
      );
    }
  }, [content]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading content: {error.message}</div>;
  }

  return (
    <div>
      {sanitizedDrupalContent ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedDrupalContent }} />
      ) : (
        <div>No content available</div>
      )}
    </div>
  );
};

export default FrontPage;
