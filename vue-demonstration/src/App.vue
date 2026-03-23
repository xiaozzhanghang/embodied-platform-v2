<template>
  <div class="demo-container">
    <a-tabs v-model:activeKey="activeKey" centered>
      <a-tab-pane key="1" tab="设备列表 (含批量操作)">
        <DeviceList />
      </a-tab-pane>
      <a-tab-pane key="2" tab="物体库">
        <ObjectLibrary />
      </a-tab-pane>
      <a-tab-pane key="3" tab="设备类型管理">
        <DeviceTypes />
      </a-tab-pane>
      <a-tab-pane key="4" tab="物体标签">
        <ObjectTags />
      </a-tab-pane>
      <a-tab-pane key="5" tab="任务标签">
        <TaskTags />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DeviceList from './components/DeviceList.vue';
import ObjectLibrary from './components/ObjectLibrary.vue';
import DeviceTypes from './components/DeviceTypes.vue';
import ObjectTags from './components/ObjectTags.vue';
import TaskTags from './components/TaskTags.vue';

const activeKey = ref('1');
</script>

<style>
body {
  margin: 0;
  background-color: #f1f2f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.demo-container {
  padding: 20px 0;
}
.ant-tabs-nav {
  background: #fff;
  margin-bottom: 0 !important;
  padding: 10px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>
