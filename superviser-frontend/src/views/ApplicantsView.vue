<template>
  <el-container direction='vertical'>
    <aap-header></aap-header>
    <el-container>
      <el-main>
        <aap-broken v-show="broken"></aap-broken>
        <div v-show='!broken'>
          <h2>Applicants list</h2>

          <div class='process-box'>
            <ul>
              <li><span class='label'>Label: </span>{{ process.label }}</li>
              <li><span class='label'>Location: </span>{{ process.location }}</li>
              <li><span class='label'>Deadline: </span>{{ new Date(process.deadline) }}</li>
            </ul>
            <el-tooltip class="item" effect="dark" content="See this process" placement="bottom">
              <i class='el-icon-search round-boxed big'></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Download applicants" placement="bottom">
              <i class='el-icon-download big round-boxed' @click='downloadApplicants(scope.row._id)'/>
            </el-tooltip>
          </div>

          <div class='filters-box'>
            <el-radio-group v-model='selectedFilter'>
              <el-radio-button label="all">All Students</el-radio-button>
              <el-radio-button label="pending">Pending Students</el-radio-button>
              <el-tooltip effect="dark" content="No modification for more than 5 days" placement="bottom">
                <el-radio-button label="inactive">Inactive Students</el-radio-button>
              </el-tooltip>
              <el-radio-button label="accepted">Accepted Students</el-radio-button>
              <el-radio-button label="rejected">Rejected Students</el-radio-button>
              <el-tooltip  v-for="step, index in process.steps" :key="index" effect="dark" :content="step.label" placement="bottom">
                <el-radio-button  :label="'step' + index">Step#{{ index + 1 }} completed</el-radio-button>
              </el-tooltip>
            </el-radio-group>
          </div>

          <el-input
            placeholder="Type a name, a mail address or a phone number"
            prefix-icon="el-icon-search"
            v-model="searchInput">
          </el-input>
          {{ searchInput }}

          <el-dialog v-if='!loading.applicants && !loading.proces && !broken' class='applicant-modal'
            :title="displayedApplicantName()" :visible.sync="applicantModalVisible"
            width="90%" center>
            <Aap-process-answers :applicant='getCurrentApplicant()'
             :applicantId='currentDisplayedApplicant.applicantId'/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="applicantModalVisible = false">Cancel</el-button>
            </span>
          </el-dialog>

          <aap-spinner :show="loading.processes"></aap-spinner>
          <aap-spinner :show="loading.applicants"></aap-spinner>

          <p class='samll'> {{ applicants.length }} candidates displayed</p>
          <el-table :data='applicants' @row-click='displayModal' ref="applicantsTable" max-height="500">
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
            <el-table-column label='Current step / Status' align='center' prop='status'>
              <template slot-scope='scope'>
                <div v-if='scope.row.status === "pending"'>
                  <div class='bar'>
                    <div v-for='step, index in scope.row.process.steps' :key='index'
                    v-bind:style="{ width: 100/scope.row.process.steps.length + '%', }" :class='"segment " + step.status'>
                    </div>
                  </div>


                  <!-- <span class='step-status todo'>
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
                  </span> -->
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
    selectedFilter: "all",
    searchInput: ""
  }),
  props: [],
  beforeMount() {
    this.fetchProcesses().then(() => {
      this.fetchApplicants();
    });
  },
  mounted() {
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
      if (this.$store.state.applicantsByProcessId[this.process._id]) return;
      return new Promise((resolve, reject) => {
        this.loading.applicants = true;
        this.broken = false;
        this.$store.dispatch('FETCH_APPLICANTS_BY_PROCESS_ID', this.process._id).then((applicants) => {
          this.loading.applicants = false;
          // this.setDefaultFilter('status', ['required']);
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
    }
  },
  computed: {
    applicants() {
      if (!this.$route.params.processId) return [];
      if (!this.$store.state.applicantsByProcessId[this.$route.params.processId]) return [];
      const applicants = Object.values(this.$store.state.applicantsByProcessId[this.process._id]);
      const filteredApplicants = applicants.filter((applicant) => {
        if (this.selectedFilter === 'all') return true;
        if (this.selectedFilter === 'accepted') return applicant.status === 'accepted';
        if (this.selectedFilter === 'rejected') return applicant.status === 'rejected';
        if (this.selectedFilter === 'pending') {
          if (applicant.status !== 'pending') return false;
          let waitValidation = true;
          for (let k=0; k<applicant.process.steps.length;k++) {
            const step = applicant.process.steps[k];
            if (step.status === 'pending') return true;
            if (step.status !== 'validated') waitValidation = false;
          }
          return waitValidation;
        }
        if (this.selectedFilter === 'inactive') {
          if (applicant.status !== 'pending') return false;
          const updatedAt = new Date(applicant.update_at);
          updatedAt.setDate(updatedAt.getDate() + 5);
          if (updatedAt >= new Date()) return false;
          for (let k=0; k<applicant.process.steps.length;k++) {
            const step = applicant.process.steps[k];
            if (step.status === 'todo' || step.status === 'rejected') return true;
          }
          return false;
        }
        for (let k=0; k<applicant.process.steps.length;k++) {
          if (this.selectedFilter === 'step' + k) {
            const step = applicant.process.steps[k];
            return step.status === 'validated';
          }
        }
        return false;
      });
      return filteredApplicants.filter((applicant) => {
        if(applicant.name.toLowerCase().includes(this.searchInput.toLowerCase())) return true;
        if(applicant.mailAddress.toLowerCase().includes(this.searchInput.toLowerCase())) return true;
        if(applicant.phoneNumber.toLowerCase().includes(this.searchInput.toLowerCase())) return true;
        if(applicant.name.toLowerCase().includes(this.searchInput.toLowerCase())) return true;
      });
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
        counter['averageMark'] = div > 0 ? Math.round(10 * averageMark / div)/10 : 0;
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

.process-box ul {
  list-style: none;
}

.process-box li {
  display: inline-block;
}

.stat-number {
	font-size: 30px;
	font-weight: bold;
	border: 2px solid teal;
	border-radius: 100%;
	padding: 6px 8px;
	color: white;
	background-color: teal;
}

.label {
	text-transform: uppercase;
	font-size: 12px;
	font-weight: bolder;
	color: teal;
	margin-left: 10px;
}

.label-stats {
	text-transform: uppercase;
	font-size: 12px;
	font-weight: bolder;
	color: teal;
	margin-left: 10px;
	vertical-align: top;
	margin-right: 5px;
}


.bar {
  width: 100%;
  height: 30px;
  border-radius: 10px;
  background-color: #b3b3b3;
  color: white;
  text-align: center;
}

.segment {
  /* width: 25%; */
  height: 100%;
  float: left;
  color: white;
  text-transform: uppercase;
  font-size: 9px;
}

.segment:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.segment:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.segment.todo {
  background-color: grey;
}

.segment.validated {
  background-color: green;
}

.segment.rejected {
  background-color: red;
}

.segment.pending {
  background-color: orange;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
