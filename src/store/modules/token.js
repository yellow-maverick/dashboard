export const namespaced = true
export const state      = { token: null, override_user: null }
export const getters    = {
  token:         state => () => state.token,
  override_user: state => () => state.override_user,
  has_token:     state => () => state.token
}
export const mutations  = {
  save(state, { token, override_user }) {
    if (token) state.token = token
    if (override_user) state.override_user = override_user
  }
}
export const actions    = { }
