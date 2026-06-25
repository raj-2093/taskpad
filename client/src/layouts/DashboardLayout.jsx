import React from 'react'
import { useApi } from '../context/ApiProvider'
import Navbar from './Navbar';
import SideMenu from './SideMenu';

export default function DashboardLayout({children, activeMenu}) {
    const { user } = useApi();

  return (
    <div className=''>
      <Navbar activeMenu={activeMenu}></Navbar>

      { user && (
        <div className='flex'>
            <div className="max-[1080px]:hidden">
                <SideMenu activeMenu={activeMenu} />
            </div>

            <div className="grow mx-5">{children}</div>
        </div>
      ) }
    </div>
  )
}
