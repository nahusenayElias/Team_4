import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { drupalLocalhostAddress } from "../services/api";
import DOMPurify from "dompurify";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import Section from "../components/Section";
import ProseWrapper from "../components/ProseWrapper";
import { FaArrowLeftLong } from "react-icons/fa6";

const API_BASE_URL = `${drupalLocalhostAddress}`;

const ServiceDetail = () => {
  const { serviceType } = useParams();
  const [service, setService] = useState(null);
  const [data, setData] = useState(null);
  // made a new usestate for fetching the heroimage
  const navigate = useNavigate();

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

  const sanitizedLongDescContent = DOMPurify.sanitize(
    service.attributes.field_long_description?.value
  );

  return (
    <div className="service-detail flex justify-center items-center">
      <Section>
        <button
          className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-56 p-2 m-5"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeftLong className="mr-4" /> Back to Services
        </button>
        {getHeroImageUrl(data) && (
          <HeroImage
            src={getHeroImageUrl(data)}
            altText={service.relationships?.field_hero_image?.data?.meta?.alt}
            className="hero-image"
          />
        )}
        <SectionHeading className="text-2xl font-bold">
          {service.attributes.title}
        </SectionHeading>
        <ProseWrapper>
          <div
            className="text-left"
            dangerouslySetInnerHTML={{ __html: sanitizedLongDescContent }}
          ></div>
        </ProseWrapper>
      </Section>
    </div>
  );
};

export default ServiceDetail;
