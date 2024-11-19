import { useEffect, useState } from "react";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";

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
        const mediaData = data.included.find(item => item.type === 'media--image');
        const fileData = data.included.find(item => item.type === 'file--file');

        const imageUrl = fileData ? `${drupalLocalhostAddress}${fileData.attributes.uri.url}` : null;

        setAbout({
          title: attributes.field_about_title,
          body: attributes.field_about_body.value,
          imageUrl,
          imageAlt: mediaData?.relationships.field_media_image.data.meta.alt || "About Us"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">About content not found</div>
      </div>
    );
  }

  return (
    <Section>
      {about.imageUrl && (
        <HeroImage src={about.imageUrl} alt={about.imageAlt} />
      )}
      <header className="mb-8">
        <SectionHeading>{about.title}</SectionHeading>
      </header>
      <div className="space-y-8">
        <div dangerouslySetInnerHTML={{ __html: about.body }} />
      </div>
    </Section>
  );
};

export default About;