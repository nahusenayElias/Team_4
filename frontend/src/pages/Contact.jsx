import { useEffect, useState } from "react";
import { fetchContent, drupalLocalhostAddress } from "../services/api";

const Contact = () => {
  const [content, setContent] = useState(null);
  const [included, setIndluded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent("node/contactpage?include=field_image")
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
    <section className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-4">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Service Image"
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      {content && content.attributes && (
        <h1 className="text-3xl font-bold mb-4">{content.attributes.title}</h1>
      )}

      <div className="prose prose-lg text-gray-700">
        {content && content.attributes && content.attributes.body ? (
          <div
            dangerouslySetInnerHTML={{
              __html: content.attributes.body.value,
            }}
          />
        ) : (
          <div className="text-center text-gray-500">No content available</div>
        )}
      </div>
    </section>
  );
};

export default Contact;
