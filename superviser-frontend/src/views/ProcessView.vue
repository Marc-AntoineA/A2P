<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <aap-spinner :show="loading"></aap-spinner>
        <el-main v-if='process'>
          <ul class='inline-list small'>
            <li>Created at: {{ process.createdAt | dateFormatter }}</li>
            <li>Updated at: {{ process.updatedAt | dateFormatter }}</li>
          </ul>

          <el-input v-model='process.label' class='process-label'
            @change='incrementModifications()'>
             {{ process.label }}
          </el-input>

          <el-form :inline="true" class="option-form">
            <el-form-item label="Location:">
              <el-input v-model='process.location'
                @change='incrementModifications()'/>
            </el-form-item>

            <el-form-item label='Deadline'>
              <el-date-picker
                v-model='process.deadline'
                type="datetime"
                placeholder="Select date and time"
                default-time="23:00:00"
                @change='incrementModifications()'/>
            </el-form-item>

            <el-form-item label='Status'>
              <span :class='$store.getters.processesStatus[process._id]'>&#11044;</span>
              {{ $store.getters.processesStatus[process._id] }}
              <el-button v-if='$store.getters.processesStatus[process._id] === "draft"'
                @click='openProcess'>Open
              </el-button>
            </el-form-item>
          </el-form>

          <el-button v-if='editable' class='top-button' @click='addNewStep'>
            Create new step
          </el-button>

          <el-collapse>
            <el-collapse-item v-for='(step, stepIndex) in process.steps'
              :key='stepIndex' :name='stepIndex'>
              <template slot="title">
                <span v-if='editable' class='horizontal-toolbar'>
                  <i class="el-icon-close round-boxed big"
                    @click.stop='deleteStep(stepIndex)'>
                  </i>
                  <i class="el-icon-arrow-up round-boxed big"
                    @click.stop='moveStepUp(stepIndex)'>
                  </i>
                  <i class="el-icon-arrow-down round-boxed big"
                    @click.stop='moveStepDown(stepIndex)'>
                  </i>
                </span>
                <span class='step-label' @click.stop=''>
                  <span class='prefix'>Step {{ stepIndex }}</span>
                  <el-input v-model='step.label'
                    @change='incrementModifications'
                    :disabled='!editable'>
                  </el-input>
                </span>
              </template>

              <div class='process-box'>
                <h3>Pages</h3>
                <el-button v-if='editable' class='top-button' @click='addNewPage(stepIndex)'>
                  Add page
                </el-button>
                <el-tabs type="border-card">
                  <el-tab-pane v-for='(page, pageIndex) in step.pages'
                    :key='pageIndex'>
                    <span slot="label">
                      <span class='page-number'>Page {{ pageIndex}}</span> {{ page.label }}
                      <span v-if='editable' class='tab-toolbar'>
                        <i class='el-icon-arrow-left round-boxed big'
                          @click='movePageLeft(stepIndex, pageIndex)'>
                        </i>
                        <i class='el-icon-arrow-right round-boxed big'
                          @click='movePageRight(stepIndex, pageIndex)'>
                        </i>
                        <i class='el-icon-close round-boxed big'
                          @click='deletePage(stepIndex, pageIndex)'>
                        </i>
                      </span>
                    </span>
                    <aap-page-process
                      :page='page'
                      :editable='editable'
                      :settings='settings'
                      :validators='$store.state.validators'
                      :on-modification='incrementModifications'
                      :stateKey='pageIdentifier(stepIndex, pageIndex)'/>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer/>
    <div class='save-bar' v-if='this.unsavedModifications > 0'>
      <el-badge :value='this.unsavedModifications' class='item big'>
        <el-button type='success' round
          @click='saveProcess'>Save</el-button>
      </el-badge>
    </div>
  </el-container>
</template>

<script>
import AapFooter from '../components/Footer.vue';
import AapSpinner from '../components/Spinner.vue';
import AapHeader from '../components/Header.vue';
import AapPageProcess from '../components/PageProcess.vue';

const settings = require('../settings.json');

