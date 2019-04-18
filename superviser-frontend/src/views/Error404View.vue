<template>
  <el-container direction='vertical'>
    <el-main>
      <h1>Error 404, this page doesn't exist.</h1>
      <p>Go to the <a href='/administration'> main page </a></p>
    </el-main>
  </el-container>
</template>

<script>
import AapFooter from '../components/Footer.vue';

export default {
  name: 'Error404',
  props: {},
  components: { AapFooter }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
