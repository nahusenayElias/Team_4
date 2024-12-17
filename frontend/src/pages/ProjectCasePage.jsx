import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { drupalLocalhostAddress } from "../services/api";
import ParagraphRenderer from "../components/ParagraphRenderer";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import { FaArrowLeftLong } from "react-icons/fa6";

const ProjectCasePage = () => {
  // companyName is used as the path to individual project
  const { companyName } = useParams();
  const [project, setProject] = useState(null);
  const [included, setIncluded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/node/project_case?include=field_heroimg,field_content.field_image.field_media_image`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }

        if (data.data) {
          const projectDetail = data.data.find(
            (project) =>
              project.attributes.field_customer
                .toLowerCase()
                .replace(/\s+/g, "-") === companyName
          );

          if (!projectDetail) {
            throw new Error(`Project not found for company: ${companyName}`);
          }

          const { title, field_customer, field_project_description } =
            projectDetail.attributes;

          // Find hero image
          const heroImageId =
            projectDetail.relationships.field_heroimg?.data?.id;
          const heroImage = data.included?.find(
            (img) => img.id === heroImageId && img.type === "file--file"
          );

          const heroImageUrl = heroImage
            ? `${drupalLocalhostAddress}${heroImage.attributes.uri.url}`
            : null;

          const heroImageAltText =
            projectDetail.relationships.field_heroimg?.data?.meta?.alt;

          // Process paragraphs while keeping the full paragraph data
          const paragraphs = projectDetail.relationships.field_content?.data
            ?.map((content) => {
              const paragraphData = data.included?.find(
                (item) =>
                  item.id === content.id && item.type.startsWith("paragraph--")
              );
              return paragraphData
                ? {
                    type: paragraphData.type,
                    attributes: paragraphData.attributes,
                    relationships: paragraphData.relationships,
                  }
                : null;
            })
            .filter(Boolean);

          setProject({
            title,
            customer: field_customer,
            description: field_project_description,
            heroImageUrl,
            heroImageAltText,
            paragraphs,
          });
          setIncluded(data.included || []);
        }
      } catch (error) {
        console.error("Error fetching project detail:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [companyName]);

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

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Project not found</div>
      </div>
    );
  }

  return (
    <>
      {project.heroImageUrl && (
        <HeroImage
          src={project.heroImageUrl}
          altText={project.heroImageAltText}
        />
      )}
      <Section>
        <header className="mb-8 flex flex-col items-center justify-center">
          <SectionHeading>{project.customer}</SectionHeading>
          <h2 className="text-xl font-semibold">{project.title}</h2>

          <p className="w-3/4 bg-gray-100 p-4 rounded-md mt-4 text-2xl text-gray-700 leading-relaxed">
            {project.description}
          </p>
        </header>
        <div className="space-y-8 flex flex-col items-center justify-center">
          {project.paragraphs?.map((paragraph, index) => (
            <ParagraphRenderer
              key={`${paragraph.type}-${index}`}
              paragraph={paragraph}
              included={included}
            />
          ))}
        </div>
        <div className="flex justify-center items-center">
          <button
            className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-64 py-2 my-5"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeftLong className="mr-4" /> Back
          </button>
        </div>
      </Section>
    </>
  );
};

export default ProjectCasePage;
