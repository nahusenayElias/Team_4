import { useEffect, useState } from "react";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/paragraph/about_us/9180a9f2-bfff-44f2-b7f1-38cf6342d6fb?include=field_about_media,field_about_media.field_media_image`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch about data");
        }

        const { attributes, relationships } = data.data;

        let imageUrl = null;
        let imageAlt = "About Us";

        if (
          relationships.field_about_media &&
          relationships.field_about_media.data
        ) {
          const mediaId = relationships.field_about_media.data.id;
          const mediaItem = data.included.find(
            (item) => item.id === mediaId && item.type === "media--image"
          );

          if (mediaItem && mediaItem.relationships.field_media_image.data) {
            const fileId = mediaItem.relationships.field_media_image.data.id;
            const fileItem = data.included.find(
              (item) => item.id === fileId && item.type === "file--file"
            );

            if (fileItem) {
              imageUrl = `${drupalLocalhostAddress}${fileItem.attributes.uri.url}`;
              imageAlt =
                mediaItem.relationships.field_media_image.data.meta.alt ||
                "About Us";
            }
          }
        }

        setAbout({
          title: attributes.field_about_title,
          body: attributes.field_about_body.value,
          imageUrl,
          imageAlt,
        });
      } catch (error) {
        console.error("Error fetching about data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!about) return <div>No about content found</div>;

  return (
    <Section>
      {about.imageUrl && (
        <HeroImage src={about.imageUrl} alt={about.imageAlt} />
      )}

      <SectionHeading>{about.title}</SectionHeading>

      <ProseWrapper>
        <div dangerouslySetInnerHTML={{ __html: about.body }} />
      </ProseWrapper>
    </Section>
  );
};

export default About;
