import { useEffect, useState } from "react";
import { drupalLocalhostAddress, fetchContent } from "../services/api";
import DOMPurify from "dompurify";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import HeroImage from "../components/HeroImage";
import ProseWrapper from "../components/ProseWrapper";

const FrontPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sanitizedDrupalContent, setSanitizedDrupalContent] = useState(null);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState(null);
  const [heroImageAltText, setHeroImageAltText] = useState("");

  useEffect(() => {
    fetchContent("node/front_page?include=field_heroimg")
      .then((data) => {
        console.log("Fetched data:", data);

        const frontPageContent = data.data[0];
        setContent(frontPageContent);
        setLoading(false);

        // title & short description...
        setTitle(frontPageContent.attributes.title);
        setShortDescription(frontPageContent.attributes.field_description);

        // hero image URL & alt text...
        const heroImageData = frontPageContent.relationships.field_heroimg.data;
        const heroImageFile = data.included?.find(
          (image) => image.id === heroImageData?.id
        );

        if (heroImageFile) {
          const imageUri = heroImageFile.attributes.uri.url;
          const isRelativeUrl = !/^https?:\/\//i.test(imageUri);
          setHeroImageUrl(
            isRelativeUrl ? `${drupalLocalhostAddress}${imageUri}` : imageUri
          );
          setHeroImageAltText(heroImageFile.meta?.alt || "Hero image");
          console.log(
            "Hero image URL:",
            isRelativeUrl ? `${drupalLocalhostAddress}${imageUri}` : imageUri
          );
        } else {
          console.warn("Hero image data not found in included data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching content:", error);
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
    return <div>Error loading content: {error.message}</div>;
  }

  return (
    <Section>
      {heroImageUrl ? (
        <HeroImage
          src={heroImageUrl}
          alt={heroImageAltText}
          className="hero-image"
        />
      ) : (
        <div>No hero image available</div>
      )}

      <SectionHeading>{title}</SectionHeading>

      {shortDescription && (
        <p className="short-description">{shortDescription}</p>
      )}

      <ProseWrapper>
        {sanitizedDrupalContent ? (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: sanitizedDrupalContent }}
          />
        ) : (
          <div>No content available</div>
        )}
      </ProseWrapper>
    </Section>
  );
};

export default FrontPage;
