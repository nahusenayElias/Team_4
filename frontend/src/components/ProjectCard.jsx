import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const { title, customer, description, heroImageUrl } = project;
  const companyName = customer?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto my-4">
      {heroImageUrl ? (
        <img
          src={heroImageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-white">
          No image available
        </div>
      )}

      <div className="p-6">
        {/* <h2 className="text-xl font-semibold text-gray-800">{title}</h2> */}
        <h3 className="text-xl text-gray-600 mb-2">{customer}</h3>
        <p className="text-gray-500 text-sm line-clamp-3">{description}</p>
        <Link
          to={`/projects/${companyName}`} // Link to the detailed page using project ID
          className="text-blue-500 hover:text-blue-700 mt-4 block text-sm font-semibold"
        >
          Read More{" "}
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
