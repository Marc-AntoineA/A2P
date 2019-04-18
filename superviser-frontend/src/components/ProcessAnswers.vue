<template>
  <div>
    <el-tabs tab-position="left" stretch>
      <el-tab-pane v-for='(step, stepIndex) in process.steps' :label='step.label'>
        <h3>{{ step.label }}</h3>
        <div class='action-buttons'>
          <div :class='"status-box " + step.status'>
            <i :class='"status-icon " + getStatusSymbol(step.status)'></i>
            {{ step.status }}
          </div>
          <el-button v-if='step.status === "pending"' type='success'
            @click='acceptStep(stepIndex)'>
            Accept
          </el-button>
          <el-button v-if='step.status === "pending"' type='danger'
            @click='rejectStep(stepIndex)'>
            Reject
          </el-button>

          <div v-if='step.status === "validated"'>
            <el-input-number v-model="stepsMark[stepIndex]" :min="0" :max="10"></el-input-number>
            <el-button type='info' @click='noteStep(stepIndex)'>Change Mark</el-button>
          </div>
        </div>
            <el-table :data='questionsForStep(stepIndex)'>
              <el-table-column label='Question' prop='label'></el-table-column>
              <el-table-column label='Answer' prop='answer'>
                <template slot-scope='scope'>
                  {{ parseAnswer(scope.row) }}
                </template>
              </el-table-column>
            </el-table>
      </el-tab-pane>
    </el-tabs>
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
    stepsMark: [],
    notCollapsedQuestions: []
  }),
  beforeMount(){
    this.stepsMark = this.process.steps.map((step) => (step.mark));
    this.notCollapsedQuestions = this.process.steps.map((step, stepIndex) => {
      return this.questionsForStep(stepIndex).length < 3 ? ['1'] : [];
    });
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
      this.$store.dispatch('UPDATE_STATUS_STEP', {
        processId: this.process._id,
        applicantId: this.applicantId,
        stepIndex: stepIndex,
        status: status
      }).then(() => {
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
        processId: this.process._id,
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
    },
    getStatusSymbol(status) {
      switch (status) {
        case 'todo':
          return 'el-icon-service';
        case 'rejected':
          return 'el-icon-close';
        case 'validated':
          return 'el-icon-check'
        case 'pending':
          return 'el-icon-more';
        default:
          throw new Error(`status ${status} is undefined`);
      }
    }
  }
}
</script>

<style>

.action-buttons{
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}

.rejected {
  border-color: red;
  color: red;
}

.validated {
  border-color: green;
  color: green;
}

.status-icon.todo {

}

.pending {
  color: orange;
  border-color: orange;
}

.status-icon {
  font-size: 25px;
}

.status-box {
	display: inline-grid;
	text-align: center;
	width: 80px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
