<template>
  <el-header>
    <el-menu mode='horizontal' :router='true'>
      <el-menu-item :index="{ name:'welcome' }"> <img class='logo' src='../assets/images/logo.jpg'/> </el-menu-item>
      <el-menu-item :index="{ name: 'processes'}">Processes</el-menu-item>
      <el-menu-item :index="{ name: 'applicants'}">Applicants</el-menu-item>
      <el-menu-item :index="{ name: 'templatesNoSelected'}">Templates</el-menu-item>
      <el-menu-item :index="{ name: 'login'}" class="last">Logout</el-menu-item>
    </el-menu>
  </el-header>
</template>
<script>

export default {
  name: 'aap-header',
  props: [],
  methods: {}
}
</script>

<style>
.last {
  float: right!important;
}
</style>
