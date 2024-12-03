import React from 'react';
import { FaXTwitter, FaInstagram, FaFacebook, FaLinkedin, FaArrowUp } from "react-icons/fa6";
import logo from '../assets/images/logo.svg'
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white font-sans relative">

      <div className="bg-orange-600 h-2 absolute top-0 left-0 right-0"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1 space-y-4">
            {/* <img src="asset/images/logo.png" alt="Company Logo" className="h-12 mb-4" /> */}
            <Link to="/">
          <img src={logo} alt="Druid Logo" className="h-8" />
        </Link>
            {/* <h2 className="text-xl font-bold mb-2">Company Name</h2> */}
            <div className='space-y-1 text-sm'>

            <p className="mb-1">Pasilankatu 2</p>
            <p className="mb-1">00240, Helsinki</p>
            <p className="mb-2">Finland</p>
            <p className="mb-1">+358 20 187 6602</p>
            <p className="mb-1">info@druid.fi</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://x.com/druidfi" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                <FaXTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/druidfi/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.facebook.com/druidfi/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.linkedin.com/company/druid-oy/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Products</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">Services</a></li>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">Featured cases</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Company</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Support</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">Report a bug</a></li>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">Chat with support</a></li>
              <li className="mb-2"><a href="#" className="hover:text-orange-500 transition-colors">FAQs</a></li>
            </ul>
            <button onClick={scrollToTop} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
              Go to Top <FaArrowUp className="inline ml-1" />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-orange-500 text-center">
          <p> All rights reserved &copy; {new Date().getFullYear()} | Druid Team Project - Team IV</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;