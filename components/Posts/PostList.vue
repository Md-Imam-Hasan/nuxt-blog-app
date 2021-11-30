<template>
  <section class="post-list">
    <PostPreview
      id="1"
      post-title="first post"
      preview-text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem."
      thumbnail="https://source.unsplash.com/random/400x200"
    />
    <PostPreview
      id="2"
      post-title="second post"
      preview-text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem."
      thumbnail="https://source.unsplash.com/random/400x200"
    />
    <PostPreview
      id="3"
      post-title="third post"
      preview-text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem."
      thumbnail="https://source.unsplash.com/random/400x200"
    />
  </section>
</template>

<script>
import PostPreview from '~/components/Posts/PostPreview.vue'
export default { components: { PostPreview } }
</script>

<style>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
