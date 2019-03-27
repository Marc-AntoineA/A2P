<template>
  <el-header>
    <el-menu mode='horizontal' router='true'>
      <el-menu-item>
        <img class='logo' src='../assets/images/logo.jpg'/>
      </el-menu-item>
      <el-menu-item index='/processes' router='true' route='/processes'>
        Processes
      </el-menu-item>
      <el-menu-item index='2'>Create a new campaign</el-menu-item>
      <el-menu-item index='3'>About this website</el-menu-item>
      <el-menu-item index='/logout' router='true' route='/login'>Logout</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>

export default {
  name: 'aap-header',
  props: [],
}
</script>

<style>
</style>
