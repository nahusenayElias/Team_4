import { useEffect, useState } from "react";
import { fetchContent } from "../services/api";

const FrontPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading content: {error.message}</div>;
  }

  return (
    <div>
      {content && content.attributes && content.attributes.body ? (
        <div
          dangerouslySetInnerHTML={{ __html: content.attributes.body.value }}
        />
      ) : (
        <div>No content available</div>
      )}
    </div>
  );
};

export default FrontPage;
