import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
          <p>
            &copy; {new Date().getFullYear()} Overthinkistan. Tüm hakları
            saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
