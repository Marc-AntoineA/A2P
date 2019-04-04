<template>
    <li class='choice'>
      {{ choice }}
    </li>
</template>

<script>
export default {
  name: 'aap-choice',
  props: ['choice', 'editable', 'state-key'],
  beforeMount() {
    console.log(this.question);
  },
  methods: {
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
