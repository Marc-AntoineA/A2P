<template>
  <el-header>
    <el-menu mode='horizontal' :router='true'>
      <el-menu-item index='/administration' route='/'>
        <img class='logo' src='../assets/images/logo.jpg'/>
      </el-menu-item>
      <el-menu-item index='/administration/processes' route='/administration/processes'>
        Processes
      </el-menu-item>
      <el-menu-item index='/administration/applicants' route='/administration/applicants'>Applicants</el-menu-item>
      <el-menu-item index='/administration/login' route='/administration/login'>Logout</el-menu-item>
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
</style>
