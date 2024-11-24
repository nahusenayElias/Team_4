import { useEffect, useState } from "react";
import { fetchContent, drupalLocalhostAddress } from "../services/api";
import ContactLayout from "../components/ContactLayout";
import DOMPurify from "dompurify";
import ContactInfo from "../components/ContactInfo";
import MauticContactForm from "../components/MauticContactForm";

const Contact = () => {
  const [content, setContent] = useState(null);
  const [included, setIncluded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sanitizedContent, setSanitizedContent] = useState(null);

  useEffect(() => {
    fetchContent("node/contactpage?include=field_image")
      .then((data) => {
        setContent(data.data[0]);
        setIncluded(data.included);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (content?.attributes?.body?.value) {
      setSanitizedContent(DOMPurify.sanitize(content.attributes.body.value));
    }
  }, [content]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading content: {error.message}</div>;

  const imageData = content?.relationships?.field_image?.data;
  const imageFile = included?.find((image) => image.id === imageData?.id);
  const imageUrl = imageFile
    ? `${drupalLocalhostAddress}${imageFile.attributes.uri.url}`
    : null;

  return (
    <ContactLayout
      contactInfo={
        <ContactInfo
          imageUrl={imageUrl}
          bodyContent={sanitizedContent}
          imageAltText={imageFile?.meta?.alt || "Contact Hero Image"}
        />
      }
      contactForm={<MauticContactForm />}
    />
  );
};

export default Contact;
