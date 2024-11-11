import {
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-6 bg-gray-800 text-white font-sans">
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold">
          &copy; {new Date().getFullYear()} Druid Team Project - Team IV
        </p>
      </div>

      <div className="flex flex-row items-center justify-center space-x-6">
        <a
          href="https://x.com/druidfi"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
          aria-label="Follow Druid on X"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href="https://www.instagram.com/druidfi/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
          aria-label="Follow Druid on Instagram"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://www.facebook.com/druidfi/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
          aria-label="Like Druid on Facebook"
        >
          <FaFacebook size={20} />
        </a>
        <a
          href="https://www.linkedin.com/company/druid-oy/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
          aria-label="Connect with Druid on LinkedIn"
        >
          <FaLinkedin size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
