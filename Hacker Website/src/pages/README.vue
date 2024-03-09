<template>
  <q-page class="flex flex-center">
    <section id="about_content">
      <q-card style="width: 80%; height: 60vh;">README</q-card>
    </section>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'READMEPage'
})
</script>

<style scoped>

#about_content {
  background: red;
  opacity: 100%;
  font-family: 'Ubuntu Mono';
  height: 100%;
}

</style>