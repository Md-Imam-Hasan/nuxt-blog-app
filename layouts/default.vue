<template>
  <div>
    <TheHeader @sidenavToggle="isSideNavOpen = !isSideNavOpen" />
    <TheSidenav :show="isSideNavOpen" @close="isSideNavOpen = false" />
    <nuxt />
  </div>
</template>

<script>
import TheHeader from '@/components/Navigation/TheHeader'
import TheSidenav from '@/components/Navigation/TheSidenav'
export default {
  components: {
    TheHeader,
    TheSidenav,
  },
  data() {
    return {
      isSideNavOpen: false,
    }
  },
}
</script>

<style>
html {
  font-family: 'Open Sans', sans-serif;
}
</style>
