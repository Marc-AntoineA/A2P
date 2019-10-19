<template>
  <el-header>
    <el-menu mode='horizontal' :router='true'>
      <el-menu-item index='/administration' route='/administration'>
        <img class='logo' src='../assets/images/logo.jpg'/>
      </el-menu-item>
      <el-menu-item index='/administration/processes' route='/administration/processes'>
        Processes
      </el-menu-item>
      <el-menu-item index='/administration/applicants' route='/administration/applicants'>Applicants</el-menu-item>
      <el-menu-item index='/administration/templates' route='/administration/templates'>Templates</el-menu-item>
      <el-menu-item class='last' index='/administration/login' route='/administration/login'>Logout</el-menu-item>
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
