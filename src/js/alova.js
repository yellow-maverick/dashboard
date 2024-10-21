import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { VueOptionsHook } from '@alova/vue-options';
import store from '../store/index'

export const alova = createAlova({
  baseURL:        import.meta.env.VITE_API_URL,
  statesHook:     VueOptionsHook,
  requestAdapter: adapterFetch(),

  beforeRequest(method) {
    // Suppose we need to add token to the request header
    if (['post', 'put'].includes(method.type)) method.config.headers['Content-Type'] = 'application/json';
    if (store.getters['token/token']() && method.config.params) method.config.params['token'] = store.getters['token/token']();
    if (store.getters['token/jwtToken']()) method.config.headers.Authorization = store.getters['token/jwtToken']();
    let profile = store.getters['profile/profile']()
    if (profile.subscriptions) method.config.params['subscription_id'] = profile.subscriptions[0]?.id
  },

  // Response interceptors
  responded: {
    // Handle successful responses
    onSuccess(response, method) {
      // Intercept /login response to get the token
      if (method.url.endsWith('/login')) {
        const token = response.headers.get('Authorization');
        // Save the token in Vuex store
        if (token) {
          store.dispatch('token/login', token);
          location.reload()
        }
      }

      // Intercept /logout requests
      if (method.url.endsWith('/logout')) {
        // Clear the token from Vuex store
        store.dispatch('token/logout');
      }
      return response;
    },

    // Handle errors
    onError(error, method) {
      console.log(error, method);
      // Check for 401 Unauthorized error
      if (error.status === 401) {
        // Clear the token and update state
        store.dispatch('token/logout');
      }
      return Promise.reject(error);
    }
  }
});
