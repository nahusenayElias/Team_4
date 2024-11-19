import { useEffect, useState } from "react";
import { fetchContent, drupalLocalhostAddress } from "../services/api";
import ContactLayout from "../components/ContactLayout";
import DOMPurify from "dompurify";
import MauticContactForm from "../components/MauticContactForm";
import ContactInfo from "../components/ContactInfo";

const Contact = () => {
  const [content, setContent] = useState(null);
  const [included, setIndluded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sanitizedDrupalContent, setSanitizedDrupalContent] = useState(null);

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

  const imageData = content?.relationships?.field_image?.data;
  // Find the image file in included data based on the ID
  const imageFile = included?.find((image) => image.id === imageData?.id);
  const imageUrl = imageFile
    ? `${drupalLocalhostAddress}${imageFile.attributes.uri.url}`
    : null;
  // TODO: imageAltText is not fetched for some reason
  const imageAltText = imageFile?.meta?.alt;

  return (
    <ContactLayout
      contactInfo={
        <ContactInfo
          imageUrl={imageUrl} // Hero Image URL
          imageAltText={imageAltText || "Contact Page Hero Image"} // Alt Text
          title={content?.attributes?.title} // Section Heading
          bodyContent={sanitizedDrupalContent} // Sanitized Body Content
        />
      }
      contactForm={<MauticContactForm />}
    />
  );
};

export default Contact;