<template>
  <li>
    <div>
      <p>Checkbox here</p>
      <h4>
        <el-switch v-model="question.mandatory"></el-switch>
        {{ question.label }}</h4>
      <div class='row'>
        <p>TODO validation{{ question.validation }}</p>
        <p>{{ question.type }}</p>
      </div>
      <ul>
        <li v-for='(choice, index) in question.choices'></li>
      </ul>
    </div>
  </li>
</template>
<script>

export default {
  name: 'aap-question',
  props: ['question'],
  methods: {}
}
</script>

<style style-scoped>

</style>
