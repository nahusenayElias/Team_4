import React, { useState, useEffect } from "react";
import { drupalLocalhostAddress } from "../services/api";
import DOMPurify from 'dompurify';
import Section from '../components/Section';
import HeroImage from '../components/HeroImage';
import SectionHeading from '../components/SectionHeading';
import ProseWrapper from "../components/ProseWrapper";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/node/blog_paragraph?include=field_paragraph_blog,field_paragraph_blog.field_blog_media,field_paragraph_blog.field_blog_media.field_media_image,uid`
        );
        const data = await response.json();

        const blogData = data.data.map((item) => {
          const paragraphData = data.included.find(
            inc => inc.type === 'paragraph--blog_paragraph' && inc.id === item.relationships.field_paragraph_blog.data[0].id
          );

          let mediaUrl = null;
          const mediaId = paragraphData?.relationships.field_blog_media?.data?.id;
          if (mediaId) {
            const media = data.included.find(inc => inc.type === 'media--image' && inc.id === mediaId);
            if (media) {
              const fileId = media.relationships.field_media_image?.data?.id;
              const file = data.included.find(inc => inc.type === 'file--file' && inc.id === fileId);
              if (file && file.attributes?.uri?.url) {
                mediaUrl = `${drupalLocalhostAddress}${file.attributes.uri.url}`;
              }
            }
          }

          const authorId = item.relationships.uid?.data?.id;
          const author = data.included.find(inc => inc.type === 'user--user' && inc.id === authorId);
          const authorName = author ? author.attributes.display_name : 'Unknown';

          return {
            id: item.id,
            title: paragraphData?.attributes.field_title_parag?.processed || item.attributes.title,
            shortText: paragraphData?.attributes.field_blog_short_text,
            body: paragraphData?.attributes.field_blog_body?.value,
            mediaUrl: mediaUrl,
            authorName: authorName,
            date: item.attributes.created,
          };
        });

        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogPost key={blog.id} blog={blog} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const BlogPost = ({ blog }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <Section>
      <div>
        <SectionHeading>
          <h1>{blog.title}</h1>
        </SectionHeading>
        <p>
          <strong>Author:</strong> {blog.authorName}
        </p>
        <p>
          <strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}
        </p>
        {blog.mediaUrl && (
          <div>
            <HeroImage src={blog.mediaUrl} alt={blog.title} />
          </div>
        )}
        <ProseWrapper>
          <h2>Short Description</h2>
          <p>{blog.shortText}</p>
        </ProseWrapper>
        <span
              onClick={toggleContent}
              className="text-blue-600 cursor-pointer hover:text-blue-800 font-semibold"
            >
              {showFullContent ? 'Show Less' : 'Read More'}
            </span>
         
        {showFullContent && (
          <div className="full-content">
            <ProseWrapper>
              <h2>Full Content</h2>
              <div dangerouslySetInnerHTML={sanitizeHTML(blog.body)} />
            </ProseWrapper>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Blog;