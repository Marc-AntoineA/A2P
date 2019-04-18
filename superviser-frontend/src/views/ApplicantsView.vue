<template>
  <el-container direction='vertical'>
    <aap-header></aap-header>
    <el-container>
      <el-main>
        <aap-broken v-show="broken"></aap-broken>
        <div v-if='!broken'>
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
          <el-dialog v-if='!loading && !broken' class='applicant-modal'
            :title="displayedApplicantName()" :visible.sync="applicantModalVisible"
            width="90%" center>
            <Aap-process-answers :process='getCurrentApplicantProcess()'
             :applicantId='currentDisplayedApplicant.applicantId'/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="applicantModalVisible = false">Cancel</el-button>
              <el-button type="primary" @click="applicantModalVisible = false">Confirm</el-button>
            </span>
          </el-dialog>
          <aap-spinner :show="loading"></aap-spinner>
          <el-table v-if='!broken' :data='applicants' @row-click='displayModal'>
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
    loading: false,
    broken: false,
    applicantModalVisible: false,
    currentDisplayedApplicant: { applicantId: '', processId: '' },
    selectedProcesses: [],
  }),
  props: {},
  beforeMount() {
    if (Object.values(this.$store.state.processes).length === 0) {
      this.$store.dispatch('FETCH_PROCESSES')
      .then((processes) => {
        if (!this.$route.params.processId) return;
        const processId = this.$route.params.processId;
        const process = this.$store.state.processes[processId];
        this.selectedProcesses = [{ id: process._id, label: process.label }];
        this.handleMultiselect();
      }).catch((error) => {
        this.$alert(error.message, 'Error while downloading processes', {
          confirmButtonText: 'OK'
        });
      });
    } else {
      if (!this.$route.params.processId) return;
      const processId = this.$route.params.processId;
      const process = this.$store.state.processes[processId];
      this.selectedProcesses = [{ id: process._id, label: process.label }];
      this.handleMultiselect();
    }
  },
  methods: {
    fetchApplicantsByProcessId(processId) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.broken = false;
        this.$store.dispatch('FETCH_APPLICANTS_BY_PROCESS_ID', processId).then((applicants) => {
          this.loading = false;
          resolve(applicants);
        }).catch((error) => {
          this.broken = true;
          this.loading = false;
          this.$alert(error.message, 'Error while downloading applicants', {
            confirmButtonText: 'OK'
          });
          reject(error);
        });
      });
    },
    displayedApplicantName() {
      const applicantId = this.currentDisplayedApplicant.applicantId;
      const processId = this.currentDisplayedApplicant.processId;
      if (!this.$store.state.applicantsByProcessId[processId]) return '';
      if (!this.$store.state.applicantsByProcessId[processId][applicantId]) return '';
      return this.$store.state.applicantsByProcessId[processId][applicantId].name;
    },
    getCurrentApplicantProcess() {
      const applicantId = this.currentDisplayedApplicant.applicantId;
      const processId = this.currentDisplayedApplicant.processId;
      if (!this.$store.state.applicantsByProcessId[processId]) return {};
      if (!this.$store.state.applicantsByProcessId[processId][applicantId]) return {};

      const applicant = this.$store.state.applicantsByProcessId[processId][applicantId];
      return applicant.process;
    },
    displayModal(row, column, evt) {
      this.applicantModalVisible = true;
      this.currentDisplayedApplicant = { applicantId: row._id, processId: row.process._id };
    },
    handleMultiselect() {
      const selectedIds = this.selectedProcesses.map((process) => process.id);
      console.log('handle muliselect ', selectedIds);
      selectedIds.forEach((processId) => {
          if (!this.$store.state.applicantsByProcessId[processId])
            this.fetchApplicantsByProcessId(processId);
      });
    }
  },
  computed: {// TODO passer par un getter pour uniquement les applicants qu'on souhaite
    applicants() {
      const selectedIds = this.selectedProcesses.map((process) => process.id);
      const applicants = selectedIds.map((processId) =>
        this.$store.state.applicantsByProcessId[processId] ?
        Object.values(this.$store.state.applicantsByProcessId[processId])
        :
        []
      );
      return  [].concat.apply([], applicants);
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
