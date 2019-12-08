<template>
  <div>
    <div class='edit-status'>
      <h3>Accept this student?</h3>
      <div :class='"status-box " + applicant.status'>
        <i :class='"status-icon " + getStatusSymbol(applicant.status)'></i>
        {{ applicant.status }}
      </div>

      <p v-if='!canBeAccepted && this.applicant.status ==="pending"'>
        To accept one student, please validate firstly all the steps.
      </p>
      <div class='tools-buttons'>
        <el-button v-if='canBeAccepted'
          type='success' @click='acceptApplicant'>
          Accept
        </el-button>
        <el-button v-if='canBeAccepted'
          type='danger' @click='rejectApplicant'>
          Reject
        </el-button>
      </div>
    </div>
    <el-tabs tab-position="left" stretch>
      <el-tab-pane v-for='(step, stepIndex) in process.steps' :label='step.label' :key='stepIndex'>
        <h3>{{ step.label }}</h3>
        <div class='action-buttons'>
          <div :class='"status-box " + step.status'>
            <i :class='"status-icon " + getStatusSymbol(step.status)'></i>
            {{ step.status }}
          </div>

        <div v-if='step.status === "validated"'>
            <el-input-number v-model="stepsMark[stepIndex]" :min="0" :max="10"></el-input-number>
            <el-button type='info' @click='noteStep(stepIndex)'>Change Mark</el-button>
          </div>

        </div>
        <div v-if='step.status === "pending"' class='feedback-box' :class='stepsResponsesTemplates[stepIndex].accepting ? "accepted-box" : "rejected-box"'>
          <h4>Your feedback</h4>
          <div class='row'>
            <textarea class='code' v-model="stepsResponsesTemplates[stepIndex].template.template"></textarea>
            <div class='preview' v-html='renderStepsResponsesTemplates[stepIndex]'></div>
          </div>
          <div class='feedback-tools'>
            <el-switch
              style="display: block"
              v-model="stepsResponsesTemplates[stepIndex].accepting"
              active-color="#67c23a"
              inactive-color="#f56c6c"
              active-text="Accept"
              inactive-text="Reject"
              @change='switchTemplate(stepIndex)'>
            </el-switch>
            <el-button :type='stepsResponsesTemplates[stepIndex].accepting ? "success" : "danger"' @click='sendResponse(stepIndex)'>
              {{ stepsResponsesTemplates[stepIndex].accepting ? 'Send Acceptation' : 'Send Rejection' }}
            </el-button>
          </div>
        </div>
            <el-table :data='questionsForStep(stepIndex)' class='no-break'>
              <el-table-column label='Question' prop='label'></el-table-column>
              <el-table-column label='Answer'>
                <template slot-scope='scope'>
                  <div class='answer-box'>{{ parseAnswer(scope.row) }}</div>
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
      type='warning' @click='archiveApplicant'>
        {{ applicant.archived ? 'Unarchive' : 'Archive' }}
      </el-button>
      <el-button
        type='danger' @click='deleteApplicant'>
        Remove this student (definititve)
      </el-button>
    </div>
  </div>
</template>

<script>
import { dateFormatter, phoneFormatter } from '../filters';
import Mustache from 'mustache';


