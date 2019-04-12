<template>
  <el-container>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <el-main>
          <aap-spinner :show="loading"></aap-spinner>
          <aap-broken v-show="broken"></aap-broken>
          <div v-if='!loading && !broken'>
            <h2>Applicants list</h2>
            <el-table v-if='!loading && !broken' :data='applicants'>
              <el-table-column type='expand'>
                <template slot-scope="scope">

                </template>
              </el-table-column>
              <el-table-column label='Process' prop='campaign' sortable></el-table-column>
              <el-table-column label='Location' prop='process.location' sortable>
                <template slot-scope='scope'>
                  <i class='el-icon-location big'></i>
                  {{ scope.row.campaign.location }}
                </template>
              </el-table-column>
              <el-table-column label='Name' prop='name' sortable></el-table-column>
              <el-table-column label='Mail' prop='mailAddress' sortable>
                <template slot-scope='scope'>
                  <a class='black-link' :href='"mailto:" + scope.row.mailAddress' target='_blank'>
                    <i class='el-icon-message round-boxed big'></i>
                  </a>
                  {{ scope.row.mailAddress }}
                </template>
              </el-table-column>
              <el-table-column label='Phone' prop='phoneNumber' sortable>
                <template slot-scope='scope'>
                  <i class='el-icon-phone big'></i>
                  {{ scope.row.phoneNumber | phoneFormatter }}
                </template>
              </el-table-column>
              <el-table-column label='Current step' prop='status' align='center' sortable>
                <template slot-scope='scope'>
                  <span class='status-box'>{{ scope.row.status }}</span>
                </template>
              </el-table-column>
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
      this.$store.dispatch('FETCH_APPLICANTS_BY_PROCESS_ID', processId).then((applicants) => {
        console.log(applicants);
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
.status-box {
	border: 2px solid teal;
	padding: 2px 5px;
	border-radius: 9px;
	font-size: 10px;
	font-weight: bolder;
	color: white;
	background-color: teal;
	text-transform: uppercase;
}
</style>
