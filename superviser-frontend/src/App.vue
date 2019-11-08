<template>
  <div id="app">

    <router-view class="view"></router-view>

  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logo {
  height: 90%;
}

.draft {
  color: orange;
}

.open {
  color: green;
}

.closed {
  color: firebrick;
}

.finished {
  color: red;
}

i.big {
  font-size: 18px;
}

i.round-boxed {
  border: 1px solid transparent;
  border-radius: 100%;
  padding: 4px;
  color: #606266;
}

i.round-boxed:hover {
  border-color: teal;
  background-color: #f8f8f8;
}

i.round-boxed.disabled {
  cursor: not-allowed;
  color: lightgray;
}

i.round-boxed.disabled:hover {
  border-color: gray;
}
</style>
