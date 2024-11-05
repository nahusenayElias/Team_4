import { NavLink, Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white font-sans">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Druid Logo" className="h-10 mr-5" />{" "}
          {/* Adjust height as needed */}
        </Link>
        <h1 className="text-xl self-end">Team 4</h1>
      </div>

      <nav>
        <ul className="flex space-x-4">
          <li>
            <NavLink to="/" className="hover:text-gray-300">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="hover:text-gray-300">
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className="hover:text-gray-300">
              Our Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="hover:text-gray-300">
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className="hover:text-gray-300">
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className="hover:text-gray-300">
              Blog
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
