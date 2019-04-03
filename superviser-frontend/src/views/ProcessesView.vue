<template>
  <el-container direction='vertical'>
    <el-container direction='vertical'>
      <aap-header></aap-header>
      <el-container>
        <el-main>
          <h2>List of all processes</h2>
          <aap-spinner :show="loading"></aap-spinner>
          <aap-broken v-show="broken"></aap-broken>

          <div v-if='!loading && !broken' class='toolbar'>
            <el-button @click='createProcess'>
              Create new process
            </el-button>
          </div>

          <el-table v-if='!loading && !broken' :data='processes'>
            <el-table-column label='Label' prop='label'></el-table-column>
            <el-table-column label='Location' prop='location'></el-table-column>
            <el-table-column label='Status'>
              <template slot-scope='scope'>
                TODO
              </template>
            </el-table-column>
            <el-table-column label='Deadline'>
              <template slot-scope='scope'>
                <i class='el-icon-time'></i>
                <span style='margin-left: 10px'>{{ scope.row.deadline | dateFormatter }}</span>
              </template>
            </el-table-column>
            <el-table-column label='Number of applications'>
              <template slot-scope='scope'>
                TODO
              </template>
            </el-table-column>
            <el-table-column label='Created At'>
              <template slot-scope='scope'>
                <i class='el-icon-time'></i>
                <span style='margin-left: 10px'>{{ scope.row.createdAt | dateFormatter }}</span>
              </template>
            </el-table-column>
            <el-table-column label='Updated At'>
              <template slot-scope='scope'>
                <i class='el-icon-time'></i>
                <span style='margin-left: 10px'>{{ scope.row.updatedAt | dateFormatter }}</span>
              </template>
            </el-table-column>
            <el-table-column label='Operations'>
              <template slot-scope='scope'>
                <router-link :to='{name: "process", params: {processId: scope.row._id} }'>
                  <i class='el-icon-search'></i><!-- TODO go to view process page -->
                </router-link>
                <i class='el-icon-edit'></i><!-- TODO go to edit process page -->
                <i class='el-icon-delete' @click='deleteProcess(scope.row._id)'></i><!-- TODO go to edit process page with delete link -->
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer></aap-footer>
  </el-container>
</template>

<script>
import AapSpinner from '../components/Spinner.vue';
import AapHeader from '../components/Header.vue';
import AapFooter from '../components/Footer.vue';
import AapAsideMenu from '../components/AsideMenu.vue';
import AapBroken from '../components/Broken.vue';

export default {
  name: 'Processes',
  components: { AapSpinner, AapHeader, AapFooter, AapAsideMenu, AapBroken },
  props: {},
  data: () => ({
    loading: true,
    broken: true
  }),
  computed: {
    processes() { return Object.values(this.$store.state.processes); }
  },
  beforeMount() { console.log("beforMount");this.fetchProcesses() },
  methods: {
    deleteProcess(processId) {
      this.$confirm('This will permanently delete the process. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('DELETE_PROCESS', processId).then(() => {
            this.$message({
              type: 'success',
              message: 'Delete completed'
            });
          }).catch((error) => {
            this.$alert(error.message, 'Error while deleted process', {
              confirmButtonText: 'OK'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });
        });
    },
    fetchProcesses() {
      this.loading = true;
      this.broken = false;
      this.$store.dispatch('FETCH_PROCESSES').then(() => {
        this.loading = false;
      }).catch((error) => {
        this.broken = true;
        this.loading = false;
        this.$alert(error.message, 'Error while downloading processes', {
          confirmButtonText: 'OK'
        });
      });
    },
    createProcess() {
      this.$store.dispatch('CREATE_PROCESS')
        .then((process) => {
          const processId = process._id;
          this.$router.push('/process/' + processId);
        })
        .catch((error) => {
          this.$alert(error.message, 'Error while creating a new process', {
            confirmButtonText: 'OK'
          });
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
