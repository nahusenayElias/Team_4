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

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Change page title according to path
    const pageTitles = {
      "/": "Homepage | Druid - Team 4",
      "/services": "Our Services | Druid Team 4",
      "/contact": "Contact | Druid Team 4",
      "/about": "About Us | Druid Team 4",
      "/blog": "Blog | Druid Team 4",
      "/jobs": "Jobs | Druid Team 4",
    };
    const title = pageTitles[location.pathname] || "Druid - Team 4";
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
