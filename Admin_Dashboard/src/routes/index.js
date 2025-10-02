import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const ProductsAll = lazy(() => import("../pages/ProductsAll"));
const SingleProduct = lazy(() => import("../pages/SingleProduct"));
const AddProduct = lazy(() => import("../pages/AddProduct"));
const UpdateProduct = lazy(() => import("../pages/UpdateProduct")); 
const Customers = lazy(() => import("../pages/Customers"));
const Chats = lazy(() => import("../pages/Chats"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const OrderDetail = lazy(() => import("../pages/OrderDetail"))
const Discounts = lazy(() => import("../pages/Discounts"));
const DiscountDetail = lazy(() => import("../pages/DiscountDetail"));
const AddDiscount = lazy(() => import("../pages/AddDiscount"))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/app/inventory-check",
    component: lazy(() => import("../pages/ProductsInventory")),
  },
  {
    path: "/discounts/create",
    component: AddDiscount
  },
  {
    path: "/discounts/:id",
    component: DiscountDetail,
  },
  {
    path: "/discounts",
    component: Discounts,
  },
  {
    path: "/dashboard", // the url
    component: Dashboard,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/orders/:order_id",
    component: OrderDetail,
  },
  {
    path: "/all-products",
    component: ProductsAll,
  },
  {
    path: "/add-product",
    component: AddProduct,
  },
  {
    path: "/products/:slug/update",
    component: UpdateProduct,
  },
  {
    path: "/products/:slug",
    component: SingleProduct,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/chats",
    component: Chats,
  },
  {
    path: "/delivery",
    component: lazy(() => import("../pages/Delivery")),
  },
  {
    path: "/manage-profile",
    component: Profile,
  },
  {
    path: "/staff-management",
    component: lazy(() => import("../pages/StaffManagement")),
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
