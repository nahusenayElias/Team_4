const ProjectCard = ({ project }) => {
  const { title, customer, description, heroImageUrl } = project;

  return (
    <div className="project-card">
      <h2>{title}</h2>
      <h3>{customer}</h3>
      <p>{description}</p>
      {heroImageUrl ? (
        <img src={heroImageUrl} alt={title} className="project-hero-image" />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default ProjectCard;
