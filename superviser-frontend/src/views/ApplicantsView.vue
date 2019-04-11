<template>
  <el-container>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <aap-aside-menu></aap-aside-menu>
        <el-main>
          <aap-spinner :show="loading"></aap-spinner>
          <aap-broken v-show="broken"></aap-broken>
          <div v-if='!loading && !broken'>
            <h2>Applicants list</h2>
            <el-table v-if='!loading && !broken' :data='applicants'>
              <el-table-column label='Name' prop='name'></el-table-column>

            </el-table>
          </div>
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
import AapSpinner from '../components/Spinner.vue';
import AapBroken from '../components/Broken.vue';

export default {
  name: 'Applicants',
  components: { AapHeader, AapAsideMenu, AapBroken, AapSpinner },
  data: () => ({
    loading: true,
    broken: false
  }),
  props: {},
  beforeMount() { this.fetchApplicants(); },
  methods: {
    fetchApplicants() {
      const processId = this.$route.params.processId;
      this.loading = true;
      this.broken = false;
      this.$store.dispatch('FETCH_APPLICANTS_BY_PROCESS_ID', processId).then(() => {
        this.loading = false;
      }).catch((error) => {
        this.broken = true;
        this.loading = false;
        this.$alert(error.message, 'Error while downloading processes', {
          confirmButtonText: 'OK'
        });
      });
    }
  },
  computed: {// TODO passer par un getter pour uniquement les applicants qu'on souhaite
    applicants() { return Object.values(this.$store.state.applicants); }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
