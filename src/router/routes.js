import Dashboard   from '../views/Dashboard.vue'
import Analytics   from '../views/Analytics.vue'
import Connections from '../views/Connections.vue'
import AddProduct  from '../views/AddProduct.vue'
import Reviews     from '../views/Reviews.vue'
import QueryPage   from '../views/QueryPage.vue'
import Profile     from '../views/Profile.vue'
import Signup      from '../views/Signup.vue'
import Signin      from '../views/Signin.vue'
import PriceInfo   from "../views/PriceInfo.vue"

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
    path: '/connections',
    name: 'settings.connections',
    component: Connections,
  },
  {
    path: '/add-product',
    name: 'Add Product',
    component: AddProduct,
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
    path: "/signin",
    name: "signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  
];
export default routes
