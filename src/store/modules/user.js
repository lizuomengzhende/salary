import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    icon: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ICON: (state, icon) => {
    state.icon = icon
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { identifier, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ identifier: identifier.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', response.jwt)
        commit('SET_NAME', response.user.username)
        Cookies.set('name', response.user.username)
        setToken(response.jwt)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 设置icon
  setIcon({ commit }, state ) {
    console.log('statestatestatestatestate',state)
    commit('SET_ICON',state)
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

