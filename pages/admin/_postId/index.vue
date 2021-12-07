<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmit" />
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import AdminPostForm from '~/components/Admin/AdminPostForm.vue'

export default {
  components: {
    AdminPostForm,
  },
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  asyncData({ error, params }) {
    return axios
      .get(`${process.env.baseUrl}/posts/${params.postId}.json`)
      .then((res) => {
        return { loadedPost: { ...res?.data, id: params.postId } }
      })
      .catch((e) => error(e))
  },
  methods: {
    onSubmit(editedData) {
      this.$store
        .dispatch('editPost', editedData)
        .then(() => this.$router.push('/admin'))
    },
  },
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
