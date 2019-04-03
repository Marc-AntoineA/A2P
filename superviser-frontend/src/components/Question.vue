<template>
  <li class='question-element'>
    <div>
      <h4>
        <el-switch v-model="question.mandatory"></el-switch>
        {{ question.label }}
      </h4>
      <div class='row'>
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
          class='choice'>
          {{ choice }}
        </li>
      </ul>
    </div>
  </li>
</template>
<script>

// TODO handling types in settings.json
export default {
  name: 'aap-question',
  props: ['question', 'settings', 'editable'],
  beforeMount() {
    console.log(this.settings.types);
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
</style>
