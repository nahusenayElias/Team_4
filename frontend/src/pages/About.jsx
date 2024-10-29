import { useEffect, useState } from "react";
import { fetchContent, drupalLocalhostAddress } from "../services/api";

const About = () => {
  const [content, setContent] = useState(null);
  const [included, setIndluded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent("node/aboutpage?include=field_image")
      .then((data) => {
        console.log("Fetched data:", data);
        setContent(data.data[0]); // Access the first item in the data array
        setIndluded(data.included);
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

  const imageData = content?.relationships?.field_image?.data; // Get the related image data

  // Find the image file in included data based on the ID
  const imageFile = included?.find((image) => image.id === imageData?.id);
  const imageUrl = imageFile
    ? `${drupalLocalhostAddress}${imageFile.attributes.uri.url}`
    : null;

  return (
    <>
      {imageUrl && <img src={imageUrl} />}

      <div>
        {content && content.attributes && content.attributes.body ? (
          <div
            dangerouslySetInnerHTML={{
              __html: content.attributes.body.value,
            }}
          />
        ) : (
          <div>No content available</div>
        )}
      </div>
    </>
  );
};

export default About;
