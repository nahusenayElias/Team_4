import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

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

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 p-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between relative">

          <div className="flex items-center z-50">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto mr-4"
                width="113.4"
                height="38.5"
              />
            </Link>
            <h1 className="text-xl font-semibold text-orange-600 hover:text-white">
              Team 4
            </h1>
          </div>

          {/* Hamburger menu button */}
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="group flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none z-50"
            aria-label="Toggle navigation menu"
          >
            <span
              className={`block w-6 h-0.5 bg-orange-600 group-hover:bg-white absolute transition-all duration-300 ease-out ${
                menuOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-orange-600 group-hover:bg-white absolute transition-all duration-300 ease-out ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-orange-600 group-hover:bg-white absolute transition-all duration-300 ease-out ${
                menuOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Fullscreen overlay menu */}
      <div
        ref={menuRef}
        className={`fixed inset-0 bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center text-center space-y-8 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none -z-10"
        }`}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="text-white text-2xl font-bold hover:text-orange-500 transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </header>
  );
};

export default Header;
