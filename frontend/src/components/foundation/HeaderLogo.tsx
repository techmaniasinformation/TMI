import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/icons/tmiLogo.svg';

const HeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="TMI Logo" className="w-20 h-20" />
        <span className="text-xl font-bold">TMI</span>
      </Link>
    </div>
  );
};

export default HeaderLogo;


