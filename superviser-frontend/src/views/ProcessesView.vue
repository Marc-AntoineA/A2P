<template>
  <el-container>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <aap-aside-menu></aap-aside-menu>
        <el-main>
          <h2>TODO: campaigns list</h2>
          <ul v-if="!loading">
            <li v-for="(process, id) in processes" :key="id" :id="id">
              {{ process.label }}
            </li>
          </ul>
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
import AapHeader from '../components/Header.vue';
import AapAsideMenu from '../components/AsideMenu.vue';

export default {
  name: 'Processes',
  components: { AapHeader, AapAsideMenu },
  props: {},
  data: () => ({
    loading: true
  }),
  computed: {
    processes() { console.log(this.$store.state.processes);return this.$store.state.processes }
  },
  beforeMount() { this.fetchProcesses() },
  methods: {
    fetchProcesses() {
      console.log(this.$store);
      this.loading = true;
      this.$store.dispatch('FETCH_PROCESSES', {}).then(() => { this.loading = false; });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
