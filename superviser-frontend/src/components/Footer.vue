<template>
  <el-footer>
    <el-row>
      <el-col :span="10">
        <p>
          Platform developed by <strong>Marc-Antoine Augé</strong> for
            <a href='https://socialhackersacademy.org/' target='_blank' rel='noopener noreferrer'>Social Hackers Academy</a>.
          <br/>
          <font-awesome-icon class='big-icon' :icon="['fab', 'github']" />
          <a href='https://github.com/Marc-AntoineA/A2P' target='_blank' rel='noopener noreferrer'> Source Code</a>
          (under
            <a href='https://github.com/Marc-AntoineA/A2P/blob/master/LICENSE' target='_blank' rel='noopener noreferrer'>
              MIT Licence
            </a>
          )
        </p>
      </el-col>
      <el-col :span="7">
        <p>
            <span class='link-prefix'>Go to</span><a href='https://socialhackersacademy.org/'>Social Hackers Academy Website</a><br/>
            <span class='link-prefix'>Go to</span><a href='/'> Applicant Website</a>
        </p>
      </el-col>
      <el-col :span="7">
        <p>
          <p>
          <strong>Version 2.0.0 - alpha</strong><br/>
          Questions? Problems? Ideas?
          <a href='https://github.com/Marc-AntoineA/A2P/issues' target='_blank' rel='noopener noreferrer'>Open an issue</a>.
        </p>
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
.el-footer {
	border-top: solid 4px var(--primary);
	margin: -8px;
	margin-top: 20px;
	padding: 3px 0px;
  min-height: 60px!important;
  height: auto!important;
  background-color: var(--primary-pale);
}

.big-icon {
  font-size: 15px;
}

.links-list {
  list-style: none;
  text-align: left;
}

.link-prefix {
	text-transform: uppercase;
	font-weight: bolder;
	color: #303030;
	font-size: 12px;
	margin-right: 7px;
}
</style>
