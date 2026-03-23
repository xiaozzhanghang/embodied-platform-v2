<template>
  <div class="object-tags-container">
    <!-- Main Layout Wrapper -->
    <div class="tags-layout-wrapper">
      <!-- Sidebar -->
      <div class="sidebar-container">
        <a-card :body-style="{ padding: '12px' }" class="sidebar-card">
          <div 
            v-for="cat in categories" 
            :key="cat"
            class="category-item"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            <div class="category-header">
              <span class="category-cat">{{ cat }}</span>
            </div>
            <span class="category-desc">{{ cat }}</span>
          </div>
        </a-card>
      </div>

      <!-- Main Content -->
      <div class="content-container">
        <a-card :body-style="{ padding: '24px' }" class="content-card">
          <div class="content-header">
            <h5 class="header-title">自定义标签</h5>
            <span class="header-count">{{ tags.length }}/500</span>
          </div>

          <div class="tags-grid">
            <a-tag 
              v-for="(tag, idx) in tags" 
              :key="idx" 
              closable 
              class="custom-blue-tag"
            >
              {{ tag.name }} ({{ tag.count }})
            </a-tag>
            
            <a-button type="dashed" class="add-tag-btn">
              <template #icon><plus-outlined /></template>
              添加标签
            </a-button>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const activeCategory = ref('场景分类');

const categories = [
  '场景分类', '物体类型', '颜色特性', '光学特性', '材质特性', '形状特性', '形态特性', '运动特性'
];

const categoryTags = {
  '场景分类': [
    { name: 'Supermarket(超市)', count: 0 },
    { name: 'Industry(工业)', count: 0 },
    { name: 'Household(家居)', count: 0 },
    { name: 'Kitchen(厨房)', count: 0 },
    { name: 'Hotel(酒店)', count: 0 },
    { name: 'Scientific(科研)', count: 0 },
    { name: 'Shelf(货架)', count: 0 },
    { name: 'Container(货柜)', count: 0 },
    { name: 'pharmacy(药店)', count: 0 },
    { name: 'Warehousing(仓储)', count: 0 },
    { name: 'Region(区域)', count: 0 },
  ],
};

const tags = computed(() => categoryTags[activeCategory.value] || []);
</script>

<style scoped>
.object-tags-container {
  padding: 0 24px 24px;
  background: #F1F2F5;
  min-height: calc(100vh - 64px);
}

.tags-layout-wrapper {
  display: flex;
  gap: 20px;
  align-items: stretch;
  padding-top: 20px;
}

/* Sidebar Styling */
.sidebar-container {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-card {
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #fff;
  height: 100%;
}

.category-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-item:hover {
  background: #f8fafc;
}

.category-item.active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.category-cat {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.category-item.active .category-cat {
  color: #1d4ed8;
}

.category-desc {
  font-size: 12px;
  color: #64748b;
}

/* Content Styling */
.content-container {
  flex: 1;
}

.content-card {
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #fff;
  height: 100%;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.header-count {
  font-size: 13px;
  color: #64748b;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.custom-blue-tag {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 6px;
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
  font-size: 13px;
  margin: 0;
}

.add-tag-btn {
  height: 32px;
  border-radius: 6px;
  color: #64748b;
}
</style>

<style>
/* Global Ant Design Tag Overrides to match React CSS */
.custom-blue-tag .ant-tag-close-icon {
  color: rgba(255, 255, 255, 0.85) !important;
}
.custom-blue-tag .ant-tag-close-icon:hover {
  color: #fff !important;
}
</style>
