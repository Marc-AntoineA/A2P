<template>
  <el-container>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <aap-aside-menu></aap-aside-menu>
        <el-main>
          <h2>Applicants list</h2>
        </el-main>
      </el-container>
    </el-container>
    <el-footer>
      FOOTER
      <el-button>Hello</el-button>
    </el-footer>
  </el-container>
</template>

<script>

import AapHeader from '../components/Header.vue';
import AapAsideMenu from '../components/AsideMenu.vue';

export default {
  name: 'Applicants',
  components: { AapHeader, AapAsideMenu },
  props: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
