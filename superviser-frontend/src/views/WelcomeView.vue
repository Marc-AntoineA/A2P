<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container direction='horizontal'>
        <el-main>
          <h2>Superviser Frontend</h2>

          <h3>Last ten applicants</h3>
          <ul>
            <li>TODO 1</li>
            <li>TODO 2</li>
            <li>TODO 3</li>
          </ul>

          <h3>Opened Processes</h3>
          <ul>
            <li>Athens 19</li>
            <li>Barcelona 3</li>
          </ul>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer/>
  </el-container>
</template>

<script>

import AapHeader from '../components/Header.vue';
import AapAsideMenu from '../components/AsideMenu.vue';
import AapFooter from '../components/Footer.vue';

export default {
  name: 'Welcome',
  components: { AapHeader, AapAsideMenu, AapFooter },
  props: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
