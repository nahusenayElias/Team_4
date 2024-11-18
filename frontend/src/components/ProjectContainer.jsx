import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { drupalLocalhostAddress } from "../services/api";

const API_URL = `${drupalLocalhostAddress}/jsonapi/node/project_case?include=field_heroimg,field_content`;

const ProjectContainer = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.data) {
          console.error("No project data found in response");
          return;
        }

        const formattedProjects = data.data.map((project) => {
          const { title, field_customer, field_project_description } =
            project.attributes;

          // Get hero image
          const heroImageId = project.relationships.field_heroimg?.data?.id;
          const heroImage = data.included?.find(
            (img) => img.id === heroImageId && img.type === "file--file"
          );
          const heroImageUrl = heroImage
            ? `${drupalLocalhostAddress}${heroImage.attributes.uri.url}`
            : null;

          // Process paragraphs in field_content relationship
          const paragraphs =
            project.relationships.field_content?.data
              ?.map((content) => {
                const paragraphData = data.included?.find(
                  (item) =>
                    item.id === content.id &&
                    item.type.startsWith("paragraph--")
                );

                if (paragraphData) {
                  return {
                    type: paragraphData.type,
                    content: paragraphData.attributes,
                  };
                }

                return null;
              })
              .filter(Boolean) || []; // Default to empty array if no paragraphs are found

          return {
            id: project.id,
            title,
            customer: field_customer,
            description: field_project_description,
            heroImageUrl,
            paragraphs,
          };
        });

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching project cases:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap justify-start gap-6">
        {projects.map((project) => (
          <div className="flex-grow sm:w-1/2 md:w-1/3" key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectContainer;