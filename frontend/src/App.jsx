import { Routes, Route, useLocation } from "react-router-dom";
import About from "./pages/About";
import Layout from "./pages/Layout";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Jobs from "./pages/Jobs";
import Blog from "./pages/Blog";
import FrontPage from "./pages/FrontPage";
import mautic from "./services/mautic";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();

  // Track page views whenever the route changes
  useEffect(() => {
    // Track page views when the location changes
    mautic.pageView({ path: location.pathname });
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FrontPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/blog" element={<Blog />} />
      </Route>
    </Routes>
  );
};

export default App;
