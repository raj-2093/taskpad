import React from 'react'
import { useApi } from '../../context/ApiProvider'
import DashboardLayout from '../../layouts/DashboardLayout';

export default function UserDashboard() {
  const { user } = useApi();
  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      Dashboard
    </DashboardLayout>
  )
}
