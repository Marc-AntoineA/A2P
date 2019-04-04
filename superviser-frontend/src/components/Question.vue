<template>
  <li class='question-element'>
    <el-input class='label-input'
      v-model='question.label'
      :disabled='!editable'></el-input>
    <span class='vertical-toolbar float-right'>
        <i class='el-icon-close round-boxed big'
          @click='deleteQuestion'>
        </i>
        <i class='el-icon-arrow-up round-boxed big'
          @click='moveQuestionUp'>
        </i>
        <i class='el-icon-arrow-down round-boxed big'
          @click='moveQuestionDown'>
        </i>
    </span>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-switch v-model="question.mandatory" :disabled='!editable'></el-switch>
      </el-form-item>
      <el-form-item>
        <el-select v-model="question.type" placeholder="Type" :disabled='!editable'>
          <el-option
            v-for="option in settings.types"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="question.validator" placeholder="Validator" :disabled='!editable'>
          <el-option
            v-for="option in settings.validators"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <ul>
      <aap-choice v-for='(choice, index) in question.choices'
        :key='index'
        :choice='choice'
        :editable='editable'
        />
    </ul>
  </li>
</template>

<script>

import AapChoice from './Choice.vue';

// TODO handling types in settings.json
export default {
  name: 'aap-question',
  props: ['question', 'settings', 'editable', 'state-key'],
  components: { AapChoice },
  beforeMount() {
    console.log(this.question);
  },
  methods: {
    deleteQuestion() {
      if (!this.editable) return;
      this.$store.commit('REMOVE_QUESTION', this.stateKey);
      console.log('deleteQuestion');
    },
    moveQuestionUp() {
      if (!this.editable) return;
      this.$store.commit('MOVE_QUESTION', {identifier: this.stateKey, up: 1});
    },
    moveQuestionDown() {
      if (!this.editable) return;
      this.$store.commit('MOVE_QUESTION', {identifier: this.stateKey, up:-1});
    }

  }
}
</script>


<style>
/* TODO: understand how to use the global variable var(--color-primary); for background-color*/
li.choice {
  list-style: none;
  border: solid 1px teal;
  margin: 6px;
  display: inline-block;
  padding: 2px 11px;
  border-radius: 20px;
  background-color: #eaeaea;
}

.question-element h4 {
    display: inline-block;
    font-size: 16px;
}

.float-right {
  float: right;
}

i.big {
  font-size: 20px;
}

i.round-boxed {
  border: 1px solid transparent;
  border-radius: 100%;
  margin-bottom: 6px;
  padding: 2px;
}

i.round-boxed:hover {
  border-color: teal;
  background-color: #f8f8f8;
}

.vertical-toolbar i {
  display: block;
}

.disabled i.round-boxed {
  color: #cfd6d9;
  cursor: not-allowed;
}

.label-input {
  width: 600px;
  margin: 10px;
  font-size: larger;
  font-weight: bold;
  padding: 10px;
}
</style>
