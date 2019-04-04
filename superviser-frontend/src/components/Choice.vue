<template>
    <li class='choice'>
      {{ choice }}
      <i class='el-icon-close round-boxed small'
        @click='deleteChoice'>
      </i>
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
    deleteChoice() {
      this.$store.commit('REMOVE_CHOICE', this.stateKey)
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

i.small {
  margin: 0px;
}
</style>
