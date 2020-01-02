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

          <div v-if='this.process' style='overflow-x: hidden'>

            <el-dialog v-if='$store.state.interviewsByProcessId[process._id] && $store.state.interviewsByProcessId[process._id][selectedSlotId]'
              :visible.sync="itwModalVisible"
              width="50%" center>
              <h2>Edit this slot</h2>
              <el-form :model="selectedSlotForm" label-width="120px">
                <el-form-item label="Day">
                  <el-date-picker type="date" placeholder="Pick a date" v-model="selectedSlotForm.day" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="Time">
                  <el-time-picker
                      is-range
                      v-model="selectedSlotForm.time"
                      range-separator="To"
                      start-placeholder="Start time"
                      end-placeholder="End time"
                      :picker-options='{ format: "HH:mm"}'>
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="Applicant">
                  <el-select v-model="selectedSlotForm.applicantId" filterable placeholder="Select">
                    <el-option :value='undefined' label='None'/>
                    <el-option
                      v-for="applicant in $store.state.applicantsByProcessId[process._id]"
                      :key="applicant._id"
                      :label="applicant.name"
                      :value="applicant._id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" @click="deleteSelectedSlot">Delete</el-button>
                  <el-button type="primary" @click="saveSlot">Save</el-button>
                  <el-button>Cancel</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>

            <el-row>
              <el-col :span="18">
                <el-calendar v-model='currentDay'>
                  <template slot="dateCell" slot-scope="{date, data}">
                    <div class='cell-date'>{{ data.day.split('-')[2] }}</div>
                    <ul class='cell-slots'>
                    <li v-for='interview in interviewsByDate[data.day]'>
                      <div :class='interview.applicantId ? "itw-slot" : "itw-slot free"'>
                        <span class='begin'>{{ interview.begin | timeFormatter}}</span>
                        <span class='people'>{{ interview.applicant ? interview.applicant.name : ''}}</span>
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
                  <div class='slots-col' @click='createSlot'>
                    <div v-for='interview, index in interviewsByDate[currentDayStr]'
                      :class='"slot-cell " + (interview.applicant ? "selected" : "free")'
                      :index='index'
                      :style="{ top: timeToTop(interview.begin) + 'px', height: timeToHeight(interview.begin, interview.end) + 'px' }"
                      @click='evt => editSlot(evt, interview._id)'>
                      <span>{{ interview.applicant ? interview.applicant.name : '?' }}</span>
                    </div>
                  </div>
                </div>
                <el-button @click='clearAllSlots'>Remove All Slots</el-button>
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
    loading: { processes: true, interviews: true, applicants: true },
    broken: false,
    selectedProcess: undefined,
    currentDay: new Date(),
    itwModalVisible: false,
    selectedSlotId: undefined,
    selectedSlotForm: {
      day: undefined,
      time: [undefined, undefined],
      applicantId: undefined
    }
  }),
  props: [],
  beforeMount() {
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.processId) {
        if (vm.$store.state.applicantsByProcessId[to.params.processId]) return;
        vm.fetchApplicants(to.params.processId);
      }

      vm.fetchProcesses().then(() => {
        if (!to.params.processId) return;
        if (vm.$store.state.interviewsByProcessId[to.params.processId]) return;
        vm.fetchInterviews(to.params.processId);
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
    fetchInterviews(processId) {
      this.loading.interviews = true;
      this.$store.dispatch('FETCH_INTERVIEWS_BY_PROCESS_ID', processId)
      .then((interviews) => {
        this.loading.interviews = false;
      }).catch((error) => {
        this.loading.interviews = false;
        this.broken = true;
        this.$alert(error.message, 'Error while downloading interviews', {
          confirmButtonText: 'OK'
        });
      });
    },
    fetchApplicants(processId) {
      this.loading.applicants = true;
      this.$store.dispatch('FETCH_APPLICANTS_BY_PROCESS_ID', processId)
      .then((applicants) => {
        this.loading.applicants = false;
      }).catch((error) => {
        this.loading.applicants = false;
        this.broken = true;
        this.$alert(error.message, 'Error while downloading applicants', {
          confirmButtonText: 'OK'
        });
      });
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
    topToTime(pxls) {
      const time = pxls/60; // in secos
      const hours = Math.floor(time) + 8;
      const mins = Math.floor((time - Math.floor(time))*60);
      const roundMins = 30*Math.round(mins/30);
      const secs = 0;
      return { hours, mins: roundMins, secs };
    },
    timeToHeight(begin, end) {
      const b = new Date(begin);
      const e = new Date(end);
      const pxls = (e.getHours() - b.getHours() + (e.getMinutes() - b.getMinutes())/60 + (e.getSeconds() - b.getSeconds())/3600)*60;
      return pxls - 2;
    },
    createSlot(evt) {
      const time = this.topToTime(evt.layerY);

      const b = new Date(this.currentDay);
      b.setHours(time.hours)
      b.setMinutes(time.mins);
      b.setSeconds(time.secs);

      const e = new Date(this.currentDay);
      e.setHours(time.hours)
      e.setMinutes(time.mins + 30);
      e.setSeconds(time.secs);

      const itw = {
        begin: b,
        end: e,
        supervisorId: this.$store.state.user.id,
        processId: this.process._id
      };
      this.$store.dispatch('ADD_INTERVIEW_SLOT', itw);
    },
    editSlot(evt, slotId) {
      this.itwModalVisible = true;
      this.selectedSlotId = slotId;
      const slot = this.$store.state.interviewsByProcessId[this.process._id][slotId];
      this.selectedSlotForm.day = slot.begin;
      this.selectedSlotForm.time[0] = slot.begin;
      this.selectedSlotForm.time[1] = slot.end;
      this.selectedSlotForm.applicantId = slot.applicantId;
      evt.stopPropagation();
    },
    saveSlot() {
      const slot = JSON.parse(JSON.stringify(this.$store.state.interviewsByProcessId[this.process._id][this.selectedSlotId]));
      slot.applicant = undefined;
      const timeBegin = new Date(this.selectedSlotForm.time[0]);
      const timeEnd  = new Date(this.selectedSlotForm.time[1]);
      const day = new Date(this.selectedSlotForm.day);
      timeBegin.setDate(day.getDate());
      timeEnd.setDate(day.getDate());

      slot.begin = timeBegin,
      slot.end = timeEnd;
      slot.applicantId = this.selectedSlotForm.applicantId;
      this.$store.dispatch('UPDATE_INTERVIEW_SLOT', slot).then(() => {
        this.$message({
          type: 'success',
          message: 'Slot successfully updated'
        });
        this.itwModalVisible = false;
      }).catch((error) => {
        this.$alert(error.message, 'Error while updating slot', {
          confirmButtonText: 'OK'
        });
      })
    },
    deleteSelectedSlot() {
      this.$confirm("Are your sure to delete this slot? ", 'Warning', { confirmButtonText: 'Yes', cancelButtonText: 'No' })
      .then(() => {
        this.$store.dispatch('REMOVE_INTERVIEW', this.$store.state.interviewsByProcessId[this.process._id][this.selectedSlotId]);
      });
    },
    clearAllSlots() {
      this.$confirm('Are you sure to remove all the slots for this day?', 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then(() => {
          this.$store.dispatch('REMOVE_INTERVIEWS_BY_DAY', { processId: this.process._id, dateStr: this.currentDayStr });
          this.$alert(error.message, 'Error while clearing all slots', {
            confirmButtonText: 'OK'
          });
        });
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
      if (!this.process) return {};
      if(!this.$store.getters.interviewsByProcessIdAndByDate[this.process._id]) return {};
      return this.$store.getters.interviewsByProcessIdAndByDate[this.process._id];
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
  background-color: firebrick;
  border-radius: 2px;
  color: white;
}

.cell-slots .itw-slot.free {
  background-color: #fb9292;
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

.slot-cell.free {
  background-color: #fb9292;
}

.slot-cell.selected {
  background-color: firebrick;
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

.begin {
	display: block;
	font-weight: bold;
	font-size: 13px;
}

.people {
	display: block;
	/* font-weight: bold; */
	/* font-size: 13px; */
}

</style>

<style>

.el-calendar-table .el-calendar-day {
  height: auto;
}
</style>
