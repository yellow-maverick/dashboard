import { alova }   from '../../js/alova.js'

const getJson = async (promise, commit) => {
  let profile = await (await promise).clone().json()
  commit('saveProfile', profile)

  return profile
}

export const namespaced = true
export const state      = { profile: {} }
export const getters    = {
  profile: (state) => () => state.profile
}
export const mutations  = {
  saveProfile(state, profile) {
    state.profile = profile
  },
  saveProfilePromise(state, promise) {
    state.profilePromise = promise
  },
}
export const actions    = {
  async fetch({ state, commit }) {
    if (state.profilePromise) return getJson(state.profilePromise, commit)

    let promise = alova.Get('/v1/users/profile')
    commit('saveProfilePromise', promise)
    return getJson(promise, commit)
  }
}
