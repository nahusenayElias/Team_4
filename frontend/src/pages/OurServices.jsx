import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";

const API_BASE_URL = `${drupalLocalhostAddress}/jsonapi`;

const API_ENDPOINTS = {
  project: `${API_BASE_URL}/node/project?include=field_hero_image`,
  maintenance: `${API_BASE_URL}/node/maintenance?include=field_hero_image`,
  consultation: `${API_BASE_URL}/node/consultation?include=field_hero_image`,
};

const OurServices = () => {
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

        return {
          ...item,
          heroImageUrl,
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
    fetchContent("project");
    fetchContent("maintenance");
    fetchContent("consultation");
  }, []);

  return (
    <Section>
      {Object.entries(services).map(([serviceType, items]) => (
        <section key={serviceType} className="mb-12">
          <h1 className="text-2xl font-bold mb-4">
            {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}{" "}
            Services
          </h1>
          {items.map((item) => (
            <div key={item.id} className="service-item mb-8">
              <Link to={`/service/${serviceType}/${item.id}`} className="block">
                {item.heroImageUrl && (
                  <div>
                    <HeroImage src={item.heroImageUrl} />
                    <SectionHeading>{item.attributes.title}</SectionHeading>
                  </div>
                )}

                <ProseWrapper>
                  <p className="text-gray-700 mb-2">
                    {item.attributes.field_short_description}
                  </p>
                  <div
                    className="prose" // Apply Tailwind typography styles here
                    dangerouslySetInnerHTML={{
                      __html: item.attributes.field_long_description?.processed,
                    }}
                  />
                </ProseWrapper>
              </Link>
            </div>
          ))}
        </section>
      ))}
    </Section>
  );
};

export default OurServices;
