import React, { useState, useEffect } from "react";
import { drupalLocalhostAddress } from "../services/api";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main blog data with included media
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/paragraph/blog_paragraph?include=field_blog_media,field_blog_media.field_media_image`
        );
        const data = await response.json();

        // Extract and format blog data
        const includedMedia = data.included?.filter(item => item.type === "media--image") || [];
        const includedFiles = data.included?.filter(item => item.type === "file--file") || [];

        const blogData = data.data.map((item) => {
          let mediaUrl = null;
          const mediaId = item.relationships.field_blog_media?.data?.id;

          if (mediaId) {
            const media = includedMedia.find(mediaItem => mediaItem.id === mediaId);
            if (media) {
              const fileId = media.relationships.field_media_image?.data?.id;
              if (fileId) {
                const file = includedFiles.find(fileItem => fileItem.id === fileId);
                if (file && file.attributes?.uri?.url) {
                  // Construct the full URL
                  mediaUrl = `${drupalLocalhostAddress}${file.attributes.uri.url}`;
                }
              }
            }
          }

          return {
            id: item.id,
            title: item.attributes.field_title_parag?.processed,
            shortText: item.attributes.field_blog_short_text,
            body: item.attributes.field_blog_body?.value,
            mediaUrl: mediaUrl,
            author: "admin", // Replace with actual author data if needed
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
      <h1>Blog Posts</h1>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <h2>{blog.title}</h2>
            <p>
              <strong>Author:</strong> {blog.author}
            </p>
            <p>
              <strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}
            </p>
            <p>{blog.shortText}</p>
            <div dangerouslySetInnerHTML={{ __html: blog.body }} />
            {blog.mediaUrl && (
              <img
                src={blog.mediaUrl}
                alt={blog.title}
                className="blog-image"
              />
            )}
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Blog;