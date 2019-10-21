<template>
  <el-footer>
    <el-row>
      <el-col :span="8">
        <p>
          Platform developed by Marc-Antoine Augé for
            <a href='https://socialhackersacademy.org/' target='_blank' rel='noopener noreferrer'>Social Hackers Academy</a>.
        </p>
        <p>
          <font-awesome-icon class='big-icon' :icon="['fab', 'github']" />
          <a href='https://github.com/Marc-AntoineA/A2P' target='_blank' rel='noopener noreferrer'>Source Code</a>
          (under
            <a href='https://github.com/Marc-AntoineA/A2P/blob/master/LICENSE' target='_blank' rel='noopener noreferrer'>
              MIT Licence
            </a>
          )
        </p>
        <p> <!-- TODO compute it from package.json -->
          Version 1.0.0
        </p>
      </el-col>
      <el-col :span="8">
        <ul class='links-list'>
          <li>
            <span class='link-prefix'>Go to</span>
            <a href='https://socialhackersacademy.org/'>Social Hackers Academy Website</a>
          </li>
          <li><span class='link-prefix'>Go to</span> <a href='/'> Applicant Website</a></li>
        </ul>
      </el-col>
      <el-col :span="8">
        <p>
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
	border-top: solid 4px teal;
	margin: -8px;
	margin-top: 20px;
	padding: 20px 0px;
}

.big-icon {
  font-size: 40px;
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
