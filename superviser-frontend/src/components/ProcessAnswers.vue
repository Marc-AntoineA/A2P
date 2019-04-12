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
  props: ['process'],
  methods: {
    questionsForStep(stepIndex) {
      console.log(this.process, stepIndex);
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
    }
  }
}
</script>

<style>
</style>
