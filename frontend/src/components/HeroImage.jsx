const HeroImage = ({ src, altText }) => {
  return (
    <img
      src={src}
      alt={altText || "Alt text not available"}
      className={`w-full h-64 object-cover rounded-md mb-6`}
    />
  );
};

export default HeroImage;
