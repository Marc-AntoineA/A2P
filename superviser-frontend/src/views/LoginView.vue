<template>
  <el-container direction='vertical'>
    <el-main class='boxed'>
      <img src='../assets/images/logo.jpg'/>
      <h1>Login Credentials</h1>
      <el-form @submit.prevent='onSubmit'>
        <el-form-item label='Mail address'>
          <el-input placeholder="Mail address" v-model='username'></el-input>
        </el-form-item>
        <el-form-item label='Password'>
          <el-input placeholder="Password" v-model='password' show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="submit" @click='onSubmit'>Login</el-button>
        </el-form-item>
        <el-form-item v-if='loading'>
          <aap-spinner :show="loading"></aap-spinner>
        </el-form-item>
      </el-form>
    </el-main>
    <aap-footer :fixed='true'></aap-footer>
  </el-container>
</template>

<script>
import AapFooter from '../components/Footer.vue';
import AapSpinner from '../components/Spinner.vue';

export default {
  name: 'Login',
  props: {},
  components: { AapSpinner, AapFooter },
  data: () => ({
    username: '',
    password: '',
    loading: false
  }),
  methods: {
    onSubmit() {
      this.loading = true;
      this.$store.dispatch('LOGIN', {
        username: this.username,
        password: this.password
      }).then(() => {
        this.loading = false;
        this.$router.push('/');
        this.$message({
          type: 'success',
          message: 'You are now connected'
        });
      }).catch((error) => {
        this.loading = false;
        this.password = '';
        this.$alert(error.message, 'Login Error', {
          confirmButtonText: 'OK'
        });
      });
    }
  },
  beforeMount() {
    if (!this.$store.getters.isLoggedIn) return;
    this.$store.dispatch('LOGOUT')
      .then(() => {
        this.$message({
          type: 'info',
          message: 'You are now disconnected'
        });
      }).catch((err) => {
      });
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
