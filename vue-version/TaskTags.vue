<template>
  <div class="task-tags-wrapper">
    <div class="main-flex">
      <!-- Sidebar -->
      <div class="sider-column">
        <a-card :body-style="{ padding: '12px' }" class="category-card">
          <div class="sider-header">
            <span class="header-label">标签分类</span>
          </div>
          <div 
            v-for="cat in categories" 
            :key="cat"
            class="cat-menu-item"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            <span class="cat-zh">{{ cat }}</span>
            <span class="cat-en">TAG CATEGORY: {{ cat.toUpperCase() }}</span>
          </div>
        </a-card>
      </div>

      <!-- Content -->
      <div class="content-column">
        <a-card class="tags-container-card" :body-style="{ padding: '24px' }">
          <div class="tags-header">
            <div class="title-with-icon">
              <tag-outlined class="blue-icon" />
              <span class="title-text">自定义标签</span>
            </div>
            <div class="header-meta">
              <span class="meta-count">{{ currentTags.length }}/500</span>
            </div>
          </div>

          <div class="tags-flex-wrap">
            <div 
              v-for="(tag, idx) in currentTags" 
              :key="tag.id || idx"
              class="v2-task-tag"
            >
              <span class="tag-label-name">{{ tag.name }}</span>
              <div 
                class="tag-count-bubble" 
                @click="handleTagCountClick(tag)"
              >
                ({{ tag.count }})
              </div>
              <close-outlined class="tag-close-btn" />
            </div>
            
            <a-button type="dashed" class="add-btn-v2">
              <template #icon><plus-outlined /></template>
              添加标签
            </a-button>
          </div>
        </a-card>
      </div>
    </div>

    <!-- Detail Modal -->
    <a-modal
      v-model:visible="isDetailModalOpen"
      :width="500"
      centered
      @cancel="isDetailModalOpen = false"
    >
      <template #title>
        <div class="modal-title-flex">
          <info-circle-outlined class="blue-info-icon" />
          <span>标签详情: {{ selectedTag?.name }}</span>
        </div>
      </template>

      <div class="modal-subtitle">
        该标签组下包含以下 {{ currentSubTags.length }} 个子标签：
      </div>

      <!-- Add Subtag Input -->
      <div class="add-subtag-row">
        <a-input 
          placeholder="输入新标签" 
          v-model:value="newSubTagName"
          @pressEnter="handleAddSubTag"
        />
        <a-button type="primary" @click="handleAddSubTag">添加</a-button>
      </div>

      <div class="subtags-scroll-area">
        <div 
          v-for="item in currentSubTags" 
          :key="item"
          class="subtag-list-item"
        >
          <div class="subtag-left">
            <div class="blue-dot" />
            <span class="subtag-text">{{ item }}</span>
          </div>
          <a-button 
            type="link" 
            danger 
            size="small" 
            class="subtag-del-btn"
            @click="handleDeleteSubTag(item)"
          >
            <template #icon><delete-outlined /></template>
          </a-button>
        </div>
      </div>

      <template #footer>
        <a-button @click="isDetailModalOpen = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  PlusOutlined, 
  TagOutlined, 
  InfoCircleOutlined, 
  DeleteOutlined, 
  CloseOutlined 
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const activeCategory = ref('项目');
const isDetailModalOpen = ref(false);
const selectedTag = ref(null);
const newSubTagName = ref('');

const categories = [
  '项目', '任务用途', '场景分类', '采集模式', '动作模板', '遥控类型', '执行末端类型', '相机类型', '相机位置类型', '组件类型'
];

const categoryTags = ref({
  '项目': [
    { id: 'proj-1', name: 'InternalCommercial(内部-商业)', count: 5 },
    { id: 'proj-2', name: 'ExternalXupaosi(外部-芯跑思)', count: 2 },
    { id: 'proj-3', name: 'InternalIndustrial(内部-工业需求)', count: 1 },
    { id: 'proj-4', name: 'Backflow(回传问题)', count: 1 },
    { id: 'proj-5', name: 'SimulatedCollection(模拟采集)', count: 1 },
  ],
});

