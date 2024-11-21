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
import { fetchContactSegments } from "./services/fetchContactSegments";

const App = () => {
  const location = useLocation();

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
      // Use predefined title or fallback
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

  // Fetch visitor's segments
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const data = await fetchContactSegments();
        console.log("Contact Segments:", data);
      } catch (err) {
        console.error("Error:", err.message);
      }
    };

    fetchSegments(); // Run the function when the component mounts
  }, []); // Empty dependency array, runs once when component mounts

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FrontPage />} />
        <Route path="/services" element={<OurServices />} />
        <Route path="/projects/:companyName" element={<ProjectCasePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/service/:serviceType" element={<ServiceDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
