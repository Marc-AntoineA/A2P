<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <el-main v-if='getProcess()'>
          <ul class='inline-list small'>
            <li>Created at: {{ getProcess().createdAt | dateFormatter }}</li>
            <li>Updated at: {{ getProcess().updatedAt | dateFormatter }}</li>
          </ul>
          <h1> {{ getProcess().label }} </h1>
          <ul class='inline-list'>
            <li>Location: {{ getProcess().location }}</li>
            <li>Deadline: {{ getProcess().deadline | dateFormatter}}</li>
            <li><span :class='getProcess().status'>&#11044;</span> Status: {{ getProcess().status }}</li>
          </ul>

          <el-button
            @click='addNewStep'>
            Create new step
          </el-button>

          <el-collapse>
            <el-collapse-item v-for='(step, stepIndex) in getProcess().steps'
              :key='stepIndex' :name='stepIndex'>
              <template slot="title">
                <span class='horizontal-toolbar'>
                  <i class='el-icon-close round-boxed big'
                    @click.stop='deleteStep(stepIndex)'>
                  </i>
                  <i class='el-icon-arrow-up round-boxed big'
                    @click.stop='moveStepUp(stepIndex)'>
                  </i>
                  <i class='el-icon-arrow-down round-boxed big'
                    @click.stop='moveStepDown(stepIndex)'>
                  </i>
                </span>
                <span class='step-label'>
                  <span class='step-prefix'>Step {{ stepIndex}}:</span>
                  <el-input v-model='step.label'/>
                </span>
              </template>
              <h3>Questions</h3>
              <el-tabs type="border-card">
                <el-tab-pane v-for='(page, pageIndex) in step.pages'
                  :key='pageIndex' :label='page.label'>
                  <aap-page-process
                    :page='page'
                    :editable='true'
                    :settings='settings'
                    :on-modification='incrementModifications'
                    :stateKey='{ processId: getProcess()._id, stepIndex: stepIndex, pageIndex: pageIndex }'/>
                </el-tab-pane>
              </el-tabs>
              <h3>Email answers</h3>
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
    settings: { types: settings.QUESTION_TYPES, validators: settings.QUESTION_VALIDATORS },
    unsavedModifications: 0
  }),
  methods: {
    getProcess: function(){
      const processId = this.$route.params.processId;
      const process = this.$store.state.processes[processId];
      return process;
    },
    saveProcess: function() {
      const processId = this.getProcess()._id;
      this.$store.dispatch('PUT_PROCESS', processId)
        .then(() => {
          this.$message({
            type: 'info',
            message: 'Your modifications have been saved'
          });
          this.unsavedModifications = 0;
        }).catch((error) => {
          this.$alert(error.message, `Error while saving process ${processId}.`, {
            confirmButtonText: 'OK'
          });
        });
    },
    incrementModifications: function() {
      this.unsavedModifications++;
    },
    moveStepDown(stepIndex) {
      console.log("TODO move down step");
    },
    moveStepUp(stepIndex) {
      console.log("TODO move step");
    },
    deleteStep(stepIndex) {
      console.log(stepIndex);
      this.$store.commit('REMOVE_STEP', {
        processId: this.getProcess()._id,
        stepIndex: stepIndex
      });
      this.incrementModifications();
    },
    addNewStep() {
      this.$store.commit('ADD_STEP', { processId: this.getProcess()._id });
      this.incrementModifications();
    }
  },
  beforeMount() {
    const processId = this.$route.params.processId;
    this.loading = true;
    this.$store.dispatch('FETCH_PROCESS', processId).then(() => {
      this.loading = false;
    }).catch((error) => {
      this.loading = false;
      this.$alert(error.message, `Error while downloading process ${processId}`, {
        confirmButtonText: 'OK'
      });
      this.$router.push('/404-error');
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
<style scoped>
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

.draft {
  color: gray;
}

.running {
  color: orange;
}

.finished {
  color: red;
}

.inline-list.small {
  font-size: 12px;
  color: gray;
}

.horizontal-toolbar {
  margin-right: 20px;
}

.step-label {
  font-size: 17px;
}
</style>
