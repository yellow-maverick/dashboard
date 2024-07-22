import Dashboard from '../views/Dashboard.vue'
import Analytics from '../views/Analytics.vue'
import Connections from '../views/Connections.vue'
import AddProduct from '../views/AddProduct.vue'
import Reviews from '../views/Reviews.vue'
import Billing from '../views/Billing.vue'
import VirtualReality from '../views/VirtualReality.vue'
import QueryPage from '../views/QueryPage.vue'
import Profile from '../views/Profile.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: Analytics,
  },

  {
    path: "/reviews",
    name: "Reviews",
    component: Reviews,
  },

  // Management
  {
    path: '/connections',
    name: 'Connections',
    component: Connections,
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct,
  },

  // Internal
  {
    path: "/queries",
    name: "Queries",
    component: QueryPage,
  },

  // User
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  
];
export default routes
