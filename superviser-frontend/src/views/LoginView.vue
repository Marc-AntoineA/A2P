<template>
  <el-container direction='vertical'>
    <el-main class='boxed'>
      <img src='../assets/images/logo.jpg'/>
      <h1>Login Credentials</h1>
      <el-form>
        <el-form-item label='Mail address'>
          <el-input placeholder="Mail address" v-model='username'></el-input>
        </el-form-item>
        <el-form-item label='Password'>
          <el-input placeholder="Password" v-model='password' show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='onSubmit'>Login</el-button>
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
  components: { AapFooter },
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    onSubmit() {
      console.log(`submittons for ${this.username} and ${this.password}`);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.boxed {
  margin: 50px auto;
  border: 1px solid teal;
  background-color: #f0efef;
  width: 330px;
}

.boxed img {
  width: 65%;
}
</style>
