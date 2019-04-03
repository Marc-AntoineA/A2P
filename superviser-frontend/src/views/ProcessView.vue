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
              :title="'Step ' + stepIndex + ': ' + step.label" name="1">
              <h3>Questions</h3>
              <el-tabs type="border-card">
                <el-tab-pane v-for='(page, pageIndex) in step.pages'
                  :label="page.label">
                  <p>{{ page.caption }}</p>
                  <ol class='question-list'>
                    <aap-question v-for='(question, questionIndex) in page.questions'
                      :question='question'
                      :settings='settings'
                      :editable='true'/>
                  </ol>
                </el-tab-pane>
              </el-tabs>
              <h3>Email answers</h3>
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer></aap-footer>
  </el-container>
</template>

<script>
import AapFooter from '../components/Footer.vue';
import AapSpinner from '../components/Spinner.vue';
import AapHeader from '../components/Header.vue';
import AapQuestion from '../components/Question.vue';

const settings = require('../settings.json');

export default {
  name: 'Process',
  props: {},
  components: { AapSpinner, AapFooter, AapHeader, AapQuestion },
  data: () => ({
    loading: true,
    settings: { types: settings.QUESTION_TYPES, validators: settings.QUESTION_VALIDATORS }
  }),
  methods: {
    getProcess: function(){
      const processId = this.$route.params.processId;
      const process = this.$store.state.processes[processId];
      return process;
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.question-list {
  list-style: none;
}

li.question-element::before {
  content: "Question " counter(step-counter) ".";
  margin-right: 5px;
  font-size: 95%;
  background-color: teal;
  color: white;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 5px;
}

li.question-element {
  counter-increment: step-counter;
  border: solid 1px teal;
  margin: 10px 5px;
  padding: 10px;
  border-radius: 7px;
}
</style>
