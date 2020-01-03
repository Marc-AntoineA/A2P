<template>
  <div>
    <el-form>
      <el-form-item label="Label">
        <el-input v-model='page.label'
          @change='onModification'
          :disabled='!editable'/>
      </el-form-item>
      <el-form-item label="Caption">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8}"
          v-model="page.caption"
          @change='onModification'
          :disabled='!editable'>
        </el-input>
      </el-form-item>
    </el-form>
    <ol v-bind:class='["question-list", editable ? "" : "disabled"]'>
      <aap-question v-for='(question, questionIndex) in page.questions'
        :key='questionIndex'
        :question='question'
        :settings='settings'
        :validators='validators'
        :editable='editable'
        :on-modification='onModification'
        :state-key='{
          processId: stateKey.processId,
          stepIndex: stateKey.stepIndex,
          pageIndex: stateKey.pageIndex,
          questionIndex: questionIndex
          }'/>
    </ol>
    <el-button v-if='editable' class="full" type="primary" plain
      @click='addNewQuestion'>New question</el-button>
  </div>
</template>

<script>

import AapQuestion from './Question.vue';

export default {
  name: 'aap-page-process',
  components: { AapQuestion },
  props: ['page', 'settings', 'editable', 'state-key', 'on-modification', 'validators'],
  beforeMount() {
  },
  methods: {
    addNewQuestion() {
      this.$store.commit('ADD_QUESTION', this.stateKey);
      this.onModification();
    }
  }
}
</script>

<style>
.el-textarea__inner {
  font-family: inherit;
}

.question-list {
  list-style: none;
  padding-left: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

li.question-element::before {
  content: "Question " counter(step-counter) ".";
  margin-right: 5px;
  margin-left: 30px;
  font-size: 95%;
  background-color: var(--primary);
  color: white;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 5px;
}

li.question-element {
  counter-increment: step-counter;
  border: solid 1px var(--primary);
  margin: 10px 5px;
  padding: 10px;
  border-radius: 7px;
  width: 540px;
}

.full {
  width: 100%;
}
</style>
