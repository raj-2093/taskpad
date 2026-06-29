import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { Link } from "react-router-dom";
import { useApi } from "../context/ApiProvider";
import { BASE_URL } from "../utils/apiPaths";
import logo from "../assets/taskpad-enlarged-00.png";

export default function Navbar({ activeMenu }) {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user } = useApi();

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black cursor-pointer"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">
        <Link
          to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
          className="cursor-pointer"
        >
          {/* <img src={logo} alt="" className="w-16 h-16 rounded-full" /> */}
          Taskpad
        </Link>
      </h2>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
}
