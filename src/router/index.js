import { createRouter, createWebHistory } from "vue-router";
import store from '../store/index.js'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
  linkActiveClass: "active",
});

const hasQuery = (route) => {
  return !!Object.keys(route.query).length
}

// Before each route evaluates...
router.beforeEach((to, from, next) => {
  store.commit('token/save', { token: to.query.token, override_user: to.query.override_user })
  if (to.query.lang) store.commit('locale/saveLocale', to.query.lang)
  if(!hasQuery(to) && hasQuery(from)) {
    next({name: to.name, query: from.query});
  } else {
    next()
  }
})

export default router;
