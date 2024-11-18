import { useEffect, useState } from "react";
import { fetchContent, drupalLocalhostAddress } from "../services/api";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";
import CompanyStats from "../components/CompanyStats";
import DOMPurify from "dompurify";

const About = () => {
  const [content, setContent] = useState(null);
  const [included, setIncluded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sanitizedIntro, setSanitizedIntro] = useState(null);
  const [sanitizedBody, setSanitizedBody] = useState(null);

  useEffect(() => {
    fetchContent("node/aboutpage?include=field_image")
      .then((data) => {
        const [intro, ...body] = DOMPurify.sanitize(data.data[0]?.attributes?.body?.value || "").split("</p>");
        setContent(data.data[0]);
        setIncluded(data.included);
        setSanitizedIntro(intro + "</p>");
        setSanitizedBody(body.join("</p>"));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching content:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading content: {error.message}</div>;

  const imageUrl = included?.find((image) => image.id === content?.relationships?.field_image?.data?.id)?.attributes?.uri.url;
  const imageAltText = included?.find((image) => image.id === content?.relationships?.field_image?.data?.id)?.meta?.alt;

  return (
    <div>
      {/* Hero and Introductory Section */}
      <div className="flex flex-col md:flex-row w-full h-auto md:h-[95vh] mt-4 md:mt-0">
        {imageUrl && (
          <div className="w-full h-64 md:w-1/2 md:h-full mb-4 md:mb-0 mt-6 md:mt-0 px-10 md:px-0">
            <img
              src={`${drupalLocalhostAddress}${imageUrl}`}
              alt={imageAltText || "Hero image"}
              className="object-cover w-full h-full rounded-lg md:rounded-none mx-auto"
            />
          </div>
        )}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-6 md:p-16 bg-gray-50 text-center md:text-left mt-4 md:mt-0">
          {content?.attributes?.title && (
            <SectionHeading className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-6">
              {content.attributes.title}
            </SectionHeading>
          )}
          {sanitizedIntro && (
            <ProseWrapper>
              <div
                className="prose prose-base md:prose-lg text-gray-600 mt-2 leading-relaxed max-w-full md:max-w-lg"
                dangerouslySetInnerHTML={{ __html: sanitizedIntro }}
              />
            </ProseWrapper>
          )}
        </div>
      </div>

      {/* Body Content */}
      {sanitizedBody && (
        <div className="flex justify-center items-center w-full px-4 md:px-12 py-12 md:py-24 bg-white">
          <ProseWrapper>
            <div
              className="prose prose-sm md:prose-lg text-gray-700 leading-relaxed text-center md:text-left max-w-full md:max-w-3xl"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />
          </ProseWrapper>
        </div>
      )}

      {/* Company Stats Component */}
      <CompanyStats />
    </div>
  );
};

export default About;
