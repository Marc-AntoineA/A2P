<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <el-main>
          <h2> Process view for id: {{ $route.params.processId }} </h2>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer></aap-footer>
  </el-container>
</template>

<script>
import AapFooter from '../components/Footer.vue';
import AapSpinner from '../components/Spinner.vue';
import AapHeader from '../components/Header.vue';

// TODO. bug - if going to process without /processes, they are not fetched?
export default {
  name: 'Process',
  props: {},
  components: { AapSpinner, AapFooter, AapHeader },
  beforeMount() {
    const processId = this.$route.params.processId;
    const process = this.$store.state.processes[processId];
    if (!process) this.$router.push('/404-error');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
