<template>
  <div id="app">
    <el-container>
      <aap-header></aap-header>
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
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  height: 90%;
}

</style>
