import { useEffect, useState } from "react";
import { fetchContent, drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";
import DOMPurify from "dompurify";
import MauticContactForm from "../components/MauticContactForm";
import HeroHeader from "../components/HeroHeader";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [content, setContent] = useState(null);
  const [included, setIndluded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sanitizedDrupalContent, setSanitizedDrupalContent] = useState(null);
  const [formId, setFormId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentResponse = await fetchContent(
          "node/contactpage?include=field_image"
        );
        setContent(contentResponse.data[0]);
        setIndluded(contentResponse.included);

        const formResponse = await fetch(
          `${drupalLocalhostAddress}/jsonapi/block_content/mautic_block`
        );
        const formData = await formResponse.json();

        if (!formResponse.ok) {
          throw new Error("Failed to fetch Mautic form data");
        }

        const mauticFormId =
          formData.data[0]?.attributes?.field_mautic_block_formid;
        console.log("Mautic Form ID:", mauticFormId);
        setFormId(mauticFormId);
      } catch (error) {
        console.error("Error fetching content:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  return (
    <>
      <HeroHeader imageUrl={imageUrl} content={content} />
      <Section>
        <div className="flex items-center justify-center">
          <button
            className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-48 p-2 m-5"
            onClick={() => navigate("/about")}
          >
            Get to know us
          </button>
        </div>
        <div className="flex items-center justify-center">
          <ProseWrapper>
            <div className="w-3/4 p-3 m-3 text-xl bg-gray-100 rounded-lg">
              {sanitizedDrupalContent ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizedDrupalContent,
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">
                  No content available
                </div>
              )}
            </div>
          </ProseWrapper>

          {formId ? (
            <div>
              <SectionHeading>Contact Us</SectionHeading>
              <MauticContactForm formId={formId} />
            </div>
          ) : (
            <div className="text-center text-gray-500">Form not available</div>
          )}
        </div>
      </Section>
    </>
  );
};

export default Contact;
