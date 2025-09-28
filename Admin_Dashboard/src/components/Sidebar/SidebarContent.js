
import React from "react";
import routes, { menuByRole } from "../../routes/sidebar";
import { NavLink, Route } from "react-router-dom";
import * as Icons from "../../icons";
import SidebarSubmenu from "./SidebarSubmenu";
import { Button } from "@windmill/react-ui";

function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

function SidebarContent() {
  // Lấy role từ localStorage (hoặc context nếu có)
  const role = localStorage.getItem("role") || "admin";
  const allowedMenus = menuByRole[role] || menuByRole["admin"];
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <button
        type="button"
        className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200 bg-transparent border-none cursor-pointer focus:outline-none"
        style={{ background: "none" }}
        tabIndex={0}
        aria-label="E-Commerce"
      >
        E-Commerce
      </button>
      <ul className="mt-6">
        {routes.filter(r => allowedMenus.includes(r.name)).map((route, idx, arr) => {
          if (route.name === "Logout") {
            return (
              <li className="relative px-6 py-3" key={route.name}>
                <button
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 bg-transparent border-none cursor-pointer"
                  onClick={handleLogout}
                  tabIndex={0}
                  aria-label="Logout"
                >
                  <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                  <span className="ml-4">{route.name}</span>
                </button>
              </li>
            );
          }
          // Add divider after Chats and before Profile
          if (route.name === "Chats") {
            return [
              <li className="relative px-6 py-3" key={route.name}>
                <NavLink
                  exact
                  to={route.path}
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  activeClassName="text-gray-800 dark:text-gray-100"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  </Route>
                  <Icon
                    className="w-5 h-5"
                    aria-hidden="true"
                    icon={route.icon}
                  />
                  <span className="ml-4">{route.name}</span>
                </NavLink>
              </li>,
              <hr key="divider-profile" className="mx-6 my-2 border-t border-gray-200 dark:border-gray-700" />
            ];
          }
          return route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon}
                />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div className="px-6 my-6">
        <Button>
          Genarate Report
          <span className="ml-2" aria-hidden="true">
            +
          </span>
        </Button>
      </div>
    </div>
  );
}

export default SidebarContent;
