import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { drupalLocalhostAddress } from "../services/api";
import DOMPurify from "dompurify";

const API_BASE_URL = `${drupalLocalhostAddress}`;

const ServiceDetail = () => {
  const { serviceType, serviceId } = useParams();
  const [service, setService] = useState(null);

  const fetchServiceDetail = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/node/${serviceType}/${serviceId}?include=field_hero_image`
      );
      const data = await response.json();
      setService(data.data);
    } catch (error) {
      console.error("Error fetching service detail:", error);
    }
  };

  useEffect(() => {
    fetchServiceDetail();
  }, [serviceType, serviceId]);

  const getHeroImageUrl = (content) => {
    const imagePath =
      content?.relationships?.field_hero_image?.data?.attributes?.uri?.url;
    return imagePath ? `${drupalLocalhostAddress}${imagePath}` : null;
  };

  if (!service) return <p>Loading...</p>;

  // Sanitize the body content
  const sanitizedBodyContent = DOMPurify.sanitize(
    service.attributes.body?.value
  );

  return (
    <div className="service-detail">
      <h1>Our Services</h1>

      {getHeroImageUrl(service) && (
        <img
          src={getHeroImageUrl(service)}
          alt="Service Hero"
          className="hero-image"
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: sanitizedBodyContent }}></div>
    </div>
  );
};

export default ServiceDetail;
