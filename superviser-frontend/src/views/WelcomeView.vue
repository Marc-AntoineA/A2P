<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container direction='horizontal'>
        <el-main>
          <aap-broken v-show="broken"></aap-broken>
          <el-row v-if='!broken'>
            <el-col :xs="24" :md="6">
              <aap-spinner :show="loading.processes"></aap-spinner>
              <div v-if='!loading.processes' class="grid-content">
                <h3>Processes</h3>
                <h4>Opened</h4>
                  <ul>
                    <li v-for='process in $store.getters.openedProcesses'>
                      {{ process.label }}
                    </li>
                  </ul>
                <h4>Draft</h4>
                <ul>
                  <li v-for='process in $store.getters.draftProcesses'>
                    {{ process.label }}
                  </li>
                </ul>

                <h4>Closed</h4>
                <ul>
                  <li v-for='process in $store.getters.closedProcesses'>
                    {{ process.label }}
                  </li>
                </ul>

              </div>
            </el-col>
            <el-col :xs="24" :md="12">
              <aap-spinner :show="loading.pending"></aap-spinner>
              <div v-if='!loading.pending' class="grid-content">
              <h3>Pending reviews</h3>
              <el-card v-for='applicant in pendingApplicants' shadow="hover">
                {{ applicant.name }}
              </el-card>

            </div>
            </el-col>
            <el-col :xs="24" :md="6">
              <aap-spinner :show="loading.applicants"></aap-spinner>
              <div v-if='!loading.applicants' class="grid-content">
                <h3>New applicants</h3>
                <ul>
                  <li v-for='applicant in lasts10Applicants'>
                    {{ applicant.name }} - {{ applicant.createdAt }}
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer/>
  </el-container>
</template>

<script>
import AapSpinner from '../components/Spinner.vue';
import AapHeader from '../components/Header.vue';
import AapFooter from '../components/Footer.vue';
import AapBroken from '../components/Broken.vue';

export default {
  name: 'Welcome',
  components: { AapHeader, AapFooter , AapBroken, AapSpinner },
  data: () => ({
    loading: { applicants: true, processes: true, pending: true },
    broken: false
  }),
  beforeMount() {
    this.fetchProcesses();
    this.fetchPendingApplicants();
    this.fetchApplicants();
  },
  computed: {
    processes() { return this.$store.getters.processes; },
    lasts10Applicants() { return this.$store.getters.lasts10Applicants; },
    pendingApplicants() { return this.$store.getters.pendingApplicants; },
  },
  methods: {
    fetchProcesses() {
      this.$store.dispatch('FETCH_PROCESSES').then(() => {
        this.loading.processes = false;
      }).catch((error) => {
        this.broken = true;
        this.loading.processes = false;
        this.$alert(error.message, 'Error while downloading processes', {
          confirmButtonText: 'OK'
        });
      });
    },
    fetchPendingApplicants() {
      this.$store.dispatch('GET_PENDING_APPLICANTS').then(() => {
        this.loading.pending = false;
      }).catch((error) => {
        this.broken = true;
        this.loading.pending = false;
        this.$alert(error.message, 'Error while downloading pending applicants', {
          confirmButtonText: 'OK'
        });
      });
    },
    fetchApplicants() {
      this.$store.dispatch('GET_LASTS_10_APPLICANTS').then(() => {
        this.loading.applicants = false;
      }).catch((error) => {
        this.broken = true;
        this.loading.applicants = false;
        this.$alert(error.message, 'Error while downloading appilicants', {
          confirmButtonText: 'OK'
        });
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
