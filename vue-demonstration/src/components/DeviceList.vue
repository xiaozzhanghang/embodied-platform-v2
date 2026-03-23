<template>
  <div class="device-list-wrapper">
    <!-- Header -->
    <div class="page-top-header">
      <h4 class="page-title">设备列表</h4>
      <p class="page-subtitle">查看和管理所有已注册的机器人设备实例及其运行状态</p>
    </div>

    <!-- Collapsible Filters -->
    <a-card class="v2-filter-card" :bordered="false">
      <a-form layout="horizontal">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="设备名称">
              <a-input v-model:value="searchForm.name" placeholder="请输入设备名称" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备编号">
              <a-input v-model:value="searchForm.id" placeholder="请输入设备编号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col v-if="!isExpanded" :span="8" class="v2-filter-actions">
            <a-space>
              <a-button type="primary" class="v2-primary-btn"><template #icon><search-outlined /></template> 搜索</a-button>
              <a-button @click="resetSearch"><template #icon><reload-outlined /></template> 重置</a-button>
              <a-button type="link" class="v2-expand-btn" @click="isExpanded = !isExpanded">
                展开 <down-outlined />
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        
        <a-row v-if="isExpanded" :gutter="24" class="v2-expanded-row">
          <a-col :span="8">
            <a-form-item label="设备状态">
              <a-select v-model:value="searchForm.status" placeholder="请选择状态" allow-clear>
                <a-select-option value="enabled">启用</a-select-option>
                <a-select-option value="disabled">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="注册时间">
              <a-range-picker v-model:value="searchForm.dateRange" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8" class="v2-filter-actions-right">
            <a-space>
              <a-button type="primary" class="v2-primary-btn"><template #icon><search-outlined /></template> 搜索</a-button>
              <a-button @click="resetSearch"><template #icon><reload-outlined /></template> 重置</a-button>
              <a-button type="link" class="v2-expand-btn" @click="isExpanded = !isExpanded">
                收起 <up-outlined />
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- Main Table Area -->
    <div class="v2-table-card">
      <!-- Standard Header (Always visible) -->
      <div class="v2-table-header">
        <h5 class="v2-table-title">设备实例列表</h5>
        <a-button type="primary" class="v2-primary-btn" @click="isModalOpen = true">
          <template #icon><plus-outlined /></template>
          添加设备
        </a-button>
      </div>

      <!-- Batch Operation Toolbar (Conditional with transition) -->
      <transition name="v2-slide-fade">
        <div v-if="selectedRowKeys.length > 0" class="v2-batch-bar">
          <div class="batch-left">
            <span class="selected-count">已选 {{ selectedRowKeys.length }} 项</span>
            <a-button type="link" @click="selectedRowKeys = []">取消</a-button>
          </div>

          <div class="batch-right">
            <a-space size="middle">
              <a-button danger class="v2-batch-btn-danger">批量删除</a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1">移动到组 A</a-menu-item>
                    <a-menu-item key="2">移动到组 B</a-menu-item>
                  </a-menu>
                </template>
                <a-button class="v2-batch-btn-ghost">
                  移动至 <down-outlined />
                </a-button>
              </a-dropdown>
              <a-button type="primary" class="v2-primary-btn">批量提交</a-button>
              <a-button type="text" class="v2-more-btn">
                <template #icon><ellipsis-outlined /></template>
              </a-button>
            </a-space>
          </div>
        </div>
      </transition>

      <a-table 
        :columns="deviceTableColumns" 
        :data-source="deviceListData" 
        :row-selection="{ 
          selectedRowKeys: selectedRowKeys, 
          onChange: onSelectChange,
          type: 'checkbox', 
          fixed: 'left' 
        }"
        :scroll="{ x: 1300 }"
        :pagination="{
          total: 32,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条`
        }"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'id'">
            <code class="v2-dev-code">{{ text }}</code>
          </template>
          <template v-else-if="column.key === 'urdf'">
            <a v-if="text !== '-'" class="v2-blue-link">{{ text }}</a>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'image'">
            <span class="v2-muted-text">{{ text }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <span :class="['v2-status-badge', text === 'enabled' ? 'badge-success' : 'badge-default']">
              {{ text === 'enabled' ? '启用' : '禁用' }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space size="middle" class="v2-action-space">
              <a-button type="link" size="small"><template #icon><eye-outlined /></template> 查看</a-button>
              <a-button type="link" size="small"><template #icon><edit-outlined /></template> 编辑</a-button>
              <a-button type="link" size="small" danger><template #icon><stop-outlined /></template> 禁用</a-button>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- Add Device Modal -->
      <a-modal 
        title="添加设备" 
        v-model:visible="isModalOpen" 
        :width="650"
        centered
        @ok="isModalOpen = false"
        :close-icon="h('span', { style: 'color: #64748b; font-size: 20px' }, '×')"
      >
        <a-form layout="horizontal" class="v2-modal-form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-form-item label="设备名称" required>
            <a-input placeholder="请输入设备名称" suffix="0 / 50" />
          </a-form-item>
          
          <a-form-item label="英文名称">
            <a-input placeholder="请输入英文名称" suffix="0 / 50">
              <template #suffix>
                <a-tooltip title="System ID"><info-circle-outlined class="v2-info-icon" /></a-tooltip>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="设备编号" required>
            <a-input placeholder="请输入设备编号" suffix="0 / 50" />
          </a-form-item>

          <a-form-item label="设备类型" required>
            <a-select placeholder="请选择设备类型" style="width: 100%" />
          </a-form-item>

          <a-form-item label="URDF">
            <a-space size="middle">
              <a-button type="primary" class="v2-blue-upload-btn">
                <template #icon><upload-outlined /></template> 上传URDF文件
              </a-button>
              <span class="v2-hint-text">可上传最多1份urdf格式的文件</span>
            </a-space>
          </a-form-item>

          <a-form-item label="设备图片">
            <a-upload list-type="picture-card" class="v2-pic-upload">
              <div class="v2-upload-trigger">
                <plus-outlined class="v2-plus-icon" />
              </div>
            </a-upload>
            <div class="v2-hint-text">可上传最多5张单个不超过2MB且格式为jpg/jpeg/png/gif的图片</div>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  DownOutlined, 
  UpOutlined, 
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  EllipsisOutlined
} from '@ant-design/icons-vue';

const isExpanded = ref(false);
const isModalOpen = ref(false);
const selectedRowKeys = ref([]);

const onSelectChange = (keys) => {
  selectedRowKeys.value = keys;
};

const searchForm = ref({
  name: '',
  id: '',
  status: undefined,
  dateRange: null
});

const resetSearch = () => {
  searchForm.value = { name: '', id: '', status: undefined, dateRange: null };
};

const deviceListData = ref(Array.from({ length: 10 }).map((_, i) => ({
  key: i.toString(),
  name: `R001GBDDAAAE08${10 + i}`,
  enName: 'R001GBDDAAA...',
  id: `DEV-B-10${i}`,
  urdf: i % 3 === 0 ? 'galbot_v2.urdf' : '-',
  image: '无图片',
  regDate: '2026-02-25 16:13:55',
  activeDate: '2026-02-25 16:13:55',
  status: i % 4 === 0 ? 'disabled' : 'enabled'
})));

const deviceTableColumns = [
  { title: '设备名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 220 },
  { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
  { title: '设备编号', dataIndex: 'id', key: 'id', width: 150 },
  { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 180 },
  { title: '设备图片', dataIndex: 'image', key: 'image', width: 120 },
  { title: '注册时间', dataIndex: 'regDate', key: 'regDate', width: 180 },
  { title: '活跃时间', dataIndex: 'activeDate', key: 'activeDate', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', fixed: 'right', width: 180 },
];
</script>

<style scoped>
.device-list-wrapper {
  background: #f1f2f5;
  min-height: calc(100vh - 64px);
  padding: 0 24px 24px;
}

.page-top-header {
  padding: 24px 0;
}

.page-title {
  font-weight: 600;
  font-size: 20px;
  color: #1e293b;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px;
}

.v2-filter-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.v2-filter-actions {
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.v2-expanded-row {
  margin-top: 16px;
}

.v2-filter-actions-right {
  text-align: right;
}

.v2-primary-btn {
  border-radius: 6px;
}

.v2-expand-btn {
  font-size: 14px;
  padding: 0;
}

.v2-table-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
}

.v2-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.v2-table-title {
  font-weight: 600;
  font-size: 16px;
  margin: 0;
}

.v2-dev-code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.v2-blue-link {
  color: #1a73e8;
}

.v2-muted-text {
  color: #aaa;
}

.v2-status-badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.badge-success {
  background: #f0fdf4;
  color: #166534;
}

.badge-default {
  background: #f8fafc;
  color: #64748b;
}

.v2-action-space :deep(.ant-btn-link) {
  padding: 0;
}

/* Modal Styling */
.v2-modal-form {
  margin-top: 24px;
}

.v2-info-icon {
  color: #64748b;
}

.v2-blue-upload-btn {
  background: #3b82f6;
  border-color: #3b82f6;
  border-radius: 6px;
}

.v2-hint-text {
  font-size: 12px;
  color: #94a3b8;
}

.v2-pic-upload :deep(.ant-upload-select-picture-card) {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.v2-upload-trigger {
  color: #9403b8;
}

.v2-plus-icon {
  font-size: 24px;
}

:deep(.ant-input-suffix) {
  color: #94a3b8;
}

/* Batch Bar Styling */
.v2-batch-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.batch-left {
  display: flex;
  align-items: center;
}

.selected-count {
  font-size: 14px;
  color: #64748b;
  margin-right: 8px;
}

.v2-batch-btn-danger {
  color: #ef4444;
  border-color: #ef4444;
  border-radius: 6px;
  background: transparent;
}

.v2-batch-btn-ghost {
  border-radius: 6px;
  color: #64748b;
}

.v2-more-btn {
  color: #64748b;
  font-size: 18px;
}

:deep(.ant-table-row-selected) td {
  background-color: #f8fafc !important;
}

/* Transition for Batch Bar */
.v2-slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.v2-slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.v2-slide-fade-enter-from,
.v2-slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
