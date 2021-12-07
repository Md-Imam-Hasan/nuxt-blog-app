import axios from 'axios'
import Cookie from 'js-cookie'
import { Store } from 'vuex'

const createStore = () => {
  return new Store({
    state: {
      loadedPosts: [],
      token: null,
    },
    mutations: {
      SET_POSTS(state, payload) {
        state.loadedPosts = payload
      },
      ADD_POST(state, payload) {
        state.loadedPosts.push(payload)
      },
      EDIT_POST(state, payload) {
        const postIndex = state.loadedPosts.findIndex(
          (post) => post.id === payload.id
        )
        state.loadedPosts[postIndex] = payload
      },
      SET_TOKEN(state, payload) {
        state.token = payload
      },
      CLEAR_TOKEN(state) {
        state.token = null
      },
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return axios
          .get(`${process.env.baseUrl}/posts.json`)
          .then((res) => {
            const postsArray = []
            Object.keys(res?.data).map((key) =>
              postsArray.push({ ...res?.data[key], id: key })
            )
            commit('SET_POSTS', postsArray)
          })
          .catch((e) => context.error(e))
      },
      setPosts({ commit }, payload) {
        commit('SET_POSTS', payload)
      },
      addPost({ commit, state }, payload) {
        const createdPost = { ...payload, updatedAt: new Date() }
        return axios
          .post(
            `${process.env.baseUrl}/posts.json?auth=${state.token}`,
            createdPost
          )
          .then((res) =>
            commit('ADD_POST', { ...createdPost, id: res.data.name })
          )
          .catch((e) => console.log(e))
      },
      editPost({ commit, state }, payload) {
        return axios
          .put(
            `${process.env.baseUrl}/posts/${payload.id}.json?auth=${state.token}`,
            {
              ...payload,
              updatedAt: new Date(),
            }
          )
          .then((res) => commit('EDIT_POST', payload))
          .catch((e) => console.log(e))
      },
      authenticateUser({ commit, dispatch }, payload) {
        let URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKey}`

        if (!payload.isLogin) {
          URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKey}`
        }

        return axios
          .post(URL, {
            email: payload.email,
            password: payload.password,
            returnSecureToken: payload.returnSecureToken,
          })
          .then((res) => {
            commit('SET_TOKEN', res.data.idToken)
            localStorage.setItem('token', res.data.idToken)
            localStorage.setItem(
              'tokenExpiration',
              new Date().getTime() + +res.data.expiresIn * 1000
            )
            Cookie.set('jwt', res.data.idToken)
            Cookie.set(
              'tokenExpiration',
              new Date().getTime() + +res.data.expiresIn * 1000
            )

            return axios.post('http://localhost:3000/api/track-data', {
              data: 'Authenticated!',
            })
          })
          .catch((e) => console.log(e))
      },
      initAuth({ commit, dispatch }, req) {
        let token, expirationDate
        if (req) {
          if (!req.headers.cookie) {
            return
          }
          const jwtToken = req.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('jwt='))

          if (!jwtToken) {
            return
          }
          token = jwtToken.split('=')[1]
          expirationDate = req.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('tokenExpiration='))
            .split('=')[1]
        } else {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')
        }
        if (new Date().getTime() > +expirationDate || !token) {
          dispatch('logout')
          return
        }

        commit('SET_TOKEN', token)
      },
      logout({ commit }) {
        commit('CLEAR_TOKEN')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
        }
        Cookie.remove('jwt')
        Cookie.remove('tokenExpiration')
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
      token(state) {
        return state.token
      },
      isAuthenticated(state) {
        return state.token != null
      },
    },
  })
}

export default createStore
