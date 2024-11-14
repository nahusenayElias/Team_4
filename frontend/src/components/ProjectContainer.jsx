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

          const heroImageId = project.relationships.field_heroimg?.data?.id;
          const heroImage = data.included?.find(
            (img) => img.id === heroImageId && img.type === "file--file"
          );
          const heroImageUrl = heroImage
            ? `${drupalLocalhostAddress}${heroImage.attributes.uri.url}`
            : null;

          return {
            id: project.id,
            title,
            customer: field_customer,
            description: field_project_description,
            heroImageUrl,
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
    <div className="flex flex-wrap justify-between gap-6 p-6">
      {projects.map((project) => (
        <div className="w-full sm:w-1/2 lg:w-2/5 xl:w-2/5" key={project.id}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
};

export default ProjectContainer;
