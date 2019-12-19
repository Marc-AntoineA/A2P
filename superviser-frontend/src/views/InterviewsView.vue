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

            <el-dialog :visible.sync="itwModalVisible"
              width="90%" center>
              <h2>Itw choice</h2>
              <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="applicantModalVisible = false">Cancel</el-button>
              </span> -->
            </el-dialog>

            <el-row>
              <el-col :span="18">
                <el-calendar v-model='currentDay'>
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
              </el-col>
              <el-col :span="6">
                <h3>{{ currentDay | dayFormatter }}</h3>

                <div class='day-table'>
                  <div class='hours-col'>
                    <!-- <div class='hours-cell'><span>00:00 </span></div>
                    <div class='hours-cell'><span>01:00 </span></div>
                    <div class='hours-cell'><span>02:00 </span></div>
                    <div class='hours-cell'><span>03:00 </span></div>
                    <div class='hours-cell'><span>04:00 </span></div>
                    <div class='hours-cell'><span>05:00 </span></div>
                    <div class='hours-cell'><span>06:00 </span></div>
                    <div class='hours-cell'><span>07:00 </span></div> -->
                    <div class='hours-cell'><span>08:00 </span></div>
                    <div class='hours-cell'><span>09:00 </span></div>
                    <div class='hours-cell'><span>10:00 </span></div>
                    <div class='hours-cell'><span>11:00 </span></div>
                    <div class='hours-cell'><span>12:00 </span></div>
                    <div class='hours-cell'><span>13:00 </span></div>
                    <div class='hours-cell'><span>14:00 </span></div>
                    <div class='hours-cell'><span>15:00 </span></div>
                    <div class='hours-cell'><span>16:00 </span></div>
                    <div class='hours-cell'><span>17:00 </span></div>
                    <div class='hours-cell'><span>18:00 </span></div>
                    <div class='hours-cell'><span>19:00 </span></div>
                    <div class='hours-cell'><span>20:00 </span></div>
                    <div class='hours-cell'><span>21:00 </span></div>
                    <!-- <div class='hours-cell'><span>22:00 </span></div>
                    <div class='hours-cell'><span>23:00 </span></div> -->
                  </div>
                  <div class='slots-col'>
                    <div v-for='interview in interviewsByDate[currentDayStr]' class='slot-cell'
                      :style="{ top: timeToTop(interview.begin) + 'px', height: timeToHeight(interview.begin, interview.end) + 'px' }">
                      <span>{{ interview.applicantId }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
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
import moment from 'moment';


export default {
  name: 'Interviews',
  components: { AapHeader, AapFooter, AapBroken, AapSpinner },
  data: () => ({
    loading: { processes: true },
    broken: false,
    selectedProcess: undefined,
    currentDay: new Date(),
    itwModalVisible: true
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
    timeToTop(time) {
      const d = new Date(time);
      const pxls = (d.getHours() - 8 + d.getMinutes()/60 + d.getSeconds()/3600)*60;
      return pxls;
    },
    timeToHeight(begin, end) {
      const b = new Date(begin);
      const e = new Date(end);
      const pxls = (e.getHours() - b.getHours() + (e.getMinutes() - b.getMinutes())/60 + (e.getSeconds() - b.getSeconds())/3600)*60;
      return pxls - 2;
    }
  },
  computed: {
    currentDayStr() {
      if (!this.currentDay) return '';
      const m = moment(this.currentDay);
      return m.format('YYYY-MM-DD');
    },
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
      interviewsByDate["2019-12-19"] = [
        { "begin": "2019-12-19T12:00:00", "end": "2019-12-19T12:40:00", "applicantId": "Ahmed" },
        { "begin": "2019-12-19T12:40:00", "end": "2019-12-19T13:00:00", "applicantId": "Marc-Antoine" },
        { "begin": "2019-12-19T13:00:20", "end": "2019-12-19T13:20:00", "applicantId": "" },
        { "begin": "2019-12-19T14:00:20", "end": "2019-12-19T14:20:00", "applicantId": "Aggelina" }
       ]
      return interviewsByDate;
    },
  },
  filters: {
    timeFormatter: timeFormatter,
    dayFormatter(value) {
      if (!value) return '';
      const m = moment(value);
      return m.format('YYYY-MM-DD');
    }
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

.day-table {
  display: flex;
}

.day-table .hours-col {
	border-right: 1px lightgray solid;
	width: 65px;
}

.day-table .hours-col .hours-cell:after {
  content: '';
  border-bottom:
  #dadce0 1px solid;
  position: absolute;
  width: 100%;
  margin-top: -1px;
  z-index: 3;
  pointer-events: none;
}

.hours-cell span {
	top: -11px;
	position: relative;
	font-size: 13px;
	color: gray;
  margin-right: 10px;
}

.hours-cell {
	height: 60px;
}

.slot-cell {
  background-color: #f98530;
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
  position: absolute;
  display: flex;
}

.slot-cell span {
	margin: auto;
	display: block;
	width: 100%;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.slots-col {
  width: 100%;
  position: relative;
}

</style>

<style>

.el-calendar-table .el-calendar-day {
  height: 130px;
}
</style>
