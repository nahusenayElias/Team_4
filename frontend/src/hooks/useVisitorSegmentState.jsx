import { useSelector } from "react-redux";

const useVisitorSegmentState = () => {
  const data = useSelector((state) => state.visitorSegments.data);
  const isLoading = useSelector((state) => state.visitorSegments.isLoading);
  const error = useSelector((state) => state.visitorSegments.error);

  return { data, isLoading, error };
};

export default useVisitorSegmentState;
