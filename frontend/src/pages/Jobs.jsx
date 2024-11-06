import { useEffect, useState } from "react";
import { drupalLocalhostAddress, fetchContent } from "../services/api";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";
import DOMPurify from "dompurify";

const Jobs = () => {
  const [content, setContent] = useState(null);
  const [included, setIncluded] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedDrupalContent, setSanitizedDrupalContent] = useState(null);

  useEffect(() => {
    fetchContent("node/page?include=field_image")
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
      setSanitizedDrupalContent(
        DOMPurify.sanitize(content.attributes.body.value)
      );
    }
  }, [content]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>error fetching content</div>;
  }

  const imageData = content?.relationships?.field_image?.data;

  const imageFile = included?.find((image) => image.id === imageData?.id);
  const imageUrl = imageFile
    ? `${drupalLocalhostAddress}${imageFile.attributes.uri.url}`
    : null;

  const imageAltText = imageFile?.meta?.alt;

  return (
    <Section>
      {imageUrl && <HeroImage src={imageUrl} alt={imageAltText} />}
      {content && content.attributes && (
        <SectionHeading>{content.attributes.title}</SectionHeading>
      )}

      <ProseWrapper>
        {sanitizedDrupalContent ? (
          <div dangerouslySetInnerHTML={{ __html: sanitizedDrupalContent }} />
        ) : (
          <div className="text-center text-gray-500">no content found</div>
        )}
      </ProseWrapper>
    </Section>
  );
};

export default Jobs;
