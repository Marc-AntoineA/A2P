<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <aap-aside-menu></aap-aside-menu>
        <el-main>
          <h2>TODO: campaigns list</h2>
          <aap-spinner :show="loading"></aap-spinner>
          <aap-broken v-show="broken"></aap-broken>
          <ul v-if="!loading">
            <li v-for="(process, id) in processes" :key="id" :id="id">
              {{ process.label }}
            </li>
          </ul>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer></aap-footer>
  </el-container>
</template>

<script>
import AapSpinner from '../components/Spinner.vue';
import AapHeader from '../components/Header.vue';
import AapFooter from '../components/Footer.vue';
import AapAsideMenu from '../components/AsideMenu.vue';
import AapBroken from '../components/Broken.vue';

export default {
  name: 'Processes',
  components: { AapSpinner, AapHeader, AapFooter, AapAsideMenu, AapBroken },
  props: {},
  data: () => ({
    loading: true,
    broken: true
  }),
  computed: {
    processes() { console.log(this.$store.state.processes); return this.$store.state.processes; }
  },
  beforeMount() { this.fetchProcesses() },
  methods: {
    fetchProcesses() {
      this.loading = true;
      this.broken = false;
      this.$store.dispatch('FETCH_PROCESSES', {}).then(() => {
        this.loading = false;
      }).catch((error) => {
        this.broken = true;
        this.$alert(error.message, 'Error while downloading processes', {
          confirmButtonText: 'OK'
        });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
