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
            <Link to="/">
              <img src={logo} alt="Druid Logo" className="h-8" />
            </Link>
            <div className="space-y-1 text-sm">
              <p>Pasilankatu 2</p>
              <p>00240, Helsinki</p>
              <p>Finland</p>
              <p>Tel: +358 20 187 6602</p>
              <p>Email: info@druid.fi</p>
            </div>
            <div className="flex space-x-4 pt-2">
              {['https://x.com/druidfi', 'https://www.instagram.com/druidfi/', 'https://www.facebook.com/druidfi/', 'https://www.linkedin.com/company/druid-oy/'].map((link, index) => (
                <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  {[FaXTwitter, FaInstagram, FaFacebook, FaLinkedin][index]({ size: 20 })}
                </a>
              ))}
            </div>
          </div>

          {/* Products, Company, Support */}
          {['Products', 'Company', 'Support'].map((title, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-orange-500">{title}</h3>
              <ul className="space-y-2">
                {['Item 1', 'Item 2', 'Item 3'].map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href="#" className="hover:text-orange-500 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
              {title === 'Support' && (
                <button onClick={scrollToTop} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                  Go to Top <FaArrowUp className="inline ml-1" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Druid Team Project - Team IV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;