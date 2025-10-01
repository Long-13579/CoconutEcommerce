/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
export const menuByRole = {
  admin: [
    "Dashboard", "Orders", "Products", "Customers", "Chats", "Delivery", "Profile", "Staff Management", "Settings", "Logout"
  ],
  staff_inventory: ["Dashboard", "Products", "Profile", "Settings", "Logout"],
  staff_support: ["Dashboard", "Orders", "Customers", "Chats", "Profile", "Settings", "Logout"],
  staff_delivery: ["Dashboard", "Orders", "Delivery", "Profile", "Settings", "Logout"],
  staff_sale: ["Dashboard", "Orders", "Customers", "Chats", "Delivery", "Profile", "Settings", "Logout"],
};

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
      {
        path: "/app/inventory-check",
        name: "Inventory Check",
      },
    ],
  },
  {
    path: "/customers",
    icon: "GroupIcon",
    name: "Customers",
  },
  {
    path: "/delivery",
    icon: "TruckIcon",
    name: "Delivery",
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
