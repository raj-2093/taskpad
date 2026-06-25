import React, { useEffect } from 'react'
import { useApi } from '../../context/ApiProvider'
import { useNavigate } from 'react-router-dom';

export default function Home() {
    // Temporary
    const { user } = useApi();
    const navigate = useNavigate();
    useEffect(() => {
        if(user) {
            navigate("/user/dashboard");
        }
    }, [])

  return (
    <div>
      
    </div>
  )
}
