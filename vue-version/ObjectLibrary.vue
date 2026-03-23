<template>
  <div class="object-library-wrapper">
    <a-layout class="main-layout-card">
      <!-- Left Sidebar - Category Tree -->
      <a-layout-sider width="240" class="sider-panel">
        <div class="sider-header">
          <span class="sider-title">物体类型</span>
          <a-button type="link" size="small" class="add-link-btn" @click="isTypeModalOpen = true">去添加</a-button>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          class="category-menu"
          :items="categoryItems"
        />
      </a-layout-sider>

      <!-- Right Content - Table and Filters -->
      <a-layout-content class="content-panel">
        <!-- Filters Toolbar -->
        <div class="filters-toolbar">
          <a-select v-model:value="filters.scene" placeholder="请选择场景" style="width: 160px" allow-clear>
            <a-select-option value="industry">Industry(工业)</a-select-option>
            <a-select-option value="kitchen">Kitchen(厨房)</a-select-option>
          </a-select>
          <a-select v-model:value="filters.type" placeholder="请选择物体类型" style="width: 180px" allow-clear>
            <a-select-option value="drink">饮品类</a-select-option>
            <a-select-option value="wine">酒类</a-select-option>
            <a-select-option value="snacks">零食类</a-select-option>
          </a-select>
          <a-input v-model:value="filters.name" placeholder="请输入名称" style="width: 180px" allow-clear />
          <a-range-picker v-model:value="filters.dateRange" style="width: 260px" />
          
          <div class="action-buttons">
            <a-button type="primary" class="search-btn">
              <template #icon><search-outlined /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon><reload-outlined /></template>
              重置
            </a-button>
            <a-button type="primary" @click="isAddModalOpen = true">
              <template #icon><plus-outlined /></template>
              添加
            </a-button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-container">
          <a-table
            :columns="columns"
            :data-source="data"
            size="middle"
            :pagination="{
              total: 79,
              pageSize: 20,
              showTotal: (total) => `共 ${total} 条`,
              style: { marginTop: '16px' }
            }"
            :scroll="{ x: 1200, y: 'calc(100vh - 350px)' }"
            :row-class-name="() => 'table-row-hover'"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'pic'">
                <span class="muted-text">{{ record.pic }}</span>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-space size="middle" class="action-cell">
                  <a-button type="link" size="small" class="action-link">
                    <template #icon><edit-outlined /></template>
                    编辑
                  </a-button>
                  <a-button type="link" size="small" danger class="action-link">
                    <template #icon><delete-outlined /></template>
                    删除
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- Modal 1: Object Type Management -->
    <a-modal
      title="物体类型管理"
      v-model:visible="isTypeModalOpen"
      :width="800"
      centered
      @cancel="isTypeModalOpen = false"
    >
      <div class="type-mgmt-container">
        <!-- Left Panel: Primary Categories -->
        <div class="panel-left">
          <div class="panel-header">
            <span class="panel-header-title">一级分类</span>
          </div>
          <div class="panel-body">
            <div 
              v-for="cat in allCategories" 
              :key="cat.name"
              class="cat-item"
              :class="{ active: activeCategoryName === cat.name }"
              @click="activeCategoryName = cat.name"
            >
              <span class="cat-name" :class="{ 'active-text': activeCategoryName === cat.name }">{{ cat.name }}</span>
              <span class="cat-count">{{ cat.count }}</span>
            </div>
          </div>
          <div class="panel-footer">
            <div v-if="isAddingCategory" class="add-action-group">
              <a-input 
                size="small" 
                autofocus 
                placeholder="分类名称" 
                v-model:value="newCategoryName"
                @pressEnter="onConfirmAddCategory"
              />
              <a-button size="small" type="primary" @click="onConfirmAddCategory">OK</a-button>
              <a-button size="small" @click="isAddingCategory = false">
                <template #icon><close-outlined /></template>
              </a-button>
            </div>
            <a-button v-else type="dashed" block @click="isAddingCategory = true">
              <template #icon><plus-outlined /></template>
              添加一级分类
            </a-button>
          </div>
        </div>

        <!-- Right Panel: Secondary Tags -->
        <div class="panel-right">
          <div class="panel-header">
            <span class="panel-header-title">{{ activeCategoryName }} · 二级标签</span>
            <span class="tag-meta">{{ activeCatData.tags.length }} 标签</span>
          </div>
          <div class="panel-body">
            <div class="secondary-tags-grid">
              <div 
                v-for="tag in activeCatData.tags" 
                :key="tag.id"
                class="secondary-tag-item"
              >
                <div class="tag-info">
                  <span class="tag-zh">{{ tag.zh }}</span>
                  <span class="tag-en">({{ tag.en }})</span>
                </div>
                <close-outlined 
                  class="tag-delete-icon" 
                  @click.stop="handleDeleteTag(tag.id)" 
                />
              </div>
            </div>
          </div>
          <div class="panel-footer">
            <div v-if="isAddingTag" class="add-tag-form">
              <div class="form-row">
                <a-input size="small" placeholder="中文名称" v-model:value="newTagName" />
                <a-input size="small" placeholder="英文名称" v-model:value="newTagEnName" @pressEnter="onConfirmAddTag" />
              </div>
              <div class="form-actions">
                <a-button size="small" @click="isAddingTag = false">取消</a-button>
                <a-button size="small" type="primary" @click="onConfirmAddTag">确认添加</a-button>
              </div>
            </div>
            <a-button v-else type="dashed" block @click="isAddingTag = true">
              <template #icon><plus-outlined /></template>
              添加二级标签
            </a-button>
          </div>
        </div>
      </div>
      <template #footer>
        <a-button @click="isTypeModalOpen = false">取消</a-button>
        <a-button type="primary" class="save-btn" @click="isTypeModalOpen = false">保存</a-button>
      </template>
    </a-modal>

    <!-- Modal 2: Add Object -->
    <a-modal
      title="添加物体"
      v-model:visible="isAddModalOpen"
      :width="650"
      centered
      ok-text="确定"
      cancel-text="取消"
      @ok="isAddModalOpen = false"
    >
      <a-form layout="vertical" class="add-object-form">
        <h5 class="section-title">基本信息</h5>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label="名称" required>
              <a-input placeholder="请输入名称" />
              <template #extra>
                <div class="char-count-extra">0 / 50</div>
              </template>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="英文名称">
              <a-input placeholder="English name" />
              <template #extra>
                <div class="char-count-extra">0 / 50</div>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="20" class="form-row-nested">
          <a-col :span="12">
            <a-form-item label="物体类型" required>
              <a-select placeholder="请选择类型">
                <a-select-option value="drink">饮品类</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="场景" required>
              <a-select placeholder="请选择场景">
                <a-select-option value="kitchen">Kitchen(厨房)</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="材质特性">
          <a-select placeholder="请选择材质（可选）" />
        </a-form-item>

        <h5 class="section-title section-mt">物体图片</h5>
        <div class="upload-dropzone">
          <div class="dropzone-icon-box">
            <plus-outlined class="dropzone-icon" />
          </div>
          <div class="dropzone-text">
            <span class="text-blue">点击上传</span>
            <span class="text-muted"> 或拖拽图片至此</span>
          </div>
          <div class="dropzone-hint">
            支持 JPG、JPEG、PNG、GIF，不超过 2MB
          </div>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { 
  SearchOutlined, 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  FolderOpenOutlined,
  CloseOutlined 
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// Menu Keys
const selectedKeys = ref(['cat-drink']);
const openKeys = ref(['cat-snacks', 'cat-daily']);

// Category Items for Menu
const categoryItems = [
  { key: 'cat-drink', icon: () => h(FolderOpenOutlined), label: '饮品类' },
  { key: 'cat-wine', icon: () => h(FolderOpenOutlined), label: '酒类' },
  { key: 'cat-snacks', icon: () => h(FolderOpenOutlined), label: '零食类', children: [
    { key: 'snack-1', label: '方便食品类' },
    { key: 'snack-2', label: '罐头食品类' },
  ]},
  { key: 'cat-daily', icon: () => h(FolderOpenOutlined), label: '日常用品类', children: [
    { key: 'daily-1', label: '卫生用品' },
    { key: 'daily-2', label: '药品类' },
    { key: 'daily-3', label: '类别类' },
    { key: 'daily-4', label: '家具类' },
    { key: 'daily-5', label: '仓储类' },
    { key: 'daily-6', label: '机器本体' },
    { key: 'daily-7', label: '区域' },
  ]},
];

// Table Data
const data = ref([
  { key: '1', scene: 'Industry(工业)', name: '网线', enName: 'Network cable', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:51:50', updateTime: '2026-03-06 16:51:50' },
  { key: '2', scene: 'Industry(工业)', name: '电源线', enName: 'power cord', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:51:27', updateTime: '2026-03-06 16:51:27' },
  { key: '3', scene: 'Industry(工业)', name: '四宫格料框', enName: 'four-compar...', material: '塑料', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:50:52', updateTime: '2026-03-06 16:50:52' },
  { key: '4', scene: 'Industry(工业)', name: 'HDMI线', enName: 'HDMI cable', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:49:08', updateTime: '2026-03-06 16:49:08' },
  { key: '5', scene: 'Industry(工业)', name: 'USB线', enName: 'USB cable', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:48:35', updateTime: '2026-03-06 16:48:35' },
]);

// Table Columns
const columns = [
  { title: '场景', dataIndex: 'scene', key: 'scene', width: 150, ellipsis: true },
  { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150, ellipsis: true },
  { title: '材质特性', dataIndex: 'material', key: 'material', width: 100 },
  { title: '物体图片', dataIndex: 'pic', key: 'pic', width: 100 },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
  { title: '更新人', dataIndex: 'updater', key: 'updater', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' },
];

// Management States
const isTypeModalOpen = ref(false);
const isAddModalOpen = ref(false);
const activeCategoryName = ref('饮品类');
const isAddingCategory = ref(false);
const newCategoryName = ref('');
const isAddingTag = ref(false);
const newTagName = ref('');
const newTagEnName = ref('');

const filters = ref({
  scene: undefined,
  type: undefined,
  name: '',
  dateRange: null
});

// Category & Tags Full State
const allCategories = ref([
  { name: '饮品类', count: 12, tags: [
    { id: '1', zh: '碳酸饮料', en: 'Soda' },
    { id: '2', zh: '天然矿泉水', en: 'Mineral' },
    { id: '3', zh: '奶茶/品边饮料', en: 'Milk Tea' },
    { id: '4', zh: '矿泉水/泉水', en: 'Water' },
    { id: '5', zh: '果汁饮料', en: 'Juice' },
    { id: '6', zh: '乳制品饮料', en: 'Dairy' },
    { id: '7', zh: '奶茶/泡沫饮品', en: 'Tea' },
    { id: '8', zh: '维生素饮料', en: 'Vitamin' },
    { id: '9', zh: '功能饮品', en: 'Function' },
    { id: '10', zh: '运动饮料', en: 'Sport' },
    { id: '11', zh: '茶饮', en: 'Tea' },
    { id: '12', zh: '草本饮品', en: 'Herbal' }
  ]},
  { name: '酒类', count: 7, tags: [
    { id: '13', zh: '啤酒', en: 'Beer' },
    { id: '14', zh: '白酒', en: 'Biajiu' },
    { id: '15', zh: '红酒', en: 'Wine' },
    { id: '16', zh: '洋酒', en: 'Whisky' },
    { id: '17', zh: '黄酒', en: 'Rice Wine' },
    { id: '18', zh: '起泡酒', en: 'Sparkling' },
    { id: '19', zh: '鸡尾酒', en: 'Cocktail' }
  ]},
  { name: '零食类', count: 8, tags: [
    { id: '20', zh: '薯片', en: 'Chips' },
    { id: '21', zh: '坚果', en: 'Nuts' },
    { id: '22', zh: '巧克力', en: 'Choco' },
    { id: '23', zh: '饼干', en: 'Biscuit' },
    { id: '24', zh: '糖果', en: 'Candy' },
    { id: '25', zh: '肉干', en: 'Jerky' },
    { id: '26', zh: '海苔', en: 'Seaweed' },
    { id: '27', zh: '果干', en: 'Dry Fruit' }
  ]},
  { name: '日常用品', count: 4, tags: [
    { id: '28', zh: '纸巾', en: 'Tissue' },
    { id: '29', zh: '洗衣液', en: 'Laundry' },
    { id: '30', zh: '洗发水', en: 'Shampoo' },
    { id: '31', zh: '牙膏', en: 'Toothpaste' }
  ]},
  { name: '工具类', count: 3, tags: [
    { id: '32', zh: '扳手', en: 'Wrench' },
    { id: '33', zh: '螺丝刀', en: 'Driver' },
    { id: '34', zh: '钳子', en: 'Pliers' }
  ]},
]);

const activeCatData = computed(() => {
  return allCategories.value.find(c => c.name === activeCategoryName.value) || allCategories.value[0];
});

// Logic Handlers
const handleReset = () => {
  filters.value = {
    scene: undefined,
    type: undefined,
    name: '',
    dateRange: null
  };
  message.info('重置成功');
};

const onConfirmAddCategory = () => {
  if (!newCategoryName.value.trim()) {
    isAddingCategory.value = false;
    return;
  }
  if (allCategories.value.find(c => c.name === newCategoryName.value)) {
    message.warning('分类已存在');
    return;
  }
  allCategories.value.push({ name: newCategoryName.value, count: 0, tags: [] });
  newCategoryName.value = '';
  isAddingCategory.value = false;
  message.success('分类添加成功');
};

const onConfirmAddTag = () => {
  if (!newTagName.value.trim()) {
    isAddingTag.value = false;
    return;
  }
  const cat = allCategories.value.find(c => c.name === activeCategoryName.value);
  if (cat) {
    if (cat.tags.find(t => t.zh === newTagName.value)) {
      message.warning('标签已存在');
      return;
    }
    cat.tags.push({ 
      id: Date.now().toString(), 
      zh: newTagName.value, 
      en: newTagEnName.value || 'Item' 
    });
    cat.count = cat.tags.length;
    message.success('标签添加成功');
  }
  newTagName.value = '';
  newTagEnName.value = '';
  isAddingTag.value = false;
};

const handleDeleteTag = (tagId) => {
  const cat = allCategories.value.find(c => c.name === activeCategoryName.value);
  if (cat) {
    cat.tags = cat.tags.filter(t => t.id !== tagId);
    cat.count = cat.tags.length;
    message.info('标签已移除');
  }
};
</script>

<style scoped>
.object-library-wrapper {
  background: #f1f2f5;
  min-height: calc(100vh - 64px);
}

.main-layout-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  min-height: calc(100vh - 120px);
}

/* Sider Styling */
.sider-panel {
  background: #fff;
  border-right: 1px solid #d9d9d9;
}

.sider-header {
  padding: 16px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sider-title {
  font-weight: 600;
  font-size: 14px;
}

.add-link-btn {
  padding: 0;
  font-size: 12px;
}

.category-menu {
  height: calc(100% - 55px);
  border-right: 0;
  overflow-y: auto;
}

/* Content Styling */
.content-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.filters-toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-buttons {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.table-container {
  flex: 1;
}

.muted-text {
  color: rgba(0, 0, 0, 0.45);
}

.action-link {
  padding: 0;
}

/* Type Mgmt Modal Styles */
.type-mgmt-container {
  display: flex;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  height: 480px;
}

.panel-left {
  flex: 1;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.panel-right {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header-title {
  font-weight: 600;
}

.cat-item {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.cat-item.active {
  background: #f0f7ff;
  border-right: 2px solid #1890ff;
}

.active-text {
  color: #1890ff;
}

.cat-count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
}

.panel-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.add-action-group {
  display: flex;
  gap: 4px;
}

.tag-meta {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.secondary-tags-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
  padding: 16px;
}

.secondary-tag-item {
  background: #40a9ff;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  height: 42px;
  box-shadow: 0 2px 4px rgba(64, 169, 255, 0.2);
}

.tag-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
  overflow: hidden;
}

.tag-zh {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-en {
  font-size: 11px;
  opacity: 0.85;
  white-space: nowrap;
}

.tag-delete-icon {
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
}

.add-tag-form {
  padding: 12px 16px;
  background: #fbfbfb;
  border-bottom: 1px solid #f0f0f0;
}

.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.save-btn {
  background: #52c41a;
  border-color: #52c41a;
}

/* Add Object Modal Styles */
.add-object-form {
  margin-top: 20px;
}

.section-title {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
}

.section-mt {
  margin-top: 10px;
}

.char-count-extra {
  text-align: right;
  font-size: 12px;
  color: #999;
}

.form-row-nested {
  margin-top: -10px;
}

.upload-dropzone {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-dropzone:hover {
  border-color: #1890ff;
}

.dropzone-icon-box {
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.dropzone-icon {
  font-size: 20px;
  color: #999;
}

.text-blue {
  color: #1890ff;
}

.text-muted {
  color: rgba(0, 0, 0, 0.45);
}

.dropzone-hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-top: 8px;
}

/* Custom Helper */
:deep(.table-row-hover:hover) td {
  background-color: #fafafa !important;
}
</style>
