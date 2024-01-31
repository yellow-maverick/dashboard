import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';
import { VueOptionsHook } from '@alova/vue-options';
import store from '../store/index'

export const alove = createAlova({
  baseURL: import.meta.env.VITE_BASE_URL,
  statesHook: VueOptionsHook,
  requestAdapter: GlobalFetch(),
  beforeRequest(method) {
    // Suppose we need to add token to the request header
    method.config.headers.post['Content-Type'] = 'application/json';
    method.config.headers.put['Content-Type']  = 'application/json';
    if (store.getters.token()) method.config.params['token'] = store.getters.token();
  }
});
