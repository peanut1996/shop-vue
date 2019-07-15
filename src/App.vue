<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
  list-style: none;
}
html,
body,
#app{
  height: 100%;
  .el-breadcrumb{
  margin-bottom: 10px;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  background-color: #d4dae0;
  }
}
</style>
