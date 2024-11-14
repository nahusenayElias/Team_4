import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { drupalLocalhostAddress } from "../services/api";

const ProjectDetail = () => {
  const { companyName } = useParams(); // Extract company name from URL
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/node/project_case?include=field_heroimg,field_content`
        );
        const data = await response.json();

        if (data.data) {
          // Find the project with a matching company name
          const projectDetail = data.data.find(
            (project) =>
              project.attributes.field_customer
                .toLowerCase()
                .replace(/\s+/g, "-") === companyName
          );

          if (projectDetail) {
            const { title, field_customer, field_project_description } =
              projectDetail.attributes;

            const heroImageId =
              projectDetail.relationships.field_heroimg?.data?.id;
            const heroImage = data.included?.find(
              (img) => img.id === heroImageId && img.type === "file--file"
            );
            const heroImageUrl = heroImage
              ? `${drupalLocalhostAddress}${heroImage.attributes.uri.url}`
              : null;

            const paragraphs = projectDetail.relationships.field_content?.data
              ?.map((content) => {
                const paragraphData = data.included?.find(
                  (item) =>
                    item.id === content.id &&
                    item.type.startsWith("paragraph--")
                );
                return paragraphData
                  ? {
                      type: paragraphData.type,
                      content: paragraphData.attributes,
                    }
                  : null;
              })
              .filter(Boolean);

            setProject({
              title,
              customer: field_customer,
              description: field_project_description,
              heroImageUrl,
              paragraphs,
            });
          } else {
            console.error("Project not found for company:", companyName);
          }
        }
      } catch (error) {
        console.error("Error fetching project detail:", error);
      }
    };

    fetchProjectDetail();
  }, [companyName]); // Re-fetch when companyName changes

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {project.heroImageUrl && (
          <img
            src={project.heroImageUrl}
            alt={project.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <h1 className="text-3xl font-semibold mt-4">{project.title}</h1>
        <h2 className="text-lg text-gray-500">{project.customer}</h2>
        <p className="mt-4">{project.description}</p>

        <div className="mt-6">
          {project.paragraphs?.map((paragraph, index) => (
            <div key={index} className="mt-4">
              <h3 className="font-semibold">{paragraph.type}</h3>
              <p>{paragraph.content.body?.value}</p>{" "}
              {/* Display paragraph content */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
