import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../pages/admin/Dashboard'
import ManageTasks from '../pages/admin/ManageTasks'
import CreateTask from '../pages/admin/CreateTask'
import ManageUsers from '../pages/admin/ManageUsers'
import UserDashboard from '../pages/user/UserDashboard'
import MyTasks from '../pages/user/MyTasks'
import ViewTaskDetails from '../pages/user/ViewTaskDetails'

export default function WebRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>

      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
      <Route path='/admin/dashboard' element={<Dashboard/>}></Route>
      <Route path='/admin/tasks' element={<ManageTasks/>}></Route>
      <Route path='/admin/create-task' element={<CreateTask/>}></Route>
      <Route path='/admin/users' element={<ManageUsers/>}></Route>
      </Route>

      {/* User Routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
      <Route path='/user/dashboard' element={<UserDashboard/>}></Route>
      <Route path='/user/tasks' element={<MyTasks/>}></Route>
      <Route path='/user/task-details/:id' element={<ViewTaskDetails />}></Route>
      </Route>
    </Routes>
  )
}
