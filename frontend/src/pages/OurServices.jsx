import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { drupalLocalhostAddress } from "../services/api";

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
    <div>
      {Object.entries(services).map(([serviceType, items]) => (
        <section key={serviceType}>
          <h1>
            {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}{" "}
            Services
          </h1>
          {items.map((item) => (
            <div key={item.id} className="service-item">
              <Link to={`/service/${serviceType}/${item.id}`}></Link>
              {item.heroImageUrl && (
                <img
                  src={item.heroImageUrl}
                  alt={item.attributes.title}
                  className="hero-image"
                />
              )}
              <p>{item.attributes.field_short_description}</p>
              <div
                dangerouslySetInnerHTML={{
                  __html: item.attributes.field_long_description?.processed,
                }}
              />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};

export default OurServices;
