import axios from 'axios'
import { Store } from 'vuex'

const createStore = () => {
  return new Store({
    state: {
      loadedPosts: [],
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
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return axios
          .get(
            'https://nuxt-blog-106d2-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json'
          )
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
      addPost({ commit }, payload) {
        const createdPost = { ...payload, updatedAt: new Date() }
        return axios
          .post(
            'https://nuxt-blog-106d2-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
            createdPost
          )
          .then((res) =>
            commit('ADD_POST', { ...createdPost, id: res.data.name })
          )
          .catch((e) => console.log(e))
      },
      editPost({ commit }, payload) {
        return axios
          .put(
            `https://nuxt-blog-106d2-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${payload.id}.json`,
            { ...payload, updatedAt: new Date() }
          )
          .then((res) => commit('EDIT_POST', payload))
          .catch((e) => console.log(e))
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
    },
  })
}

export default createStore
