import Dashboard      from '../views/Dashboard.vue'
import Analytics      from '../views/Analytics.vue'
import Brands         from '../views/Brands.vue'
import Products       from '../views/Products.vue'
import AddProduct     from '../views/AddProduct.vue'
import Reviews        from '../views/Reviews.vue'
import QueryPage      from '../views/QueryPage.vue'
import Profile        from '../views/Profile.vue'
import ResetPassword  from '../views/ResetPassword.vue'
import PriceInfo      from "../views/PriceInfo.vue"
import UserManagement from "../views/UserManagement.vue"

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/analytics",
    name: "analytics",
    component: Analytics,
  },

  {
    path: "/reviews",
    name: "reviews",
    component: Reviews,
  },

  {
    path: "/price_info",
    name: "price_info",
    component: PriceInfo,
  },
  // Management
  {
    path: '/brands',
    name: 'settings.brands',
    component: Brands,
  },
  {
    path: '/products',
    name: 'settings.products',
    component: Products,
  },
  {
    path: '/products/add',
    name: 'products.add',
    component: AddProduct,
  },
  {
    path: '/users',
    name: 'settings.users',
    component: UserManagement,
  },

  // Internal
  {
    path: "/queries",
    name: "queries",
    component: QueryPage,
  },

  // User
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    meta: {
      layout: 'signin'
    }
  },
  
];
export default routes
