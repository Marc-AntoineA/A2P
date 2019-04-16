<template>
  <el-container direction='vertical'>
    <aap-header></aap-header>
    <el-container>
      <el-main>
        <aap-spinner :show="loading"></aap-spinner>
        <aap-broken v-show="broken"></aap-broken>
        <div v-if='!loading && !broken'>
          <h2>Applicants list</h2>
          <div id='processes-input'>
            <div class='label'>Processes</div>
            <multiselect v-model='selectedProcesses' :options='existingProcesses'
              :multiple='true'
              label="label"
              placeholder="Select processes"
              track-by='id'
              @input='handleMultiselect'>
            </multiselect>
            </div>
          </el-form>
          <el-dialog v-if='!loading && !broken' class='applicant-modal' :title="displayedApplicant().name" :visible.sync="applicantModalVisible"
            width="90%" center>
            <Aap-process-answers :process='getApplicantProcess(currentDisplayedApplicantId)'
             applicantId='currentDisplayedApplicantId'/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="applicantModalVisible = false">Cancel</el-button>
              <el-button type="primary" @click="applicantModalVisible = false">Confirm</el-button>
            </span>
          </el-dialog>
          <el-table v-if='!loading && !broken' :data='applicants' @row-click='displayModal'>
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
            <el-table-column label='Last Modification' prop='updatedAt' sortable>
              <template slot-scope='scope'>
                <i class='el-icon-time'></i>
                <span style='margin-left: 10px'>{{ scope.row.updatedAt | dateFormatter }}</span>
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
    <aap-footer/>
  </el-container>
</template>

<script>

import AapHeader from '../components/Header.vue';
import AapFooter from '../components/Footer.vue';
import AapAsideMenu from '../components/AsideMenu.vue';
import AapSpinner from '../components/Spinner.vue';
import AapBroken from '../components/Broken.vue';
import AapProcessAnswers from '../components/ProcessAnswers';
import multiselect from 'vue-multiselect';

export default {
  name: 'Applicants',
  components: { AapHeader, AapFooter, AapAsideMenu, AapBroken, AapSpinner, AapProcessAnswers, multiselect },
  data: () => ({
    loading: true,
    broken: false,
    applicantModalVisible: false,
    currentDisplayedApplicantId: '5cb5c5de1be7ff2ac09d4be2',
    selectedProcesses: null,
  }),
  props: {},
  beforeMount() {
    if (Object.values(this.$store.state.processes).length === 0) {
      this.$store.dispatch('FETCH_PROCESSES');
    }
    this.fetchApplicants();
  },
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
    },
    displayedApplicant() {
      return this.$store.state.applicants[this.currentDisplayedApplicantId];
    },
    getApplicantProcess(applicantId) {
      const applicant = this.$store.state.applicants[applicantId];
      return applicant.process;
    },
    displayModal(row, column, evt) {
      this.applicantModalVisible = true;
      this.currentDisplayedApplicantId = row._id;
    },
    handleMultiselect() {
      console.log(this.selectedProcesses);
    }
  },
  computed: {// TODO passer par un getter pour uniquement les applicants qu'on souhaite
    applicants() {
      return Object.values(this.$store.state.applicants);
    },
    existingProcesses() {
      return Object.values(this.$store.state.processes).map((process) => ({
        label: process.label,
        id: process._id
      }));
    }
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

.applicant-modal .el-dialog{
  margin-top: 5vh;
}

#processes-input .label {
	text-align: left;
	text-transform: uppercase;
	font-size: 13px;
	font-weight: bold;
	margin-bottom: 5px;
	color: #41b883;
	margin-left: 2px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
