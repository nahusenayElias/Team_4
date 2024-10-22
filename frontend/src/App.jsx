import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About";
import Layout from "./Layout";
import Contact from "./components/Contact";
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
          <Route path="/contact" element={<Blog />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