export default {
  name: 'Process',
  props: {},
  components: { AapSpinner, AapFooter, AapHeader, AapPageProcess },
  data: () => ({
    loading: true,
    settings: { types: settings.QUESTION_TYPES },
    unsavedModifications: 0,
    editable: false,
    deadlineEditable: false
  }),
  computed: {
    process: function() {
      const processId = this.$route.params.processId;
      const process = this.$store.state.processes[processId];
      return process;
    }
  },
  methods: {
    saveProcess: function() {
      const processId = this.process._id;
        return new Promise((resolve, reject) => {
        this.$store.dispatch('PUT_PROCESS', processId)
          .then(() => {
            this.$message({
              type: 'info',
              message: 'Your modifications have been saved'
            });
            this.unsavedModifications = 0;
            resolve();
          }).catch((error) => {
            this.$alert(error.message, `Error while saving process ${processId}.`, {
              confirmButtonText: 'OK'
            });
            reject();
          });
        });
    },
    incrementModifications: function() {
      this.unsavedModifications++;
    },
    stepIdentifier(stepIndex) {
      return {
        processId: this.process._id,
        stepIndex: stepIndex
      };
    },
    pageIdentifier(stepIndex, pageIndex) {
      return {
        processId: this.process._id,
        stepIndex: stepIndex,
        pageIndex: pageIndex
      };
    },// TODO don't count modification if impossible move
    moveStepDown(stepIndex) {
      if (!this.editable) return;
      const identifier = this.stepIdentifier(stepIndex);
      this.$store.commit('MOVE_STEP', { identifier, up: -1 });
      this.incrementModifications();
    },
    moveStepUp(stepIndex) {
      if (!this.editable) return;
      if (stepIndex === 0) return;
      const identifier = this.stepIdentifier(stepIndex);
      this.$store.commit('MOVE_STEP', { identifier, up: +1 });
      this.incrementModifications();
    },
    deleteStep(stepIndex) {
      if (!this.editable) return;
      this.$store.commit('REMOVE_STEP', this.stepIdentifier(stepIndex));
      this.incrementModifications();
    },
    addNewStep() {
      if (!this.editable) return;
      this.$store.commit('ADD_STEP', this.stepIdentifier(undefined));
      this.incrementModifications();
    },
    addNewPage(stepIndex) {
      if (!this.editable) return;
      this.$store.commit('ADD_PAGE', this.stepIdentifier(stepIndex));
      this.incrementModifications();
    },
    deletePage(stepIndex, pageIndex) {
      if (!this.editable) return;
      const identifier = this.pageIdentifier(stepIndex, pageIndex);
      this.$store.commit('REMOVE_PAGE', identifier);
    },
    movePageRight(stepIndex, pageIndex) {
      if (!this.editable) return;
      const identifier = this.pageIdentifier(stepIndex, pageIndex);
      this.$store.commit('MOVE_PAGE', { identifier, up: -1 });
    },
    movePageLeft(stepIndex, pageIndex) {
      if (!this.editable) return;
      const identifier = this.pageIdentifier(stepIndex, pageIndex);
      this.$store.commit('MOVE_PAGE', { identifier, up: +1 });
    },
    openProcess() {
      this.$confirm('No modifications are possible on a opened process.\
       Are you sure to open it now?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.saveProcess().then(() => {
            this.$store.dispatch('OPEN_PROCESS', this.process._id)
              .then(() => {
                this.$message({
                  type: 'info',
                  message: 'The process is now in status: "open"'
                });
                this.editable = false;
              })
              .catch((error) => {
                this.$alert(error.message, 'Error while opening the current process', {
                  confirmButtonText: 'OK'
                });
              });
          }).catch((error) => {
          });
        }).catch(() => {

        });
    },
  },
  beforeMount() {
    const processId = this.$route.params.processId;
    this.loading = true;
    this.$store.dispatch('FETCH_PROCESS', processId).then((process)=> {
      this.$store.dispatch('GET_ALL_VALIDATORS').then(() => {
        this.loading = false;
        this.editable = (process.status === 'draft');
      }).catch((error) => {
        this.loading = false;
        alert(error);
        // this.$alert(error.message, `Error while downloading validators`, {
        //   confirmButtonText: 'OK'
        // });
      });
    }).catch((error) => {
      this.loading = false;
      this.$alert(error.message, `Error while downloading process ${processId}`, {
        confirmButtonText: 'OK'
      });
      this.$router.push({ name: 'error404'});
    });
  },
  beforeDestroy() {
    if (this.unsavedModifications === 0) return;
    this.$alert(`You lost ${this.unsavedModifications} unsaved modifications`, 'Warning', {
      confirmButtonText: 'Ok',
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.save-bar {
  position: fixed;
  height: 50px;
  width: 100%;
  bottom: 0;
  z-index: 999;
  background-color: #dedede;
  margin: 0;
  left: 0;
  border-top: 1px solid teal;
  padding: 12px;
}

.el-badge.big {
  width: 300px;
}

.el-badge.big button {
  width: 100%;
}

.inline-list {
  display: flex;
  justify-content: space-around;
}

.inline-list li {
   list-style: none;
}

.inline-list.small {
  font-size: 12px;
  color: gray;
}

.horizontal-toolbar {
  margin-right: 20px;
}

.step-label {
  display: flex;
}

.step-label .prefix {
  margin-right: 14px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 11px;
  color: gray;
}

.step-label .el-input {
  width: 400px;
}

.tab-toolbar {
  margin-right: -15px;
  margin-left: 12px;
}

.option-form {
  display: flex;
  justify-content: space-around;
}

.process-label {
  width: 300px;
  font-size: 20px;
  margin-bottom: 20px;
}

.process-label input {
	font-weight: bold!important;
	color: #2c3e50!important;
	text-align: center!important;
}

.top-button {
  margin-bottom: 20px;
}

.el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
  background-color: inherit;
  border-color: white;
  color: #2C3E50;
  cursor: not-allowed;
}

.page-number {
	font-size: 9px;
	text-transform: uppercase;
	background-color: teal;
	color: white;
	padding: 3px 4px;
	margin-right: 4px;
	border-radius: 14px;
}
</style>
