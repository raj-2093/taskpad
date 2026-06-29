import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiProvider";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../utils/data";

export default function SideMenu({ activeMenu }) {
  const { user, setUser, accessToken, setAccessToken, api } = useApi();
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  const handleLogout = () => {
    console.log(`handleLogout > accessToken: ${accessToken}`);
    api.post(API_PATHS.AUTH.LOGOUT).then((response) => {
        setAccessToken(null);
        setUser(null);
        navigate("/login");
      }).catch((error) => {
        console.log(`Error at handleLogout: ${error}`);
      });
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImageUrl || null}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData?.map((item, index) => (
        <button
          key={`menu-${index}`}
          className={`w-full flex items-center gap-4 text-[15px] hover:text-primary hover:bg-linear-to-r hover:from-blue-50/40 hover:to-blue-100/50 ${
            activeMenu == item.label
              ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
              : ""
          } py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
}
