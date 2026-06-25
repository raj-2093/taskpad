import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useApi } from '../context/ApiProvider';

export default function PrivateRoute({
  allowedRoles
}) {
  const navigate = useNavigate();
  const { user } = useApi();

  
  useEffect(() => {
    if(!user) {
      navigate("/login");
      return;
    }
  
    if(allowedRoles?.includes("admin") && user.role !== "admin") {
      navigate("/user/dashboard");
    }
  }, []);


  return (
    <Outlet />
  )
}
