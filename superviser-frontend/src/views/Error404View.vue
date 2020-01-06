<template>
  <el-container direction='vertical'>
    <el-main>
      <h1>Error 404, this page doesn't exist.</h1>
      <p>Go to the <router-link :to="{ name: 'welcome'}"> main page </router-link></p>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: 'Error404',
  props: {},
  components: { }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
