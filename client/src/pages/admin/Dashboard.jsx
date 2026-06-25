import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../context/ApiProvider'
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';

export default function Dashboard() {
  const { user } = useApi();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const fetchDashboardData = async () => {
    
  };

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      Dashboard
    </DashboardLayout>
  )
}
