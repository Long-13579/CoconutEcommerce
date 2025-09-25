/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/orders",
    icon: "CartIcon",
    name: "Orders",
  },
  {
    icon: "TruckIcon",
    name: "Products",
    routes: [
      {
        path: "/all-products",
        name: "All Products",
      },
      {
        path: "/add-product",
        name: "Add Product",
      },
    ],
  },
  {
    path: "/customers",
    icon: "GroupIcon",
    name: "Customers",
  },
  {
    path: "/chats",
    icon: "ChatIcon",
    name: "Chats",
  },
  {
    path: "/manage-profile",
    icon: "UserIcon",
    name: "Profile",
  },
  {
    path: "/staff-management",
    icon: "GroupIcon",
    name: "Staff Management",
  },
  {
    path: "/settings",
    icon: "OutlineCogIcon",
    name: "Settings",
  },
  {
    path: "/logout",
    icon: "OutlineLogoutIcon",
    name: "Logout",
  },
];

export default routes;
