import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Layout from "./pages/Layout";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Jobs from "./pages/Jobs";
import Blog from "./pages/Blog";
import FrontPage from "./pages/FrontPage";

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
