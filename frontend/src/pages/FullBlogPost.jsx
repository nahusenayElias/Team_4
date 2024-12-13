import DOMPurify from "dompurify";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import ProseWrapper from "../components/ProseWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect } from "react";

const FullBlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state || {}; // Get blog object from location.state

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  return (
    <Section>
      <div className="max-w-4xl mx-auto">
        {blog.mediaUrl && (
          <HeroImage
            src={blog.mediaUrl}
            altText={blog.mediaAltText}
            className="mb-6 rounded-md"
          />
        )}
        <h3 className="text-2xl text-left mb-2">{blog.title}</h3>
        <p className="text-sm text-gray-500">
          <strong>Author:</strong> {blog.authorName}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}
        </p>
        <ProseWrapper>
          <div dangerouslySetInnerHTML={sanitizeHTML(blog.body)} />
        </ProseWrapper>
        <button
          className="flex justify-center items-center bg-orange-600 text-white text-xl hover:bg-orange-900 text-center rounded-full shadow-md w-32 py-2 my-5"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeftLong className="mr-4" /> Back
        </button>
      </div>
    </Section>
  );
};

export default FullBlogPost;
