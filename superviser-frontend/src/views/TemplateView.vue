<template>
  <el-container>
    <el-container>
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
      <el-container>
        <el-aside>
          <el-menu>
            <el-menu-item>Campaign Overview</el-menu-item>
            <el-menu-item>Edit Mail Templates</el-menu-item>
            <el-menu-item>Close this Campaign</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <h2> Main </h2>
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
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
