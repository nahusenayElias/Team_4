import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const API_BASE_URL = `${drupalLocalhostAddress}/jsonapi`;

const API_ENDPOINTS = {
  project: `${API_BASE_URL}/node/project?include=field_hero_image`,
  maintenance: `${API_BASE_URL}/node/maintenance?include=field_hero_image`,
  consultation: `${API_BASE_URL}/node/consultation?include=field_hero_image`,
};

const OurServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState({
    project: [],
    maintenance: [],
    consultation: [],
  });

  const fetchContent = async (type) => {
    try {
      const response = await fetch(API_ENDPOINTS[type]);
      const data = await response.json();

      const itemsWithImages = data.data.map((item) => {
        const heroImageId = item.relationships.field_hero_image?.data?.id;
        const heroImage = data.included?.find(
          (img) => img.id === heroImageId && img.type === "file--file"
        );
        const heroImageUrl = heroImage
          ? `${drupalLocalhostAddress}${heroImage.attributes.uri.url}`
          : null;

        // Sanitize long description content
        const sanitizedLongDescription = DOMPurify.sanitize(
          item.attributes.field_long_description?.processed || ""
        );

        return {
          ...item,
          heroImageUrl,
          sanitizedLongDescription,
        };
      });

      setServices((prevServices) => ({
        ...prevServices,
        [type]: itemsWithImages,
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContent("project");
    fetchContent("maintenance");
    fetchContent("consultation");
  }, []);

  return (
    <Section>
      <SectionHeading>Our Services</SectionHeading>
      <div className="flex justify-center items-center">
        <button
          className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-48 p-2 m-5"
          onClick={() => navigate("/contact")}
        >
          Get in touch <FaArrowRightLong className="ml-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {Object.entries(services).map(([serviceType, items]) => (
          <div key={serviceType} className="mb-12">
            {items.map((item) => (
              <div
                key={item.id}
                className="service-item w-75 h-full mb-8 p-8 border-2 border-gray-100 rounded-lg shadow-md"
              >
                <Link
                  to={`/services/${serviceType}`}
                  className="h-full flex flex-col"
                >
                  {item.heroImageUrl && (
                    <div>
                      <HeroImage
                        src={item.heroImageUrl}
                        altText={
                          item.relationships.field_hero_image?.data?.meta.alt
                        }
                      />
                      <SectionHeading>{item.attributes.title}</SectionHeading>
                    </div>
                  )}

                  <ProseWrapper>
                    <span className="text-gray-500 flex-grow">
                      {item.attributes.field_short_description}
                    </span>
                  </ProseWrapper>
                  <span className="text-orange-400 hover:text-orange-700 text-center block m-2 p-2 border-2 border-orange-400 rounded-lg shadow-md mt-auto">
                    Read more
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default OurServices;
