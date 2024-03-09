<template>
  <aside id="sidebar">
    <!-- Navigation Icons -->
    <div class="sidebar-icons">
      <q-btn flat round dense icon="email" @click="navigateTo('contact')"></q-btn>
      <q-btn flat round dense icon="lightbulb_outline" @click="navigateTo('project')"></q-btn>
      <q-btn flat round dense icon="rss_feed" @click="navigateTo('blog')"></q-btn>
      <q-btn flat round dense icon="person_outline" @click="navigateTo('about')"></q-btn>
      <q-btn flat round dense icon="description" @click="navigateTo('resume')"></q-btn>
    </div>
    <q-btn flat round dense icon="home" class="menu-icon" @click="navigateTo('home')"></q-btn>
  </aside>
</template>

<script>
export default {
  name: 'MySidebar',
  methods: {
    navigateTo(page) {
      // Use Vue Router to navigate
      this.$router.push({ name: page });
    },
  },
};
</script>

<style scoped>

</style>
