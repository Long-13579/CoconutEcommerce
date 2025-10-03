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
  staff_delivery: ["Dashboard", "Delivery", "Profile", "Settings", "Logout"],
  staff_sale: ["Dashboard", "Orders", "Customers", "Chats", "Profile", "Settings", "Logout"],
};

// Lọc routes theo role đã lưu trong storage bằng cách dùng menuByRole và baseRoutes  
// baseRoutes là các routes mặc định
// menuByRole là các routes mà mỗi role có thể truy cập
// getAllowedRoutes là hàm để lọc routes theo role đã lưu trong storage
// localStorage là lưu trữ dữ liệu trong trình duyệt cho đến khi người dùng xóa
// sessionStorage là lưu trữ dữ liệu trong trình duyệt cho đến khi người dùng đóng trình duyệt
function getAllowedRoutes() {
  const role =
    (typeof localStorage !== 'undefined' && (localStorage.getItem('role') || localStorage.getItem('user_role'))) ||
    (typeof sessionStorage !== 'undefined' && (sessionStorage.getItem('role') || sessionStorage.getItem('user_role'))) ||
    '';
  const allow = (menuByRole[role] || menuByRole['staff_support'] || []).reduce((set, name) => (set.add(name), set), new Set());

  const filterTree = (items) => items
    .filter(item => allow.has(item.name))
    .map(item => item.routes ? { ...item, routes: filterTree(item.routes) } : item);

  return filterTree(baseRoutes);
}

const baseRoutes = [
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

const routes = getAllowedRoutes();

export default routes;
