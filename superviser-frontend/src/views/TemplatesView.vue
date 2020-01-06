<template>
  <el-container direction='vertical'>
    <aap-header></aap-header>
    <el-container>
      <el-aside>
        <el-menu mode='vertical' class='main-view' :router='true'>
          <el-menu-item :index='{ name: "template", params: { templateName: "accepted"}}'>Accepted</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "rejected"}}'>Rejected</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "application"}}'>Application Received</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "reset_password"}}'>Reset Password</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "step_accepted"}}'>Step Accepted</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "step_rejected"}}'>Step Rejected</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "step_automated_rejected"}}'>Step Rejected Automatically</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "step_received"}}'>Step Received</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "reset_password"}}'>Reset Password</el-menu-item>
          <el-menu-item :index='{ name: "template", params: { templateName: "reminder"}}'>Reminder</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class='main-view'>
        <aap-broken v-show="broken"></aap-broken>
        <p v-if='!templateName'>
          Please select one template on the left
        </p>

        <aap-spinner :show="loading"></aap-spinner>

        <div v-if='!loading && !broken && templateName'>
          <h1>Template {{ templateName }}</h1>
          <strong>Some advices</strong>


          <el-collapse>
            <el-collapse-item title="Write template in HTML" name="1">
              <div>
                Basic HTML tags are <code>&lt;p&gt;&lt;/p&gt;</code> to write a paragraph, <code>&lt;br/&gt;</code> to start a new line,
                <code>&lt;strong&gt;&lt;/strong&gt;</code> to make it bolder, <code>&lt;emph&gt;&lt;/emph&gt;</code> to make it in italic,
                <code>&lt;a href='google.com' target='_blank'&gt;My link&lt;/a&gt;</code> to create a link
                 or <code>&lt;img src='link to an image'/&gt;</code> to insert an image.
              </div>
            </el-collapse-item>
            <el-collapse-item title="Customize the templates" name="2">
              You can customize your template by using some variables, written like <code>{{ "{{" }} applicant.name</code><code> {{ "}" + "}" }}</code>
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
            </el-collapse-item>
          </el-collapse>
          <div class='template-editor'>
            <div class='row'>
              <el-input v-model="template.subject"></el-input>
            </div>
            <div class='row'>
              <textarea class='code' v-model='template.template'></textarea>
              <div class='preview' v-html='template.template'></div>
            </div>
          </div>
          <el-button type="success" @click='save' round>Save the template</el-button>
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
  components: { AapHeader, AapFooter, AapBroken, AapSpinner },
  data: () => ({
    loading: false,
    broken: false,
    template: { template: null, subject: null, language: null, help: null}
  }),
  props: [],
  beforeMount() {
    if (this.templateName) this.load(this.templateName);
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.templateName) this.load(to.params.templateName);
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.templateName) vm.load(to.params.templateName);
    });
  },
  mounted() {
  },
  methods: {
    load(templateId) {
      this.loading = true;
      this.$store.dispatch('GET_EMAIL_TEMPLATE', templateId)
      .then((template) => {
        this.loading = false;
        this.template = template;
      }).catch((error) => {
        this.loading = false;
        this.broken = true;
        this.$alert(error.message, `Error while downloading the template ${templateId}`, {
          confirmButtonText: 'OK'
        });
      });
    },
    save() {
      this.$confirm('Are you sure to save this template?', 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('SAVE_EMAIL_TEMPLATE', { templateId: this.templateName, template: this.template })
          .then(() => {
            this.$message({
              type: 'info',
              message: 'The template has been saved'
            });
          }).catch((error) => {
            this.$alert(error.message, `Error while saving the template ${this.templateName}`, {
              confirmButtonText: 'OK'
            });
          });
        });
    }
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
  margin-bottom: 15px;
}

.preview {
  padding: 20px;
  flex: 1 0 400px;
  text-align: left;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
}

</style>
