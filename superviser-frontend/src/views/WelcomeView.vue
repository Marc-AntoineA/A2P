<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container direction='horizontal'>
        <el-main>
          <aap-broken v-show="broken"></aap-broken>

          <el-dialog v-if='!broken && !loading.applicants' class='applicant-modal'
            :title="currentApplicant.name" :visible.sync="applicantModalVisible"
            width="90%" center>
            <Aap-process-answers :applicant='currentApplicant'
             :applicantId='currentApplicant._id'/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="applicantModalVisible = false">Cancel</el-button>
            </span>
          </el-dialog>

          <el-row v-if='!broken'>
            <el-col :xs="24" :md="6" class='scrolled'>
              <aap-spinner :show="loading.processes"></aap-spinner>
              <div v-if='!loading.processes' class="grid-content processes-box">
                <h3>Processes</h3>
                <ul>
                  <li class='opened' v-for='process in $store.getters.openedProcesses'>
                    <router-link :to='{name: "process", params: {processId: process._id} }'>
                      {{ process.label }}
                    </router-link>
                  </li>
                  <li class='draft' v-for='process in $store.getters.draftProcesses'>
                    <router-link :to='{name: "process", params: {processId: process._id} }'>
                      {{ process.label }}
                    </router-link>
                  </li>
                  <li class='closed' v-for='process in $store.getters.closedProcesses'>
                    <router-link :to='{name: "process", params: {processId: process._id} }'>
                      {{ process.label }}
                    </router-link>
                  </li>
                </ul>

              </div>
            </el-col>
            <el-col :xs="24" :md="12" class='scrolled'>
              <aap-spinner :show="loading.pending"></aap-spinner>
              <div v-if='!loading.pending' class="grid-content">
              <h3> {{ pendingApplicants.length }} Pending reviews</h3>
              <el-select v-model='filteredProcess' placeholder="Select" style='width: 70%'>
                <el-option default value='all' label='All processes'></el-option>
                <el-option
                 v-for="process, index in processes"
                 :key="index"
                 :label="process.label"
                 :value="process._id">
               </el-option>
             </el-select>
              <el-card v-for='applicant, index in pendingApplicants' shadow="hover" :key='index' class='pending-applicant'>
                  <span class='name'>{{applicant.name}}</span>, for <span class='process'>{{ applicant.process.label }}</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click='openReview(index)'>Review</el-button><br/>
                  <span class='task' v-if='nbTasksToReview[applicant._id] > 0'>{{ nbTasksToReview[applicant._id] }} steps to review</span>
                  <span class='task' v-if='nbTasksToReview[applicant._id] == 0'>Needs final validation</span>
              </el-card>

            </div>
            </el-col>
            <el-col :xs="24" :md="6" class='scrolled'>
              <aap-spinner :show="loading.applicants"></aap-spinner>
              <div v-if='!loading.applicants' class="grid-content">
                <h3>The Last 10 Candidates</h3>
                <el-timeline>
                  <el-timeline-item
                    v-for="(applicant, index) in lasts10Applicants"
                    :key="index"
                    :timestamp="new Date(applicant.createdAt).toISOString().split('T')[0] + ' ' + new Date(applicant.createdAt).toISOString().split('T')[1].slice(0, 8)">
                    <span class='name'>{{applicant.name}}</span>, for <span class='process'>{{ applicant.process.label }}</span>
                  </el-timeline-item>
                </el-timeline>
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
import AapProcessAnswers from '../components/ProcessAnswers.vue';

export default {
  name: 'Welcome',
  components: { AapHeader, AapFooter , AapBroken, AapSpinner, AapProcessAnswers },
  data: () => ({
    loading: { applicants: true, processes: true, pending: true },
    broken: false,
    applicantModalVisible: false,
    currentDisplayedApplicantIndex: 0,
    filteredProcess: 'all'
  }),
  beforeMount() {
    this.fetchProcesses();
    this.fetchPendingApplicants();
    this.fetchApplicants();
  },
  computed: {
    processes() { return this.$store.getters.processes; },
    lasts10Applicants() { return this.$store.getters.lasts10Applicants; },
    pendingApplicants() {
      return this.$store.getters.pendingApplicants.filter((applicant) => {
        if (this.filteredProcess === 'all') return true;
        return applicant.process._id === this.filteredProcess;
      }); },
    nbTasksToReview() {
      const nbTasks = {};
      for (let applicantIndex in this.$store.getters.pendingApplicants) {
        const applicant = this.$store.getters.pendingApplicants[applicantIndex];
        nbTasks[applicant._id] = 0;
        for (let stepIndex in applicant.process.steps) {
          if (applicant.process.steps[stepIndex].status !== 'pending') continue;
          nbTasks[applicant._id]++;
        }
      }
      return nbTasks;
    },
    currentApplicant() { return this.$store.getters.pendingApplicants[this.currentDisplayedApplicantIndex]; },
    today() { return new Date(); },
    yesterday() { const day = new Date(); day.setDate(day.getDate() - 1); return day; },
    todayM2() { const day = new Date(); day.setDate(day.getDate() - 2); return day; },
    todayW1() { const day = new Date(); day.setDate(day.getDate() - 7); return day; },
  },
  methods: {
    fetchProcesses() {
      if (this.processes.length > 0) {this.loading.processes = false; return; }
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
      if (this.pendingApplicants.length > 0) { this.loading.pending = false; return; }
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
      if (this.lasts10Applicants.length > 0) { this.loading.applicants = false; return; }
      this.$store.dispatch('GET_LASTS_10_APPLICANTS').then(() => {
        this.loading.applicants = false;
        this.loading.applicants = false;
      }).catch((error) => {
        this.broken = true;
        this.loading.applicants = false;
        this.$alert(error.message, 'Error while downloading appilicants', {
          confirmButtonText: 'OK'
        });
      });
    },
    openReview(index) {
      this.applicantModalVisible = true;
      this.currentDisplayedApplicantIndex = index;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.processes-box li {
	list-style: none;
	font-size: 14px;
	color: teal;
	font-weight: bold;
  margin: 10px 5px;
}

.processes-box li a {
  color: teal;
}

.processes-box li a:visited {
  color: teal;
}

.processes-box li::before {
	content: "\2B24";
}

.processes-box li.opened::before {
	color: green;
}

.processes-box li.draft::before {
	color: orange;
}

.processes-box li.closed::before {
	color: firebrick;
}

.processes-box ul {
    text-align: left;
    margin: 0px 5px;
    padding: 0px;
}

.pending-applicant {
  margin: 15px 5px;
}

ul.applicants-list {
  text-align: left;
  padding: 0px;
}

.applicants-list li {
  list-style: none;
}

span.name {
  font-weight: bold;
}

.steps-list li {
	display: inline-block;
	border: solid 1px gray;
	border-radius: 14px;
	padding: 5px 10px;
	margin: 2px 5px;
}

.steps-list {
	list-style: none;
	margin: 0px;
}

.task {
	font-size: 14px;
	color: gray;
	font-style: italic;
}

.scrolled {
  max-height: 80vh;
  overflow-y: auto;
}

</style>
