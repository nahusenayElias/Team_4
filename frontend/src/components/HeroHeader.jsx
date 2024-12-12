const HeroHeader = ({ imageUrl, content }) => {
  return (
    <div
      className="h-96 bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
      }}
    >
      <div className="flex flex-col justify-center items-center p-4">
        {content?.attributes?.title && (
          <h1 className="text-5xl font-sans font-semibold text-white text-center max-w-3xl leading-tight">
            {content.attributes.title}
          </h1>
        )}
      </div>
    </div>
  );
};

export default HeroHeader;
