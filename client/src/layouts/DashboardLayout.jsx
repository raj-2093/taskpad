import React from 'react'
import { useApi } from '../context/ApiProvider'
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import Loader from '../components/Loader';

export default function DashboardLayout({children, activeMenu, isLoading}) {
    const { user } = useApi();

  return (
    <div className=''>
      <Navbar activeMenu={activeMenu}></Navbar>

      { user && (
        <div className='flex'>
            <div className="max-lg:hidden">
                <SideMenu activeMenu={activeMenu} />
            </div>

            <div className="grow mx-5">
              {isLoading && <Loader />}
              {!isLoading && (children)}
            </div>
        </div>
      ) }
    </div>
  )
}
