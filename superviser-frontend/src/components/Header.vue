<template>
  <el-header>
    <el-menu mode="horizontal">
      <el-menu-item>
        <img class='logo' src='../assets/images/logo.jpg'/>
      </el-menu-item>
      <el-menu-item index='1'>All Campaigns</el-menu-item>
      <el-menu-item index='2'>Create a new campaign</el-menu-item>
      <el-menu-item index='3'>About this website</el-menu-item>
      <el-menu-item index='4'>Logout</el-menu-item>
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
