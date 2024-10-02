const tokenPath = 'ym.jwtToken'
export const namespaced = true
export const state      = { token: null, override_user: null, loggedIn: false }
export const getters    = {
  loggedIn:      state => () => state.loggedIn,
  token:         state => () => state.token,
  jwtToken:      state => () => state.jwtToken,
  override_user: state => () => state.override_user,
  has_token:     state => () => state.token
}
export const mutations  = {
  save(state, { token, override_user }) {
    if (token) state.token = token
    if (override_user) state.override_user = override_user
  },
  saveJwt(state, token) {
    state.jwtToken = token
    if (token) localStorage.setItem(tokenPath, token)
    else localStorage.removeItem(tokenPath)
  },
  setLoggedIn(state, status) {
    state.loggedIn = status
  }
}
export const actions    = {
  load({ state }) {
    const token = localStorage.getItem(tokenPath)
    if (token) {
      state.loggedIn = true
      state.jwtToken = token
    }
  },
  login({ commit }, token) {
    commit('saveJwt', token);
    commit('setLoggedIn', true);
  },
  logout({ commit }) {
    localStorage.removeItem(tokenPath);
    commit('saveJwt', '');
    commit('setLoggedIn', false);
  },
}
