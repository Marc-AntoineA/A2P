<template>
  <el-container direction='vertical'>
    <aap-header></aap-header>
    <el-container>
      <el-main>
        <aap-broken v-show="broken"></aap-broken>
        <div v-if='!broken'>
          <h2>Applicants list</h2>
          Process {{ process.label }}

          <el-dialog v-if='!loading && !broken' class='applicant-modal'
            :title="displayedApplicantName()" :visible.sync="applicantModalVisible"
            width="90%" center>
            <Aap-process-answers :applicant='getCurrentApplicant()'
             :applicantId='currentDisplayedApplicant.applicantId'/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="applicantModalVisible = false">Cancel</el-button>
            </span>
          </el-dialog>

          <aap-spinner :show="loading.processes"></aap-spinner>
          aa
          <aap-spinner :show="loading.applicants"></aap-spinner>
          <el-table v-if='!broken' :data='applicants' @row-click='displayModal' ref="applicantsTable">
            <el-table-column label='Process' prop='process.label' sortable></el-table-column> -->
            <el-table-column label='Name' prop='name' sortable></el-table-column>
            <el-table-column label='Mail' prop='mailAddress' width='80px' sortable>
              <template slot-scope='scope'>
                <a class='black-link' :href='"mailto:" + scope.row.mailAddress' target='_blank'>
                  <i class='el-icon-message round-boxed big'></i>
                </a>
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
            <el-table-column label='Current step / Status' align='center'
              :filters="filterStatus"
              :filter-method="filterStatusHandler"
              filter-placement="bottom-end"
              :filter-multiple="false"
              prop='status'>
              <template slot-scope='scope'>
                <div v-if='scope.row.status === "pending"'>
                  <span class='step-status todo'>
                    {{ computedStatus[scope.row._id].todo }}
                    <i class='status-icon el-icon-service'></i>
                  </span>
                  <span class='step-status pending'>
                    {{ computedStatus[scope.row._id].pending }}
                    <i class='status-icon el-icon-more'></i>
                  </span>
                  <span class='step-status validated'>
                    {{ computedStatus[scope.row._id].validated }}
                    <i class='status-icon el-icon-check'></i>
                  </span>
                  <span class='step-status rejected'>
                    {{ computedStatus[scope.row._id].rejected }}
                    <i class='status-icon el-icon-close'></i>
                  </span>
                </div>
                <div v-if='scope.row.status !== "pending"'>
                  <span class='status-box'>{{ scope.row.status }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label='Average Mark' align='center'>
              <template slot-scope='scope'>
                <span class='status-box'>{{ computedStatus[scope.row._id].averageMark }}</span>
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

export default {
  name: 'Applicants',
  components: { AapHeader, AapFooter, AapAsideMenu, AapBroken, AapSpinner, AapProcessAnswers },
  data: () => ({
    loading: { processes: true, applicants: true },
    broken: false,
    applicantModalVisible: false,
    currentDisplayedApplicant: { applicantId: '' },
    filterStatus: [
      { text: 'Accepted Students', value: 'accepted' },
      { text: 'Rejected Students', value: 'rejected' },
      { text: 'Required Task', value: 'required', default: true }
    ]
  }),
  props: [],
  beforeMount() {
    this.fetchProcesses().then(() => {
      this.fetchApplicants();
    });
  },
  mounted() {
    this.setDefaultFilter('status', ['required']);
  },
  methods: {
    fetchProcesses() {
      return new Promise((resolve, reject) => {
        if (Object.values(this.$store.state.processes).length !== 0) { resolve(); return; }
        this.loading.processes = true;
        this.$store.dispatch('FETCH_PROCESSES')
        .then((processes) => {
          this.loading.processes = false;
          resolve();
        }).catch((error) => {
          this.loading.processes = false;
          this.broken = true;
          this.$alert(error.message, 'Error while downloading processes', {
            confirmButtonText: 'OK'
          });
          reject();
        });
      });
    },
    fetchApplicants() {
      if (!this.process) return;
      return new Promise((resolve, reject) => {
        this.loading.applicants = true;
        this.broken = false;
        this.$store.dispatch('FETCH_APPLICANTS_BY_PROCESS_ID', this.process._id).then((applicants) => {
          this.loading.applicants = false;
          resolve(applicants);
        }).catch((error) => {
          this.broken = true;
          this.loading.applicants = false;
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
    getCurrentApplicant() {
      const applicantId = this.currentDisplayedApplicant.applicantId;
      const processId = this.currentDisplayedApplicant.processId;
      if (!this.$store.state.applicantsByProcessId[processId]) return {};
      if (!this.$store.state.applicantsByProcessId[processId][applicantId]) return {};

      const applicant = this.$store.state.applicantsByProcessId[processId][applicantId];
      return applicant;
    },
    displayModal(row, column, evt) {
      this.applicantModalVisible = true;
      this.currentDisplayedApplicant = { applicantId: row._id, processId: row.process._id };
    },
    filterStatusHandler(value, row) {
      if (value === 'accepted')
        return row.status === 'accepted';

      if (value === 'rejected')
        return row.status === 'rejected';

      if (row.status !== 'pending')
        return false;

      const status = this.computedStatus[row._id];
      if (value === 'required')
        return status.pending > 0 || status.accepted === row.process.steps.length;

      return false;
    },
    setDefaultFilter(colProp, filteredValue) {
      if (!this.$refs.applicantsTable) {
        throw new Error('Table should have a ref named applicantsTable.');
      }
      const typeColumn = this.$refs.applicantsTable.columns.find(col => col.property === colProp);
      typeColumn.filteredValue = filteredValue;
      this.$refs.applicantsTable.store.commit('filterChange', {
        column: typeColumn,
        values: filteredValue,
      });
      this.$refs.applicantsTable.store.updateAllSelected();
    }
  },
  computed: {// TODO passer par un getter pour uniquement les applicants qu'on souhaite
    applicants() {
      if (!this.process._id) return [];
      if (!this.$store.state.applicantsByProcessId[this.process._id]) return [];
      return Object.values(this.$store.state.applicantsByProcessId[this.process._id]);
    },
    existingProcesses() {
      return Object.values(this.$store.state.processes).map((process) => ({
        label: process.label,
        id: process._id
      }));
    },
    process() {
      return this.$store.state.processes[this.$route.params.processId];
    },
    computedStatus() {
      const result = {};
      this.applicants.forEach((applicant) => {
        const counter = {
          'pending': 0,
          'validated': 0,
          'rejected': 0,
          'todo': 0
        };
        let averageMark = 0;
        let div = 0;
        const steps = applicant.process.steps;
        steps.forEach((step) => {
          counter[step.status]++;
          if (step.status === 'validated') {
            averageMark += step.mark;
            div++;
          }
        });
        counter['averageMark'] = Math.round(10 * averageMark / div)/10;
        result[applicant._id] = counter;
      });
      return result;
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

.step-status {
	font-size: 17px !important;
	font-weight: bold;
	margin: 3px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
