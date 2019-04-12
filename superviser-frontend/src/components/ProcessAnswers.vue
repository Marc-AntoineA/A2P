<template>
  <div>
    <ol>
      <li v-for='(step, stepIndex) in process.steps'>
        <h3>{{ step.label }}</h3>
        <el-table :data='questionsForStep(stepIndex)'>
          <el-table-column label='Question' prop='label'></el-table-column>
          <el-table-column label='Answer' prop='answer'></el-table-column>
        </el-table>
      </li>
    </ol>
    <el-button>Accept</el-button>
    <el-button>Reject</el-button>
  </div>
</template>

<script>
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
    }
  }
}
</script>

<style>
</style>
