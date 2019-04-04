<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <el-main v-if='getProcess()'>
          <ul>
            <li>Created at: {{ getProcess().createdAt }}</li>
            <li>Updated at: {{ getProcess().updatedAt }}</li>
          </ul>
          <h1> {{ getProcess().label }} </h1>
          <ul>
            <li>Location: {{ getProcess().location }}</li>
            <li>Deadline: {{ getProcess().deadline | dateFormatter}}</li>
            <li>Status: {{ getProcess().status }}</li>
          </ul>

          <el-collapse>
            <el-collapse-item v-for='(step, stepIndex) in getProcess().steps'
              :key='stepIndex'
              :title="'Step ' + stepIndex + ': ' + step.label"
              :name='stepIndex'>
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
      this.unsavedModifications = 0;
    },
    incrementModifications: function() {
      this.unsavedModifications++;
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

</style>
