import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const LogoutRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = localStorage.getItem('logoutRedirectPath');
    if (redirectPath) {
      localStorage.removeItem('logoutRedirectPath'); // Clear the stored path immediately
      navigate(redirectPath, { replace: true }); // Navigate to the stored path, replace history entry
    }
  }, [navigate]);

  return <Outlet />; // Renders child routes
};

export default LogoutRedirectHandler;