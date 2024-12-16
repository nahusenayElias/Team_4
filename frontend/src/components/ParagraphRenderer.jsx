import TextParagraph from "./TextParagraph";
import ImageParagraph from "./ImageParagraph";
import TextWithImageParagraph from "./TextWithImageParagraph";
import axios from "axios";
import { useState, useEffect } from "react";
import useVisitorSegmentState from "../hooks/useVisitorSegmentState";

// Function to fetch segment details using the provided link
const fetchSegmentDetails = async (segmentLink) => {
  try {
    console.log("Attempting to fetch segment details from:", segmentLink);
    const response = await axios.get(segmentLink);
    console.log("Full Segment Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Detailed Error Fetching Segment Details:", {
      message: error.message,
      url: segmentLink,
      fullError: error,
    });
    return { data: [] };
  }
};

// Function to check if the visitor qualifies for any segment
const isVisitorInSegment = (visitorSegments, paragraphSegments) => {
  const visitorSet = new Set(visitorSegments);
  return paragraphSegments.some((segment) => visitorSet.has(segment));
};

const ParagraphRenderer = ({ paragraph, included }) => {
  const { data: visitorSegments, isLoading: visitorSegmentsLoading } =
    useVisitorSegmentState();

  const [paragraphSegments, setParagraphSegments] = useState([]);
  const [paragraphSegmentsLoading, setParagraphSegmentsLoading] =
    useState(true);

  console.log("Paragraph Rendering Debug:", {
    paragraphType: paragraph.type,
    visitorSegments,
    isLoading: visitorSegmentsLoading,
  });

  console.log("Visitor Segments State:", {
    segments: visitorSegments,
    isLoading: visitorSegmentsLoading,
  });

  // Lookup table to select which component should be rendered by ParagraphRenderer
  const paragraphComponents = {
    "paragraph--text": TextParagraph,
    "paragraph--image": ImageParagraph,
    "paragraph--text_with_image": TextWithImageParagraph,
  };

  // Get the segment link from the paragraph
  const segmentLink =
    paragraph?.relationships?.field_mautic_segments?.links?.related?.href;

  useEffect(() => {
    const fetchData = async () => {
      if (segmentLink) {
        try {
          const data = await fetchSegmentDetails(segmentLink);
          const segmentNames = data.data.map(
            (segment) => segment.attributes.field_segment_name
          );
          setParagraphSegments(segmentNames);
        } catch (error) {
          console.error("Failed to fetch segment data:", error);
          setParagraphSegments([]);
        } finally {
          setParagraphSegmentsLoading(false); // Finish loading state for paragraph segments
        }
      }
    };

    fetchData();
  }, [segmentLink]);

  console.log("Visitor Segments:", visitorSegments);
  console.log("Paragraph Segments:", paragraphSegments);

  // Check if both visitor and paragraph segments are loaded
  if (visitorSegmentsLoading || paragraphSegmentsLoading) {
    return <div>Loading...</div>;
  }

  // Use the lookup table on line 38 to determine which component to render
  const Component = paragraphComponents[paragraph.type];
  if (!Component) return null;

  // Rendering logic: Show paragraph only if visitor belongs to the segment
  const shouldRenderParagraph =
    paragraphSegments.length === 0 || // No segments, render for all
    isVisitorInSegment(visitorSegments, paragraphSegments);

  if (!shouldRenderParagraph) {
    console.log(`Paragraph hidden, visitor not in a qualifying segment.`);
    return null;
  }

  return (
    <div className="mt-8 paragraph text-center mx-auto">
      <Component paragraph={paragraph} included={included} />
    </div>
  );
};

export default ParagraphRenderer;
