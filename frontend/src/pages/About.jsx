import { useState, useEffect } from "react";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import ParagraphRenderer from "../components/ParagraphRenderer";
import "../css/AboutCards.css";
import HeroHeader from "../components/HeroHeader";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [included, setIncluded] = useState([]);
  const navigate = useNavigate();

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
        // console.log(url);
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
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
          const heroImageAltText =
            imageMedia.relationships?.field_media_image?.data?.meta?.alt ||
            "About us hero image";

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
            heroImageAltText,
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
    <>
      <HeroHeader imageUrl={imageUrl} content={aboutData} />
      <Section>
        <div
          className="w-full mx-auto my-8 prose lg:text-4xl md:text-3xl sm:text-2xl text-center max-w-4xl"
          dangerouslySetInnerHTML={{
            __html: aboutData.attributes.field_about_body.processed,
          }}
        />
        <div className="flex justify-center items-center">
          <button
            className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-72 p-3 m-5"
            onClick={() => navigate("/services")}
          >
            Check out our services <FaArrowRightLong className="ml-4" />
          </button>
        </div>
      </Section>
      <Section>
        <div className="about-cards mx-auto w-full">
          {aboutData.paragraphs &&
            aboutData.paragraphs.map((paragraph, index) => (
              <ParagraphRenderer
                key={index}
                paragraph={paragraph}
                included={included}
              />
            ))}
        </div>
        <div className="flex justify-center items-center">
          <button
            className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-72 p-3 m-5"
            onClick={() => navigate("/projects")}
          >
            Check out our projects <FaArrowRightLong className="ml-4" />
          </button>
        </div>

        <h2 className="section-title text-center">Druid in numbers</h2>
        <div className="flex justify-center items-center">
          <div className="info-cards">
            <div className="card">
              <h3 className="card-value">
                {aboutData.attributes.field_annual_turnover}
              </h3>
              <p className="card-label text-2xl">Annual Turnover</p>
            </div>

            <div className="card">
              <h3 className="card-value">
                {aboutData.attributes.field_employees}
              </h3>
              <p className="card-label text-2xl">Employees</p>
            </div>
            <div className="card">
              <h3 className="card-value">
                {aboutData.attributes.field_completed_projects}
              </h3>
              <p className="card-label text-2xl">Completed Projects</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-48 p-2 m-5"
            onClick={() => navigate("/contact")}
          >
            Contact us <FaArrowRightLong className="ml-4" />
          </button>
        </div>
      </Section>
    </>
  );
};

export default About;
