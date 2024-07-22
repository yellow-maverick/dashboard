import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';
import { VueOptionsHook } from '@alova/vue-options';
import store from '../store/index'

export const alova = createAlova({
  baseURL:        import.meta.env.VITE_API_URL,
  statesHook:     VueOptionsHook,
  requestAdapter: GlobalFetch(),
  beforeRequest(method) {
    // Suppose we need to add token to the request header
    if (['post', 'put'].includes(method.type)) method.config.headers['Content-Type'] = 'application/json';
    if (store.getters['token/token']()) method.config.params['token'] = store.getters['token/token']();
  },
});
