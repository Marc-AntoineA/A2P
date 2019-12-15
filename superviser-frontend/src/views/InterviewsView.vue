<template>
  <el-container direction='vertical'>
    <aap-header></aap-header>
    <el-container>
      <el-main>
        <aap-broken v-show="broken"></aap-broken>
        <div v-show='!broken'>
          <!-- <h2>Interviews</h2> -->

          <div v-if='!this.process'>
            Please select a process to continue

            <el-select v-model="selectedProcess" placeholder="Select a process" @change='changeProcess'>
              <el-option
                v-for="process in Object.values(this.$store.state.processes)"
                :key="process._id"
                :label="process.label"
                :value="process._id">
              </el-option>
            </el-select>
          </div>

          <div v-if='this.process'>
            <!-- You selected {{ this.process.label }}! -->

            <el-tabs v-model="activeName">
              <el-tab-pane label="Months" name="first">
                <el-calendar>
                  <template slot="dateCell" slot-scope="{date, data}">
                    <div class='cell-date'>{{ data.day.split('-')[2] }}</div>
                    <ul class='cell-slots'>
                    <li v-for='interview in interviewsByDate[data.day]'>
                      <div :class='interview.applicantId !== "" ? "itw-slot free" : "itw-slot"'>
                        <span class='begin'>{{ interview.begin | timeFormatter}}</span>
                        <span class='people'>{{ interview.applicantId }}</span>
                      </div>
                    </li>
                  </ul>
                  </template>
                </el-calendar>
              </el-tab-pane>
              <el-tab-pane label="Weeks" name="second">


              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-main>
    </el-container>
    <aap-footer/>
  </el-container>
</template>

<script>

import AapHeader from '../components/Header.vue';
import AapFooter from '../components/Footer.vue';
import AapSpinner from '../components/Spinner.vue';
import AapBroken from '../components/Broken.vue';
import { timeFormatter } from '../filters';


export default {
  name: 'Interviews',
  components: { AapHeader, AapFooter, AapBroken, AapSpinner },
  data: () => ({
    loading: { processes: true },
    broken: false,
    selectedProcess: undefined,
    activeName: 'first'
  }),
  props: [],
  beforeMount() {
    this.fetchProcesses().then(() => {
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchProcesses().then(() => {
      });
    });
  },
  mounted() {
  },
  methods: {
    changeProcess() {
      this.$router.push({ name: 'interviews-processId', params: { processId: this.selectedProcess }});
      return;
    },
    fetchProcesses() {
      return new Promise((resolve, reject) => {
        if (Object.values(this.$store.state.processes).length !== 0) { this.loading.processes = false; resolve(); return; }
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
  },
  computed: {
    existingProcesses() {
      return Object.values(this.$store.state.processes).map((process) => ({
        label: process.label,
        id: process._id
      }));
    },
    process() {
      if (!this.$route.params.processId) return undefined;
      return this.$store.state.processes[this.$route.params.processId];
    },
    interviewsByDate() {
      const interviewsByDate = {};
      interviewsByDate["2019-12-14"] = [
        { "begin": "2019-12-15T12:00:00", "end": "2019-12-15T12:40:00", "applicantId": "Ahmed" },
        { "begin": "2019-12-15T12:40:00", "end": "2019-12-15T13:00:00", "applicantId": "Marc-Antoine" },
        { "begin": "2019-12-15T13:00:20", "end": "2019-12-15T13:20:00", "applicantId": "" },
        { "begin": "2019-12-15T14:00:20", "end": "2019-12-15T14:20:00", "applicantId": "Aggelina" }
       ]
      return interviewsByDate;
    }
  },
  filters: {
    timeFormatter: timeFormatter
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.is-selected {
  color: #1989FA;
}

ul.cell-slots {
  list-style: none;
  padding: 0;
}

.cell-slots .itw-slot {
  margin: 2px;
  background-color: lightblue;
  border-radius: 2px;

}

</style>

<style>

.el-calendar-table .el-calendar-day {
  height: 130px;
}
</style>
