import { useState, useEffect } from "react";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";
import HeroImage from "../components/HeroImage";
import ProseWrapper from "../components/ProseWrapper";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  // const [selectedBlog, setSelectedBlog] = useState(null);

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
          let mediaAltText = null;

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
              mediaAltText =
                media.relationships.field_media_image?.data?.meta?.alt;
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
            mediaAltText: mediaAltText,
            authorName: authorName,
            date: item.attributes.created,
          };
        });

        // console.log("Fetched data:", data);
        // console.log("Mapped blog data:", blogData);

        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="text-center py-10">
        <h1 className="text-5xl mb-4 mt-10">Blog</h1>
        <h2 className="text-2xl text-gray-600 m-3 p-3 text-center">
          Writings on and off topic – about our everyday life, culture, and the
          world of software development
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogPost key={blog.id} blog={blog} />)
        ) : (
          <p className="col-span-full text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

const BlogPost = ({ blog }) => {
  return (
    <Section>
      <div className="h-full bg-white shadow-lg p-5 flex flex-col rounded-lg border-2 border-gray-100">
        {blog.mediaUrl && (
          <HeroImage
            src={blog.mediaUrl}
            altText={blog.mediaAltText}
            className="mb-4 rounded-t-md"
          />
        )}
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
          <p className="text-gray-500 text-sm mb-2">
            <strong>Author:</strong> {blog.authorName}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}
          </p>
        </div>
        <ProseWrapper>
          <p className="text-gray-700">{blog.shortText}</p>
        </ProseWrapper>

        <Link to={`/blog/${blog.id}`} state={{ blog }}>
          <span className="cursor-pointer font-semibold text-orange-400 hover:text-orange-700 text-center block m-2 p-2 border-2 border-orange-400 rounded-lg shadow-md">
            Read More
          </span>
        </Link>
      </div>
    </Section>
  );
};

export default Blog;
