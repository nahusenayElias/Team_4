import React, { useState, useEffect } from "react";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import HeroImage from "../components/HeroImage";
import ProseWrapper from "../components/ProseWrapper";
import ParagraphRenderer from "../components/ParagraphRenderer";
import "../css/AboutCards.css";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [included, setIncluded] = useState([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const includes = [
          "field_about_us",
          "field_about_us.field_image",
          "field_about_us.field_image.field_media_image",
          "field_image_about",
          "field_image_about.field_media_image",
        ].join(",");

        const url = `${drupalLocalhostAddress}/jsonapi/node/about_us?include=${includes}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("API Response:", {
          data: data.data,
          included: data.included,
          paragraphs: data.included?.filter((item) =>
            item.type.startsWith("paragraph--")
          ),
          mediaItems: data.included?.filter(
            (item) => item.type === "media--image"
          ),
          fileItems: data.included?.filter(
            (item) => item.type === "file--file"
          ),
        });

        if (!response.ok) {
          console.error("Response error:", data);
          throw new Error("Failed to fetch about data");
        }

        if (data.data && data.data.length > 0) {
          const aboutPage = data.data[0];

          // Find the image
          const imageMediaId =
            aboutPage.relationships.field_image_about?.data?.id;
          const imageMedia = data.included?.find(
            (item) => item.id === imageMediaId && item.type === "media--image"
          );
          const imageFileId =
            imageMedia?.relationships?.field_media_image?.data?.id;
          const imageFile = data.included?.find(
            (item) => item.id === imageFileId && item.type === "file--file"
          );

          // Construct image URL
          const imageUrl = imageFile
            ? `${drupalLocalhostAddress}${imageFile.attributes.uri.url}`
            : null;

          // Extract paragraphs
          const paragraphs = aboutPage.relationships.field_about_us?.data
            ?.map((paragraphRef) => {
              return data.included?.find((item) => item.id === paragraphRef.id);
            })
            .filter(Boolean);

          setAboutData({
            ...aboutPage,
            paragraphs,
          });
          setImageUrl(imageUrl);
          setIncluded(data.included || []);
        } else {
          throw new Error("No about data found");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <div className="text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!aboutData) {
    return <div className="text-lg">About data not found</div>;
  }

  return (
    <Section>
      <SectionHeading>{aboutData.attributes.title}</SectionHeading>
      {imageUrl && (
        <HeroImage src={imageUrl} alt={aboutData.attributes.title} />
      )}
      <ProseWrapper>
        <div
          dangerouslySetInnerHTML={{
            __html: aboutData.attributes.field_about_body.processed,
          }}
        />
      </ProseWrapper>

      <div className="about-cards">
        {aboutData.paragraphs &&
          aboutData.paragraphs.map((paragraph, index) => (
            <ParagraphRenderer
              key={index}
              paragraph={paragraph}
              included={included}
            />
          ))}
      </div>

      {/* dynamically added text... */}
      {aboutData.attributes.field_text && (
        <p className="mt-8 text-xl font-semibold">
          {aboutData.attributes.field_text}
        </p>
      )}
    </Section>
  );
};

export default About;
