<template>
  <el-container direction='vertical'>
    <el-main>
      <h1>TODO: Login view</h1>
    </el-main>
    <aap-footer></aap-footer>
  </el-container>
</template>

<script>

import AapFooter from '../components/Footer.vue';

export default {
  name: 'Login',
  props: {},
  components: { AapFooter }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
