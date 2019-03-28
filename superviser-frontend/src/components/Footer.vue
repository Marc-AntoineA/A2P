<template>
  <el-footer>
    <el-row>
      <el-col :span="8">
        <a href='https://github.com/Marc-AntoineA/A2P' target='_blank'>
          <font-awesome-icon :icon="['fab', 'github']" />Source Code
        </a>
      </el-col>
      <el-col :span="8">
        TODO ?
      </el-col>
      <el-col :span="8">
        TODO ?
      </el-col>
    </el-row>
  </el-footer>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(faGithub);

export default {
  name: 'aap-footer',
  props: [],
}
</script>

<style>
</style>
