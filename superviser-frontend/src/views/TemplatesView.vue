<template>
  <el-container direction='vertical'>
    <aap-header></aap-header>
    <el-container>
      <el-aside>
        <el-menu mode='vertical' :router='true'>
          <el-menu-item index='/administration/templates/accepted' route='/administration/templates/accepted'>Accepted</el-menu-item>
          <el-menu-item index='/administration/templates/rejected' route='/administration/templates/rejected'>Rejected</el-menu-item>
          <el-menu-item index='/administration/templates/application' route='/administration/templates/application'>Application Received</el-menu-item>
          <el-menu-item index='/administration/templates/reset_password' route='/administration/templates/reset_password'>Reset Password</el-menu-item>
          <el-menu-item index='/administration/templates/step_accepted' route='/administration/templates/step_accepted'>Stepd Accepted</el-menu-item>
          <el-menu-item index='/administration/templates/step_rejected' route='/administration/templates/step_rejected'>Step Rejected</el-menu-item>
          <el-menu-item index='/administration/templates/step_received' route='/administration/templates/step_received'>Step Received</el-menu-item>
          <el-menu-item index='/administration/templates/reset_password' route='/administration/templates/reset_password'>Reset Password</el-menu-item>
          <el-menu-item index='/administration/templates/reminder' route='/administration/templates/reminder'>Reminder</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <aap-broken v-show="broken"></aap-broken>
        <p v-if='!templateName'>
          Please select one template on the left
        </p>
        <div v-if='templateName'>
          <h1>Template {{ templateName }}</h1>
          <strong>Some advices</strong>
          <ul>
            <li>The code is written into HTML</li>
            <li>You can customize your template by using some variables, written like <code>{ { applicant.name } }</code>(no space between { )
              Examples.
              <ul>
                <li> <code> applicant.name </code></li>
                <li> <code> applicant.mailAddress </code></li>
                <li> <code> applicant.phoneNumber </code></li>
                <li> <code> applicant.status </code></li>
                <li> <code> applicant.process.label </code></li>
                <li> <code> applicant.process.deadline </code></li>
                <li> <code> step.label </code> (only when accurate)</li>
                <li> <code> password </code> (only when accurate)</li>
              </ul>
            </li>

          </ul>
          <div class='row'>
            <textarea class='code'></textarea>
            <div class='preview'></div>
          </div>
        </div>
      </el-main>
    </el-container>
    <aap-footer/>
  </el-container>
</template>

<script>

import AapHeader from '../components/Header.vue';
import AapFooter from '../components/Footer.vue';
import AapSpinner from '../components/Spinner.vue';
import AapBroken from '../components/Broken.vue';

export default {
  name: 'Templates',
  components: { AapHeader, AapFooter, AapBroken },
  data: () => ({
    loading: false,
    broken: false,
    template: { template: null, language: null, help: null}
  }),
  props: [],
  beforeMount() {
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    templateName() {
      return this.$route.params.templateName;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.code {
  padding: .375rem .75rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  flex: 1 0 400px;
}
.row {
  display: flex;
  flex-wrap: wrap;
}

.preview {
  border: 1px solid gray;
  padding: 20px;
  flex: 1 0 400px;
}

</style>