const subTagsData = ref({
  'InternalCommercial(内部-商业)': [
    '商业-零售', '商业-餐饮', '商业-酒店', '商业-办公', '商业-展厅'
  ],
  'ExternalXupaosi(外部-芯跑思)': [
    '芯跑思-测试A', '芯跑思-测试B'
  ],
  'InternalIndustrial(内部-工业需求)': ['工业-工厂'],
  'Backflow(回传问题)': ['标注错误'],
  'SimulatedCollection(模拟采集)': ['Unity仿真'],
});

const currentTags = computed(() => categoryTags.value[activeCategory.value] || []);
const currentSubTags = computed(() => subTagsData.value[selectedTag.value?.name] || []);

const handleTagCountClick = (tag) => {
  selectedTag.value = tag;
  isDetailModalOpen.value = true;
};

const handleAddSubTag = () => {
  if (!newSubTagName.value.trim()) {
    message.warning('请输入标签名称');
    return;
  }
  
  const tagName = selectedTag.value.name;
  if (!subTagsData.value[tagName]) subTagsData.value[tagName] = [];
  
  if (subTagsData.value[tagName].includes(newSubTagName.value.trim())) {
    message.error('该子标签已存在');
    return;
  }

  subTagsData.value[tagName].push(newSubTagName.value.trim());
  
  const tagObj = categoryTags.value[activeCategory.value].find(t => t.name === tagName);
  if (tagObj) tagObj.count++;

  newSubTagName.value = '';
  message.success('子标签添加成功');
};

const handleDeleteSubTag = (subTagToDelete) => {
  const tagName = selectedTag.value.name;
  subTagsData.value[tagName] = subTagsData.value[tagName].filter(st => st !== subTagToDelete);
  
  const tagObj = categoryTags.value[activeCategory.value].find(t => t.name === tagName);
  if (tagObj) tagObj.count = Math.max(0, tagObj.count - 1);
  
  message.info('子标签已删除');
};
</script>

<style scoped>
.task-tags-wrapper {
  background: #f1f2f5;
  min-height: calc(100vh - 64px);
  padding: 0;
}

.main-flex {
  display: flex;
  gap: 20px;
  align-items: stretch;
  padding: 20px;
}

/* Sidebar Styling */
.sider-column {
  width: 280px;
  flex-shrink: 0;
}

.category-card {
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #fff;
  height: 100%;
}

.sider-header {
  padding: 4px 16px 12px;
}

.header-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.cat-menu-item {
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cat-menu-item:hover {
  background: #f8fafc;
}

.cat-menu-item.active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.cat-zh {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.cat-menu-item.active .cat-zh {
  color: #1d4ed8;
}

.cat-en {
  font-size: 11px;
  color: #94a3b8;
}

/* Content Styling */
.content-column {
  flex: 1;
}

.tags-container-card {
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #fff;
  height: 100%;
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blue-icon {
  color: #3b82f6;
  font-size: 16px;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.meta-count {
  font-size: 13px;
  color: #94a3b8;
}

.tags-flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.v2-task-tag {
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 8px 0 12px;
  border-radius: 8px;
  background: #ef4444;
  border: 1px solid #ef4412;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
  cursor: default;
}

.tag-label-name {
  margin-right: 8px;
}

.tag-count-bubble {
  background: rgba(255, 255, 255, 0.2);
  padding: 0 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.tag-count-bubble:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tag-close-btn {
  margin-left: 8px;
  font-size: 12px;
  opacity: 0.8;
  cursor: pointer;
}

.tag-close-btn:hover {
  opacity: 1;
}

.add-btn-v2 {
  height: 36px;
  border-radius: 8px;
  color: #64748b;
  display: flex;
  align-items: center;
}

/* Modal Styling */
.modal-title-flex {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blue-info-icon {
  color: #3b82f6;
}

.modal-subtitle {
  margin-bottom: 16px;
  color: #64748b;
  font-size: 13px;
}

.add-subtag-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.subtags-scroll-area {
  max-height: 350px;
  overflow-y: auto;
}

.subtag-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.subtag-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blue-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
}

.subtag-text {
  font-size: 14px;
}

.subtag-del-btn {
  padding: 0;
}
</style>
