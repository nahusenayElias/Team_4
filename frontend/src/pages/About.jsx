import React, { useState, useEffect } from 'react';
import { drupalLocalhostAddress } from '../services/api';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/node/about_us?include=field_image_about.field_media_image,field_about_us`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch about data");
        }

        if (data.data && data.data.length > 0) {
          const aboutPage = data.data[0];

          // Find the image
          const imageMediaId = aboutPage.relationships.field_image_about?.data?.id;
          const imageMedia = data.included?.find(
            (item) => item.id === imageMediaId && item.type === 'media--image'
          );
          const imageFileId = imageMedia?.relationships?.field_media_image?.data?.id;
          const imageFile = data.included?.find(
            (item) => item.id === imageFileId && item.type === 'file--file'
          );

          // Construct image URL
          const imageUrl = imageFile
            ? `${drupalLocalhostAddress}${imageFile.attributes.uri.url}`
            : null;

          // Find additional text paragraphs
          const paragraphs = aboutPage.relationships.field_about_us?.data?.map((paragraphRef) => {
            const paragraph = data.included?.find(
              (item) => item.id === paragraphRef.id && item.type === 'paragraph--text'
            );
            return paragraph;
          }).filter(Boolean);

          setAboutData({
            ...aboutPage,
            paragraphs
          });
          setImageUrl(imageUrl);
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

  if (!aboutData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">About data not found</div>
      </div>
    );
  }

  return (
    <Section>
      <SectionHeading>{aboutData.attributes.title}</SectionHeading>

      {/* Main body text */}
      <div
        className="mt-8 prose max-w-full"
        dangerouslySetInnerHTML={{ __html: aboutData.attributes.field_about_body.processed }}
      />

      {/* Image */}
      {imageUrl && (
        <div className="mt-8 mb-8">
          <img
            src={imageUrl}
            alt="About Us"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Additional text paragraphs*/}
      {aboutData.paragraphs && aboutData.paragraphs.map((paragraph, index) => (
        <div
          key={index}
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: paragraph.attributes.field_text?.processed || paragraph.attributes.field_text
          }}
        />
      ))}

      {/* Additional text field
      {aboutData.attributes.field_text && (
        <p className="mt-8 text-xl font-semibold">
          {aboutData.attributes.field_text}
        </p>
      )}
        */}
    </Section>
  );
};

export default AboutPage;