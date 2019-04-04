<template>
  <li class='question-element'>
    <h4>{{ question.label }}</h4>
    <span class='vertical-toolbar float-right'>
        <i class='el-icon-close round-boxed big'></i>
        <i class='el-icon-arrow-up round-boxed big'></i>
        <i class='el-icon-arrow-down round-boxed big'></i>
    </span>
    <div class='row'>
        <el-switch v-model="question.mandatory"></el-switch>

        <el-select v-model="question.type" placeholder="Type" :disabled='!editable'>
          <el-option
            v-for="option in settings.types"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>

        <el-select v-model="question.validator" placeholder="Validator">
          <el-option
            v-for="option in settings.validators"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </div>
      <ul>
        <li v-for='(choice, index) in question.choices'
          :key='index'
          class='choice'>
          {{ choice }}
        </li>
      </ul>
  </li>
</template>
<script>

// TODO handling types in settings.json
export default {
  name: 'aap-question',
  props: ['question', 'settings', 'editable'],
  beforeMount() {
    //console.log(this.settings.types);
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
</style>