export default {
  name: 'aap-process-answers',
  props: ['applicant', 'applicantId'],
  data: () => ({
    stepsMark: [],
    notCollapsedQuestions: [],
    stepsResponsesTemplates: []
  }),
  beforeMount(){
    this.stepsMark = this.process.steps.map((step) => (step.mark));
    this.stepsResponsesTemplates = this.process.steps.map((step) =>  (
      {
        accepting: undefined,
        template:{ template: '', language: '', help: '', subject: ''}
      }));
    this.$store.dispatch('GET_EMAIL_TEMPLATE', 'step_accepted').then((defaultTemplate) => {
      this.stepsResponsesTemplates = this.process.steps.map((step) => {
        if (step.status !== 'pending') {
          return { accepting: undefined, template: {  template: '', language: '', help: '', subject: '' }};
        }
        return { accepting: true, template: defaultTemplate };
      });
    }).catch((error) => {
      broken = true;
      this.$alert(error.message, `Error while downloading the email template`, {
        confirmButtonText: 'OK'
      });
    });

    this.notCollapsedQuestions = this.process.steps.map((step, stepIndex) => {
      return this.questionsForStep(stepIndex).length < 3 ? ['1'] : [];
    });
  },
  computed: {
    process() {
      return this.applicant.process;
    },
    canBeAccepted() {
      if (this.applicant.status !== 'pending') return false;
      const steps = this.process.steps;
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];
        if (step.status !== 'validated') return false;
      }
      return true;
    },
    renderStepsResponsesTemplates() {
      const output = this.stepsResponsesTemplates.map((template, index) => {
        return Mustache.render(template.template.template, { applicant: this.applicant, step: this.applicant.process.steps[index] });
      });
      return output;
    },
    renderStepsResponsesSubjects() {
      const output = this.stepsResponsesTemplates.map((template, index) => {
        return Mustache.render(template.template.subject, { applicant: this.applicant, step: this.applicant.process.steps[index] });
      });
      return output;
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
          return question.choices[answer];
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
    sendResponse(stepIndex){
      const status = this.stepsResponsesTemplates[stepIndex].accepting ? 'validated' : 'rejected';
      const template = this.stepsResponsesTemplates[stepIndex].template;

      this.$confirm(`Are you sure to <strong>${status === 'validated' ? 'accept' : 'reject'}</strong>
       this applicant with this email? <br/>
       <div class='email'> <div class='subject'>${this.renderStepsResponsesSubjects[stepIndex]}</div>
       ${this.renderStepsResponsesTemplates[stepIndex]}</div>`, 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          dangerouslyUseHTMLString: true,
          customClass: 'email-confirmation-box'
        }).then(() => {
          this.$store.dispatch('UPDATE_STATUS_STEP', {
            processId: this.process._id,
            applicantId: this.applicantId,
            stepIndex: stepIndex,
            status: status,
            template: template,
          }).then(() => {
            this.$message({
              type: 'info',
              message: 'The status has been updated and the email has been sent'
            });
          }).catch((error) => {
            this.$alert(error.message, `Error while updating the status.`, {
              confirmButtonText: 'OK'
            });
        });
      });
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
            this.$alert(error.message, `Error while deleting this student`, {
              confirmButtonText: 'OK'
            });
          });
        });
    },
    archiveApplicant() {
      this.$store.dispatch('SWITCH_ARCHIVE_APPLICANT_BY_ID', { applicantId: this.applicantId, processId: this.process._id }).then(() => {
        this.$message({
          type: 'info',
          message: 'The applicant has been ' + (this.applicant.archived ? 'archived' : 'unarchived')
        });
      }).catch((error) => {
        this.$alert(error.message, `Error while archiving/unarchiving this student`, { confirmButtonText: 'OK' });
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
      this.$confirm(`Are you sure to <strong>${status === 'accepted' ? 'accept' : 'reject'}</strong>
       this applicant? He will get an email`, 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          dangerouslyUseHTMLString: true,
          customClass: 'email-confirmation-box'
        }).then(() => {
          this.$store.dispatch('UPDATE_STATUS_APLICANT', {
            processId: this.process._id,
            applicantId: this.applicant._id,
            status: status
          }).then(() => {
            this.$message({
              type: 'info',
              message: 'The status has been updated and the email has been sent'
            });
          }).catch((error) => {
            this.$alert(error.message, `Error while updating the status.`, {
              confirmButtonText: 'OK'
            });
        });
      });
    },
    switchTemplate(stepIndex) {
      const accepting = this.stepsResponsesTemplates[stepIndex].accepting;
      this.$store.dispatch('GET_EMAIL_TEMPLATE', accepting ? 'step_accepted' : 'step_rejected').then((template) => {
        this.stepsResponsesTemplates[stepIndex].template = template;
      }).catch((error) => {
        this.stepsResponsesTemplates[stepIndex].accepting = !accepting;
        this.$alert(error.message, 'Error while downloading processes', {
          confirmButtonText: 'OK'
        });
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

.answer-box {
  white-space: pre-wrap;
}

.feedback-box textarea {
  padding: .375rem .75rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.feedback-box .row {
  display: flex;
  flex-wrap: wrap;
}

.feedback-box .preview {
  border: 1px solid black;
  padding: 20px;
  flex: 1 0 400px;
}

.feedback-box .code {
  flex: 1 0 400px;
}

.feedback-box.accepted-box {
  border-color: green;
  box-shadow: 4px 2px 3px #67c23a;
}

.feedback-box.rejected-box {
  border-color: firebrick;
  box-shadow: 4px 2px 3px #f56c6c;
}

.feedback-box {
  margin: 10px;
  border-radius: 3px;
  border: 2px solid black;
  padding: 10px;
}

.feedback-tools {
  display: inline-flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.el-message-box.email-confirmation-box {
	width: 600px;
}

.email-confirmation-box .email {
	border: 1px solid gray;
	padding: 5px;
	background-color: #fbfbfb;
	font-style: italic;
}

.email-confirmation-box .email .subject {
  font-style: normal;
  font-weight: bold;
}
</style>
