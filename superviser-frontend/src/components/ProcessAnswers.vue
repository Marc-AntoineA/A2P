
gi<template>
  <div>
    <div class='edit-status'>
      <h3>Accept this student?</h3>
      <div :class='"status-box " + applicant.status'>
        <i :class='"status-icon " + getStatusSymbol(applicant.status)'></i>
        {{ applicant.status }}
      </div>

      <p v-if='!canBeValidated'>
        To accept one student, please validate firstly all the steps.
      </p>
      <div class='tools-buttons'>
        <el-button v-if='canBeValidated'
          type='success' @click='acceptApplicant'>
          Accept
        </el-button>
        <el-button v-if='canBeValidated'
          type='danger' @click='rejectApplicant'>
          Reject
        </el-button>
      </div>
    </div>
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
            <el-table :data='questionsForStep(stepIndex)' class='no-break'>
              <el-table-column label='Question' prop='label'></el-table-column>
              <el-table-column label='Answer'>
                <template slot-scope='scope'>
                  <pre>
                    {{ parseAnswer(scope.row) }}
                  </pre>
                  <div class='words-counter' v-if='scope.row.type==="text"'>
                    {{ nbWords(scope.row) }} words
                  </div>
                </template>
              </el-table-column>
            </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class='action-buttons'>
      <el-button
        type='danger' @click='deleteApplicant'>
        Remove this student (definititve)
      </el-button>
    </div>
  </div>
</template>

<script>
import { dateFormatter, phoneFormatter } from '../filters';

export default {
  name: 'aap-process-answers',
  props: ['applicant', 'applicantId'],
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
  computed: {
    process() {
      return this.applicant.process;
    },
    canBeValidated() {
      const steps = this.process.steps;
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];
        if (step.status !== 'validated') return false;
      }
      return true;
    }
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
    nbWords(question) {
      const type = question.type;
      if (type !== 'text') return 0
      const answer = question.answer;
      if (!answer) return 0;
      return answer.split(' ').length;
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
    deleteApplicant() {
      this.$confirm('Once an applicant is deleted, it is definitive', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('DELETE_APPLICANT_BY_ID', {
            applicantId: this.applicantId,
            processId: this.process._id
          }).then(() => {
            this.$emit('cancel');
            this.$message({
              type: 'info',
              message: 'The applicant has been deleted'
            });
          }).catch((error) => {
            this.$alert(error.message, `Error while deliting this student`, {
              confirmButtonText: 'OK'
            });
          });
        });
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
          return 'el-icon-check';
        case 'accepted':
          return 'el-icon-check'
        case 'pending':
          return 'el-icon-more';
        default:
          throw new Error(`status ${status} is undefined`);
      }
    },
    acceptApplicant() {
      this.changeApplicantStatus('accepted');
    },
    rejectApplicant() {
      this.changeApplicantStatus('rejected');
    },
    changeApplicantStatus(status) {
      this.$store.dispatch('UPDATE_STATUS_APLICANT', {
        processId: this.process._id,
        applicantId: this.applicant._id,
        status: status
      });
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

.validated, .accepted {
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

.buttons-tool .el-button {
	width: 200px;
}

.tools-buttons {
	display: flex;
	justify-content: space-around;
	margin-top: 5px;
	margin-bottom: 6px;
}

.edit-status {
  text-align: center;
}

.words-counter {
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  color: #808080;
  text-align: right;
}

.no-break .cell {
  word-break: normal;
}
</style>
