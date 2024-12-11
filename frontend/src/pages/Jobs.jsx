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
      <div
        className="h-68 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-16 xl:px-20">
          <h1 className="text-3xl leading-tight font-bold text-white">
            For developers by developers
          </h1>

          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Apply now
          </button>
        </div>
      </div>
      {imageUrl && (
        <HeroImage
          src={imageUrl}
          altText={content.relationships?.field_image?.data?.meta?.alt}
        />
      )}

      <Section>
        {content && content.attributes && (
          <SectionHeading>{content.attributes.title}</SectionHeading>
        )}

        <ProseWrapper>
          {sanitizedDrupalContent ? (
            <div className="flex flex-col items-center justify-center">
              <div
                dangerouslySetInnerHTML={{ __html: sanitizedDrupalContent }}
                className="text-orange-600 text-left"
              />
              <button className="bg-orange-600 w-48 rounded-full text-white p-2 m-2 hover:bg-orange-800">
                All jobs {">"}
              </button>
            </div>
          ) : (
            <div className="text-left text-gray-500">no content found</div>
          )}
        </ProseWrapper>
        {included[1] && included[1].attributes ? (
          <div className="flex items-center justify-center bg-gray-200 p-3 m-3">
            <SectionHeading>
              <span className="m-2 p-2">
                {included[1].attributes.field_about_title}
              </span>
            </SectionHeading>
            <ProseWrapper>
              <span className="m-2 p-2">
                {included[1].attributes.field_about_body.value}
              </span>
            </ProseWrapper>
          </div>
        ) : (
          ""
        )}
      </Section>
    </>
  );
};

export default Jobs;
