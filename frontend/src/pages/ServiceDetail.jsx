import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { drupalLocalhostAddress } from "../services/api";
import DOMPurify from "dompurify";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import Section from "../components/Section";
import ProseWrapper from "../components/ProseWrapper";

const API_BASE_URL = `${drupalLocalhostAddress}`;

const ServiceDetail = () => {
  const { serviceType } = useParams();
  const [service, setService] = useState(null);
  const [data, setData] = useState(null);
  // made a new usestate for fetching the heroimage

  const fetchServiceDetail = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/jsonapi/node/${serviceType}?include=field_hero_image`
      );
      const data = await response.json();
      setData(data);
      setService(data.data[0]);
    } catch (error) {
      console.error("Error fetching service detail:", error);
    }
  };

  useEffect(() => {
    fetchServiceDetail();
  }, [serviceType]);

  const getHeroImageUrl = (data) => {
    const imagePath = data?.included?.[0].attributes?.uri?.url;
    return imagePath ? `${drupalLocalhostAddress}${imagePath}` : null;
  };

  if (!service)
    return <p>This page is unavailable at the moment. Try again later.</p>;

  // Sanitize the body content
  const sanitizedLongDescContent = DOMPurify.sanitize(
    service.attributes.field_long_description?.value
  );

  return (
    <div className="service-detail">
      <Section>
        <SectionHeading className="text-2xl font-bold">
          {service.attributes.title}
        </SectionHeading>

        {getHeroImageUrl(data) && (
          <HeroImage
            src={getHeroImageUrl(data)}
            alt="Service Hero"
            className="hero-image"
          />
        )}
        <ProseWrapper>
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedLongDescContent }}
          ></div>
        </ProseWrapper>
      </Section>
    </div>
  );
};

export default ServiceDetail;
