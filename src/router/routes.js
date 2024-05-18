import Dashboard from "../views/Dashboard.vue";
import BrandAnalysis from "../views/BrandAnalysis.vue";
import ProductAnalysis from "../views/ProductAnalysis.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import QueryPage from "../views/QueryPage.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";

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
    path: "/brand_analysis",
    name: "Brand Analysis",
    component: BrandAnalysis,
  },
  {
    path: "/product_analysis",
    name: "Product Analysis",
    component: ProductAnalysis,
  },
  {
    path: "/queries",
    name: "Queries",
    component: QueryPage,
  },
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
