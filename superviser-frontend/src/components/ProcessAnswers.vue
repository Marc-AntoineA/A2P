<template>
  <div>
    <ol>
      <li v-for='(step, stepIndex) in process.steps'>
        <h3>{{ step.label }}</h3>
        <el-table :data='questionsForStep(stepIndex)'>
          <el-table-column label='Question' prop='label'></el-table-column>
          <el-table-column label='Answer' prop='answer'>
            <template slot-scope='scope'>
              {{ parseAnswer(scope.row) }}
            </template>
          </el-table-column>
        </el-table>
        <div class='action-buttons'>
          <el-button @click='acceptStep(stepIndex)'>Accept</el-button>
          <el-button @click='rejectStep(stepIndex)'>Reject</el-button>
          <el-input-number v-model="stepsMark[stepIndex]" :min="0" :max="10"></el-input-number>
          <el-button @click='noteStep(stepIndex)'>Change Mark</el-button>
        </div>
      </li>
    </ol>
    <el-button>Accept</el-button>
    <el-button>Reject</el-button>
  </div>
</template>

<script>
import { dateFormatter, phoneFormatter } from '../filters';

export default {
  name: 'aap-process-answers',
  props: ['process', 'applicantId'],
  data: () => ({
    stepsMark: []
  }),
  beforeMount(){
    this.stepsMark = this.process.steps.map((step) => (step.mark));
  },
  methods: {
    questionsForStep(stepIndex) {
      const pages = this.process.steps[stepIndex].pages;
      const reducedQuestions = [];
      pages.forEach((page) => {
        const questions = page.questions;
        questions.forEach((question) => {
          reducedQuestions.push(question);
        });
      });
      return reducedQuestions;
    },
    parseAnswer(question) {
      const type = question.type;
      const answer = question.answer;
      switch (type) {
        case 'text':
          return answer;
        case 'inline':
          return answer;
        case 'date':
          return dateFormatter(answer);
        case 'email':
          return this.renderEmail();
        case 'phone':
          return phoneFormatter(answer);
        case 'radio':
          const choices = question.choices;
          return choices[answer];
        default:
          throw new Error(`undefined display type ${type}`);
      }
    },
    changeStepStatus(stepIndex, status){
      this.$store.dispatch('UPDATE_STATUS_STEP', { applicantId: this.applicantId, stepIndex, status} )
      .then(() => {
        this.$message({
          type: 'info',
          message: 'The status has been updated'
        });
      }).catch((error) => {
        this.$alert(error.message, `Error while updating the status.`, {
          confirmButtonText: 'OK'
        });
      });
    },
    acceptStep(stepIndex) {
      this.changeStepStatus(stepIndex, 'validated');
    },
    rejectStep(stepIndex) {
      this.changeStepStatus(stepIndex, 'rejected');
    },
    noteStep(stepIndex) {
      this.$store.dispatch('UPDATE_MARK_STEP', {
        applicantId: this.applicantId,
        stepIndex: stepIndex,
        mark: this.stepsMark[stepIndex]
      }).then(() => {
        this.$message({
          type: 'info',
          message: 'The mark has been updated'
        });
      }).catch((error) => {
        this.$alert(error.message, `Error while updating the mark.`, {
          confirmButtonText: 'OK'
        });
      });
    }
  }
}
</script>

<style>
</style>
