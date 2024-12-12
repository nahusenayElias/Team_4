import { useEffect, useState } from "react";
import { drupalLocalhostAddress, fetchContent } from "../services/api";
import Section from "../components/Section";
// import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";
import DOMPurify from "dompurify";
import HeroHeader from "../components/HeroHeader";

const Jobs = () => {
  const [content, setContent] = useState(null);
  const [included, setIncluded] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedDrupalContent, setSanitizedDrupalContent] = useState(null);

  useEffect(() => {
    fetchContent("node/page?include=field_image,field_paragraphs")
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

  return (
    <>
      <HeroHeader imageUrl={imageUrl} content={content} />
      <Section>
        <div className="flex flex-col items-center justify-center">
          <ProseWrapper>
            {sanitizedDrupalContent ? (
              <div className="flex flex-col items-center justify-center">
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizedDrupalContent }}
                  className="text-left text-lg"
                />
                <a href="https://careers.druid.fi/jobs">
                  <button className="bg-orange-600 w-48 rounded-full text-white p-2 m-2 hover:bg-orange-800">
                    All jobs {">"}
                  </button>
                </a>
              </div>
            ) : (
              <div className="text-left text-gray-500">no content found</div>
            )}
          </ProseWrapper>
          {included[1] && included[1].attributes ? (
            <div className="w-full flex items-center justify-center bg-gray-100 p-3 m-3 rounded-md">
              <SectionHeading>
                <span className="m-5 p-2">
                  {included[1].attributes.field_about_title}
                </span>
              </SectionHeading>
              <ProseWrapper>
                <div className="m-2 p-2">
                  {included[1].attributes.field_about_body.value}
                </div>
                <div className="m-2 p-2">
                  {included[2].attributes.field_about_body.value}
                </div>
              </ProseWrapper>
            </div>
          ) : (
            ""
          )}
          <a href="https://careers.druid.fi/jobs/1200341-open-application-for-druid">
            <button className="bg-orange-600 w-48 rounded-full text-white p-3 m-2 hover:bg-orange-800 text-lg">
              Apply now {">"}
            </button>
          </a>
        </div>
      </Section>
    </>
  );
};

export default Jobs;
