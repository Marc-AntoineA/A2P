<template>
  <el-container direction='vertical'>
    <el-main>
      <h1>Login Credentials</h1>
      <el-form>
        <el-form-item label='Mail address'>
          <el-input placeholder="Mail address"></el-input>
        </el-form-item>
        <el-form-item label='Password'>
          <el-input placeholder="Password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">Login</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <aap-footer :fixed='true'></aap-footer>
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
/* width: auto;
margin: auto;
width: 400px;
border: solid 2px teal;
background-color: #f9f9f9;*/

</style>
