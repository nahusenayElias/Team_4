import { useEffect, useState } from "react";
import { drupalLocalhostAddress } from "../services/api";
import Section from "../components/Section";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${drupalLocalhostAddress}/jsonapi/node/blog?include=uid`,
          {
            headers: {
              Accept: "application/vnd.api+json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching blogs: ${response.statusText}`);
        }
        const data = await response.json();

        const blogsWithDetails = await Promise.all(
          data.data.map(async (blog) => {
            // Get image ID
            const imageId = blog.relationships.field_blog_image?.data?.[0]?.id;
            let imageUrl = null;
            if (imageId) {
              // Fetch image URL
              const imageResponse = await fetch(
                `${drupalLocalhostAddress}/jsonapi/file/file/${imageId}`,
                {
                  headers: {
                    Accept: "application/vnd.api+json",
                  },
                }
              );
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                imageUrl = imageData.data.attributes.uri.url;
              }
            }

            const authorId = blog.relationships.uid.data.id;
            const authorData = data.included.find((inc) => inc.id === authorId);
            const authorName = authorData?.attributes?.name || "Unknown author";

            const publishedDate = new Date(
              blog.attributes.created
            ).toLocaleDateString();

            return { ...blog, imageUrl, authorName, publishedDate };
          })
        );

        setBlogs(blogsWithDetails);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Section>
      <h1 className="text-4xl font-bold text-center text-dark-600 mb-8">
        Blog Posts
      </h1>
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

      <div className="space-y-8">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg"
            >
              {blog.imageUrl && (
                <img
                  src={`${drupalLocalhostAddress}${blog.imageUrl}`}
                  alt={blog.attributes.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              )}
              <div className="mb-4 text-gray-500 text-sm">
                <span>By {blog.authorName}</span> |{" "}
                <span>{blog.publishedDate}</span>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                {blog.attributes.title}
              </h2>
              <div
                className="prose prose-lg text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: blog.attributes.field_body?.processed,
                }}
              ></div>
              <button className="text-gray-200">Read More</button>
            </article>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading blogs...</p>
        )}
      </div>
    </Section>
  );
};

export default Blog;
