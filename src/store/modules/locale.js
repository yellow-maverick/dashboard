const loadState = (key) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

const saveState = (key, state) => {
  if (!state || state.length == 0) return;
  window.localStorage.setItem(key, JSON.stringify(state))
}
export const namespaced = true
export const state      = { locale: 'en' }
export const getters    = { }
export const mutations  = {
  saveLocale(state, locale) {
    state.locale = locale
    saveState('locale', locale)
  },
}
export const actions    = {
  async fetch() {
    let locale = loadState('locale')
    if (locale.toString() == '') locale = null
    return locale || navigator.language.split('-')[0] || this.$i18n.locale || 'en'
  },
}
