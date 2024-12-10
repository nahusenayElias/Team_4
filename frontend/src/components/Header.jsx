import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleScroll = () => setMenuOpen(false);

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Jobs", path: "/jobs" },
    { name: "Blog", path: "/blog" },
  ];

  const linkClasses =
    "text-lg font-semibold hover:text-orange-500 active:underline-offset-4 py-4 md:py-0";
  const desktopClasses =
    "w-full md:w-auto text-center md:text-left md:text-base md:font-normal";

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white font-sans md:border-b md:border-gray-300">
      <div className="flex items-center">
        <Link to="/">
          <img
            src={logo}
            alt="Druid Logo"
            className="h-10 w-auto mr-5"
            width="113.4"
            height="38.5"
          />
        </Link>
        <h1 className="pt-2 text-xl">Team 4</h1>
      </div>

      {/* Hamburger Icon */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="md:hidden flex flex-col space-y-1.5 p-2"
        aria-label="Toggle navigation menu"
      >
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      {/* Navigation Menu */}
      <nav
        ref={menuRef}
        className={`${
          menuOpen ? "flex" : "hidden"
        } flex-col md:flex md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 absolute md:relative top-16 md:top-auto left-0 w-full md:w-auto bg-gray-800 md:bg-transparent z-10 p-4 md:p-0 border-t border-gray-300 md:border-none`}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={`${desktopClasses} ${linkClasses}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Header;
