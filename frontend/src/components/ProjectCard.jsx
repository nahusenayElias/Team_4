import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const { customer, description, heroImageUrl, heroImageAltText } = project;
  const companyName = customer?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full h-full flex flex-col">
      <div className="h-64">
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={heroImageAltText}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* <h2 className="text-xl font-semibold text-gray-800">{title}</h2> */}
        <h3 className="text-xl text-gray-600 mb-2">{customer}</h3>
        <p className="text-gray-500 text-sm md:text-base flex-grow mb-3">
          {description.split(". ").slice(0, 2).join(". ")}
        </p>
        <Link
          to={`/projects/${companyName}`} // Link to the detailed page using company name
          className="text-orange-500 hover:text-orange-700 block text-sm font-semibold mt-auto"
        >
          Read More{" "}
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
