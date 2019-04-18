<template>
  <el-footer>
    <el-row>
      <el-col :span="12">
        Platform developed by
          <a href='https://socialhackersacademy.org/' target='_blank' rel='noopener noreferrer'> Social Hackers Academy </a>
          under <a href='https://github.com/Marc-AntoineA/A2P/blob/master/LICENSE' target='_blank' rel='noopener noreferrer'> MIT Licence </a>
          <br/>
        (Source code <a href='https://github.com/Marc-AntoineA/A2P' target='_blank' rel='noopener noreferrer'>
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>)
          <br/>
          Questions? Problems? Ideas? <a href='https://github.com/Marc-AntoineA/A2P/issues' target='_blank' rel='noopener noreferrer'>Open an issue</a>.
        </a>).
      </el-col>
      <el-col :span="12">
        <ul>
          <li><a href='#'>Social Hackers Academy Website</a></li>
          <li><a href='/'> Applicant Website</a></li>
        </ul>
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
  props: [  ],
}
</script>

<style>
.el-footer {
	border-top: solid 4px teal;
	margin: -8px;
	margin-top: 20px;
	padding: 20px 0px;
}

</style>
