import React, { useState, useEffect } from "react";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import ProseWrapper from "../components/ProseWrapper";
import ParagraphRenderer from "../components/ParagraphRenderer";
import ProjectContainer from "../components/ProjectContainer";
import HeroHeader from "../components/HeroHeader";
import groupPicture from "../assets/images/group-picture.png";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
  const [frontPageData, setFrontPageData] = useState(null);
  const [heroImageUrl, setHeroImageUrl] = useState(null);
  const [heroImageAltText, setHeroImageAltText] = useState("Hero image");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [included, setIncluded] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFrontPageData = async () => {
      try {
        setLoading(true);
        const includes = [
          "field_heroimg",
          "field_content",
          "field_content.field_image",
          "field_content.field_image.field_media_image",
          "field_media",
          "field_media.field_media_image",
        ].join(",");

        const url = `${drupalLocalhostAddress}/jsonapi/node/front_page?include=${includes}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch front page data");
        }

        if (data.data && data.data.length > 0) {
          const frontPage = data.data[0];

          // Find the hero image
          const heroImageId = frontPage.relationships.field_heroimg?.data?.id;
          const heroImageFile = data.included?.find(
            (item) => item.id === heroImageId && item.type === "file--file"
          );

          if (heroImageFile) {
            const imageUri = heroImageFile.attributes.uri.url;
            const isRelativeUrl = !/^https?:\/\//i.test(imageUri);
            const fullHeroImageUrl = isRelativeUrl
              ? `${drupalLocalhostAddress}${imageUri}`
              : imageUri;

            setHeroImageUrl(fullHeroImageUrl);
            setHeroImageAltText(
              frontPage.relationships.field_heroimg.data.meta?.alt ||
                "Hero image"
            );
            // console.log("Hero image URL:", fullHeroImageUrl);
          }

          // Extract paragraphs
          const paragraphs = frontPage.relationships.field_content?.data
            ?.map((paragraphRef) => {
              return data.included?.find((item) => item.id === paragraphRef.id);
            })
            .filter(Boolean);

          setFrontPageData({
            ...frontPage,
            paragraphs,
          });
          setIncluded(data.included || []);
        } else {
          throw new Error("No front page data found");
        }
      } catch (error) {
        console.error("Error fetching front page data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFrontPageData();
  }, []);

  if (loading) {
    return <div className="text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!frontPageData) {
    return <div className="text-lg">Front page data not found</div>;
  }

  return (
    <>
      <HeroHeader imageUrl={heroImageUrl} content={frontPageData} />
      <Section>
        <div className="text-center p-5 m-5">
          {frontPageData.attributes.field_description && (
            <p className="short-description lg:text-4xl md:text-3xl sm:text-2xl p-10">
              {frontPageData.attributes.field_description}
            </p>
          )}
        </div>
        <div className="flex w-full justify-center mt-6">
          <ProseWrapper className="w-3/4">
            {frontPageData.attributes.body && (
              <div
                className="text-xl mx-10"
                dangerouslySetInnerHTML={{
                  __html: frontPageData.attributes.body.processed,
                }}
              />
            )}
            <div className="flex justify-center items-center">
              <a href="/jobs">
                <button
                  className="bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-48 p-2 m-5"
                  onClick={() => navigate("/jobs")}
                >
                  Join Druid
                </button>
              </a>
            </div>
          </ProseWrapper>
        </div>
      </Section>
      <Section>
        <div className="front-page-content flex flex-col items-center">
          {frontPageData.paragraphs &&
            frontPageData.paragraphs.map((paragraph, index) => (
              <ParagraphRenderer
                key={index}
                paragraph={paragraph}
                included={included}
              />
            ))}
        </div>
        <ProjectContainer />
      </Section>
    </>
  );
};

export default FrontPage;
