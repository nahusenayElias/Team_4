import React, { useState, useEffect, useRef } from "react";
import { drupalLocalhostAddress } from "../services/api";
import DOMPurify from "dompurify";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import SectionHeading from "../components/SectionHeading";
import ProseWrapper from "../components/ProseWrapper";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/node/blog_paragraph?include=field_paragraph_blog,field_paragraph_blog.field_blog_media,field_paragraph_blog.field_blog_media.field_media_image,uid`
        );
        const data = await response.json();

        const blogData = data.data.map((item) => {
          const paragraphData = data.included.find(
            (inc) =>
              inc.type === "paragraph--blog_paragraph" &&
              inc.id === item.relationships.field_paragraph_blog.data[0].id
          );

          let mediaUrl = null;
          const mediaId =
            paragraphData?.relationships.field_blog_media?.data?.id;
          if (mediaId) {
            const media = data.included.find(
              (inc) => inc.type === "media--image" && inc.id === mediaId
            );
            if (media) {
              const fileId = media.relationships.field_media_image?.data?.id;
              const file = data.included.find(
                (inc) => inc.type === "file--file" && inc.id === fileId
              );
              if (file && file.attributes?.uri?.url) {
                mediaUrl = `${drupalLocalhostAddress}${file.attributes.uri.url}`;
              }
            }
          }

          const authorId = item.relationships.uid?.data?.id;
          const author = data.included.find(
            (inc) => inc.type === "user--user" && inc.id === authorId
          );
          const authorName = author
            ? author.attributes.display_name
            : "Unknown";

          return {
            id: item.id,
            title:
              item.attributes.title ||
              paragraphData?.attributes.field_title_parag?.processed,
            shortText: paragraphData?.attributes.field_blog_short_text,
            body: paragraphData?.attributes.field_blog_body?.value,
            mediaUrl: mediaUrl,
            authorName: authorName,
            date: item.attributes.created,
          };
        });

        console.log("Fetched data:", data);
        console.log("Mapped blog data:", blogData);

        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleShowLess = () => {
    setSelectedBlog(null);
  };

  return (
    <div ref={topRef}>
      {selectedBlog ? (
        <FullBlogPost blog={selectedBlog} onShowLess={handleShowLess} />
      ) : blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogPost key={blog.id} blog={blog} onReadMore={handleReadMore} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const BlogPost = ({ blog, onReadMore }) => {
  return (
    <Section>
      <div>
        <SectionHeading>{blog.title}</SectionHeading>

        {blog.mediaUrl && <HeroImage src={blog.mediaUrl} alt={blog.title} />}
        <p className="text-gray-500 text-sm">
          <strong>Author:</strong> {blog.authorName}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}
        </p>
        <ProseWrapper>
          <p>{blog.shortText}</p>
        </ProseWrapper>
        <span
          onClick={() => onReadMore(blog)}
          className="text-orange-600 cursor-pointer hover:text-gray-800 font-semibold"
        >
          Read More
        </span>
      </div>
    </Section>
  );
};

const FullBlogPost = ({ blog, onShowLess }) => {
  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <Section>
      <div>
        {blog.mediaUrl && <HeroImage src={blog.mediaUrl} alt={blog.title} />}
        <SectionHeading>{blog.title}</SectionHeading>
        <p className="text-sm text-gray-500">
          <strong>Author:</strong> {blog.authorName}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}
        </p>
        <ProseWrapper>
          <div dangerouslySetInnerHTML={sanitizeHTML(blog.body)} />
        </ProseWrapper>
        <span
          onClick={onShowLess}
          className="text-orange-600 cursor-pointer hover:text-gray-800 font-semibold"
        >
          Show Less
        </span>
      </div>
    </Section>
  );
};

export default Blog;
