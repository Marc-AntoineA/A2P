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
            <el-table-column label='Label' prop='label' sortable></el-table-column>
            <el-table-column label='Location' prop='location' sortable>
              <template slot-scope='scope'>
                <i class='el-icon-location big'></i>
                {{ scope.row.location }}
              </template>
            </el-table-column>
            <el-table-column label='Status' prop='status' sortable align='center'>
              <template slot-scope='scope'>
                <span :class='scope.row.status'>&#11044;</span>
                {{ scope.row.status }}
              </template>
            </el-table-column>
            <el-table-column label='Deadline' sortable>
              <template slot-scope='scope'>
                <i class='el-icon-time'></i>
                <span style='margin-left: 10px'>{{ scope.row.deadline | dateFormatter }}</span>
              </template>
            </el-table-column>
            <el-table-column label='Applications' align='center'>
              <template slot-scope='scope'>
                <router-link v-if='scope.row.status === "open"'
                   :to='{name: "applicantsInitialProcessId", params: {processId: scope.row._id} }'>
                   <el-tooltip class="item" effect="dark" content="See applicants" placement="bottom">
                     <i class='el-icon-tickets big round-boxed'/>
                   </el-tooltip>
                </router-link>
                <el-tooltip v-if='scope.row.status === "open"' class="item" effect="dark" content="Download applicants" placement="bottom">
                  <i class='el-icon-download big round-boxed' @click='downloadApplicants(scope.row._id)'/>
                </el-tooltip>
                <span v-if='scope.row.status === "draft"'>
                  Draft process
                </span>
              </template>
            </el-table-column>
            <el-table-column label='Created At' prop='createdAt' sortable>
              <template slot-scope='scope'>
                <i class='el-icon-time'></i>
                <span style='margin-left: 10px'>{{ scope.row.createdAt | dateFormatter }}</span>
              </template>
            </el-table-column>
            <el-table-column label='Updated At' prop='updatedAt' sortable>
              <template slot-scope='scope'>
                <i class='el-icon-time'></i>
                <span style='margin-left: 10px'>{{ scope.row.updatedAt | dateFormatter }}</span>
              </template>
            </el-table-column>
            <el-table-column label='Operations' align='center'>
              <template slot-scope='scope'>
                {{ scope.status }}
                <router-link :to='{name: "process", params: {processId: scope.row._id} }'>
                  <el-tooltip class="item" effect="dark" content="Edit this process" placement="bottom">
                    <i v-if='scope.row.status === "draft"' class='el-icon-edit round-boxed big'></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="See this process" placement="bottom">
                    <i v-if='scope.row.status !== "draft"' class='el-icon-search round-boxed big'></i>
                  </el-tooltip>
                </router-link>
                <el-tooltip class="item" effect="dark" content="Delete this process" placement="bottom">
                  <i class='el-icon-delete round-boxed big' @click='deleteProcess(scope.row._id)'/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Create a copy of this process" placement="bottom">
                  <i class='el-icon-circle-plus-outline round-boxed big'
                    @click='createCopy(scope.row._id)'></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <aap-footer/>
  </el-container>
</template>

<script>
import AapSpinner from '../components/Spinner.vue';
import AapHeader from '../components/Header.vue';
import AapFooter from '../components/Footer.vue';
import AapBroken from '../components/Broken.vue';

export default {
  name: 'Processes',
  components: { AapSpinner, AapHeader, AapFooter, AapBroken },
  props: {},
  data: () => ({
    loading: true,
    broken: true
  }),
  computed: {
    processes() { return Object.values(this.$store.state.processes); }
  },
  beforeMount() { this.fetchProcesses() },
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
          this.$router.push('/administration/process/' + processId);
        })
        .catch((error) => {
          this.$alert(error.message, 'Error while creating a new process', {
            confirmButtonText: 'OK'
          });
        });
    },
    createCopy(processId) {
      this.$store.dispatch('CREATE_PROCESS_COPY', processId);
    },
    downloadApplicants(processId) {
      this.$store.dispatch('DOWNLOAD_EXCEL_ANSWERS', processId)
      .then((blob) => {
        console.log(blob);
        const fileName = 'Answers';
         if(window.navigator.msSaveOrOpenBlob) {
           window.navigator.msSaveBlob(blob, fileName);
         }else{
           const downloadLink = window.document.createElement('a');
           const contentTypeHeader = blob.type;
           downloadLink.href = window.URL.createObjectURL(new Blob([blob], { type: contentTypeHeader }));
           downloadLink.download = fileName;
           document.body.appendChild(downloadLink);
           downloadLink.click();
           document.body.removeChild(downloadLink);
          }
      })
      .catch((error) => {
        this.$alert(error.message, 'Error while downloading process answers', {
          confirmButtonText: 'OK'
        });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


</style>
