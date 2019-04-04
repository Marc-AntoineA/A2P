<template>
  <div>
    <p>{{ page.caption }}</p>
    <ol v-bind:class='["question-list", editable ? "" : "disabled"]'>
      <aap-question v-for='(question, questionIndex) in page.questions'
        :key='questionIndex'
        :question='question'
        :settings='settings'
        :editable='editable'
        :state-key='{
          processId: stateKey.processId,
          stepIndex: stateKey.stepIndex,
          pageIndex: stateKey.pageIndex,
          questionIndex: questionIndex
          }'/>
    </ol>
  </div>
</template>

<script>

import AapQuestion from './Question.vue';

// TODO handling types in settings.json
export default {
  name: 'aap-page-process',
  components: { AapQuestion },
  props: ['page', 'settings', 'editable', 'state-key'],
  beforeMount() {
  }
}
</script>

<style>
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
