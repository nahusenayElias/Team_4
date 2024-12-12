import mautic from "./services/mautic";
import { Routes, Route, useLocation } from "react-router-dom";
import About from "./pages/About";
import Layout from "./pages/Layout";
import Contact from "./pages/Contact";
import Jobs from "./pages/Jobs";
import Blog from "./pages/Blog";
import FrontPage from "./pages/FrontPage";
import { useEffect } from "react";
import OurServices from "./pages/OurServices";
import ServiceDetail from "./pages/ServiceDetail";
import ProjectCasePage from "./pages/ProjectCasePage";
import { capitalizeFirstLetter } from "./services/utils";
import { useDispatch } from "react-redux";
import { fetchSegments } from "./store/visitorSegmentsSlice";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Fetch user segments on first page load
  useEffect(() => {
    dispatch(fetchSegments());
  }, [dispatch]);

  useEffect(() => {
    // Define static page titles
    const pageTitles = {
      "/": "Homepage | Druid Team 4",
      "/services": "Our Services | Druid Team 4",
      "/contact": "Contact | Druid Team 4",
      "/about": "About Us | Druid Team 4",
      "/blog": "Blog | Druid Team 4",
      "/jobs": "Jobs | Druid Team 4",
    };

    // Handle dynamic routes
    let title;
    if (location.pathname.startsWith("/projects/")) {
      const companyName = location.pathname.split("/projects/")[1];
      title = `Project - ${capitalizeFirstLetter(
        decodeURIComponent(companyName)
      )} | Druid Team 4`;
    } else if (location.pathname.startsWith("/service/")) {
      const serviceType = location.pathname.split("/service/")[1];
      title = `Our Services - ${capitalizeFirstLetter(
        decodeURIComponent(serviceType)
      )}  | Druid Team 4`;
    } else {
      // Use predefined title for fallback
      title = pageTitles[location.pathname] || "Druid - Team 4";
    }

    // Update document title
    document.title = title;

    // Track the page view
    mautic.pageView({
      path: location.pathname,
      title: document.title,
    });
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FrontPage />} />
        <Route path="/services" element={<OurServices />} />
        <Route path="/services/:serviceType" element={<ServiceDetail />} />
        <Route path="/projects/:companyName" element={<ProjectCasePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/projects/:companyName" element={<ProjectCasePage />} />
      </Route>
    </Routes>
  );
};

export default App;
