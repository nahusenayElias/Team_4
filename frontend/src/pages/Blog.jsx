import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { drupalLocalhostAddress, fetchContent } from '../services/api';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all blog paragraph data
        const data = await fetchContent('node/blog_paragraph?include=uid');
        const articlesData = data.data;

        const articlesWithDetails = await Promise.all(
          articlesData.map(async (article) => {
            const { id, attributes, relationships } = article;
            const { title, created, field_blog_body, field_blog_short_text } = attributes;

            let imageUrl = null;
            let authorName = 'Unknown Author';
            const mediaId = relationships?.field_blog_media?.data?.id;
            const authorId = relationships?.uid?.data?.id;

            // Fetch media image if available
            if (mediaId) {
              try {
                const mediaResponse = await axios.get(`${drupalLocalhostAddress}/jsonapi/media/image/${mediaId}`);
                const imageFileId = mediaResponse.data.data.relationships?.field_media_image?.data?.id;
                if (imageFileId) {
                  const fileResponse = await axios.get(`${drupalLocalhostAddress}/jsonapi/file/file/${imageFileId}`);
                  const fileUrl = fileResponse.data.data.attributes.uri.url;
                  imageUrl = fileUrl.startsWith('http') ? fileUrl : `${drupalLocalhostAddress}${fileUrl}`;
                }
              } catch (imageError) {
                console.error(`Error fetching media image for article ${id}:`, imageError);
              }
            }

            // Fetch author name if available
            if (authorId) {
              try {
                const authorResponse = await axios.get(`${drupalLocalhostAddress}/jsonapi/user/user/${authorId}`);
                authorName = authorResponse.data.data.attributes.name;
              } catch (authorError) {
                console.error(`Error fetching author for article ${id}:`, authorError);
              }
            }

            return {
              id,
              title,
              created: new Date(created).toLocaleDateString(),
              author: authorName,
              body: field_blog_body?.value || '',
              shortText: field_blog_short_text || '',
              imageUrl,
            };
          })
        );

        setArticles(articlesWithDetails);
      } catch (error) {
        console.error('Error fetching blog paragraph content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {articles.length === 0 ? (
        <p>No articles available.</p>
      ) : (
        articles.map((article) => (
          <div key={article.id}>
            <h2>{article.title}</h2>
            <p><strong>Author:</strong> {article.author}</p>
            <p><strong>Published on:</strong> {article.created}</p>
            {article.imageUrl && <img src={article.imageUrl} alt={`Article ${article.id}`} />}
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
            <p>{article.shortText}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Blog;
