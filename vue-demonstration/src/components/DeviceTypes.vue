<template>
  <div class="device-types-wrapper">
    <!-- Header -->
    <div class="page-top-header">
      <h4 class="page-title">设备类型管理</h4>
      <p class="page-subtitle">统一管理机器人设备及其组成部件的类型定义与URDF配置</p>
    </div>

    <!-- Filters -->
    <a-card class="filter-card" :bordered="false">
      <a-form layout="horizontal">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="设备名称">
              <a-input v-model:value="searchForm.name" placeholder="请输入设备名称" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="版本号">
              <a-input v-model:value="searchForm.version" placeholder="请输入版本号" allow-clear />
            </a-form-item>
          </a-col>
          <template v-if="isExpanded">
            <a-col :span="8">
              <a-form-item label="状态">
                <a-select v-model:value="searchForm.status" placeholder="请选择状态" allow-clear>
                  <a-select-option value="enabled">启用</a-select-option>
                  <a-select-option value="disabled">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="isExpanded ? 24 : 8" class="filter-actions" :style="{ textAlign: isExpanded ? 'right' : 'left' }">
            <a-space>
              <a-button type="primary" class="v2-primary-btn">
                <template #icon><search-outlined /></template>
                查询
              </a-button>
              <a-button @click="resetSearch">
                <template #icon><sync-outlined /></template>
                重置
              </a-button>
              <a-button type="link" @click="isExpanded = !isExpanded">
                {{ isExpanded ? '收起' : '展开' }}
                <up-outlined v-if="isExpanded" />
                <down-outlined v-else />
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- Main Table Section -->
    <div class="table-outer-card">
      <div class="table-top-toolbar">
        <a-tabs v-model:activeKey="activeTab" type="card" class="v2-inner-tabs">
          <a-tab-pane key="devices" tab="机器人设备" />
          <a-tab-pane key="parts" tab="机器人部件" />
        </a-tabs>
        <a-button type="primary" class="v2-primary-btn" @click="handleAddClick">
          <template #icon><plus-outlined /></template>
          添加{{ activeTab === 'devices' ? '设备' : '部件' }}
        </a-button>
      </div>

      <a-table 
        :columns="activeTab === 'devices' ? deviceTableColumns : partTableColumns" 
        :data-source="activeTab === 'devices' ? deviceListData : partListData"
        :row-selection="{ type: 'checkbox', fixed: 'left' }"
        :scroll="{ x: 1300 }"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条`
        }"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'urdf'">
            <a v-if="text !== '-'" class="v2-link">{{ text }}</a>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'status' || column.key === 'stat'">
            <span :class="['v2-badge', text === 'enabled' ? 'badge-success' : 'badge-default']">
              {{ text === 'enabled' ? '启用' : '禁用' }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space size="middle" class="v2-action-links">
              <a-button type="link" size="small"><template #icon><eye-outlined /></template> 查看</a-button>
              <a-button type="link" size="small"><template #icon><edit-outlined /></template> 编辑</a-button>
              <a-button type="link" size="small" danger><template #icon><stop-outlined /></template> 禁用</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Device Modal: Add Robot Device -->
    <a-modal 
      title="添加机器人设备" 
      v-model:visible="isDeviceModalOpen" 
      :width="900"
      centered
      :footer="null"
      :close-icon="h('span', { style: 'color: #64748b; font-size: 20px' }, '×')"
    >
      <a-form layout="horizontal" class="v2-modal-form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="机器人名称" required :label-col="{ span: 8 }">
              <a-input placeholder="请输入机器人名称" suffix="0 / 50" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="英文名称" :label-col="{ span: 8 }">
              <a-input placeholder="请输入英文名称" suffix="0 / 50">
                <template #suffix>
                  <a-tooltip title="System ID"><info-circle-outlined class="v2-info-icon" /></a-tooltip>
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="机器人版本" required :label-col="{ span: 8 }">
              <a-input placeholder="请输入机器人版本" suffix="0 / 50" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部件" :label-col="{ span: 8 }">
              <a-select placeholder="请选择部件" mode="multiple" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="v2-internal-section">
          <div class="internal-label">已选部件</div>
          <div class="internal-table-box">
            <a-table 
              :data-source="selectedParts"
              :pagination="false"
              size="small"
              bordered
              :columns="nestedPartColumns"
            >
              <template #bodyCell="{ column }">
                <template v-if="column.key === 'align'">
                  <div class="v2-align-point" />
                </template>
                <template v-else-if="column.key === 'action'">
                  <div class="v2-minus-circle">-</div>
                </template>
              </template>
            </a-table>
          </div>
        </div>

        <a-form-item label="传感器描述" required :label-col="{ span: 4 }">
          <div class="textarea-wrapper">
            <a-textarea :rows="4" placeholder="请输入传感器描述" />
            <span class="v2-char-limit">0 / 500</span>
          </div>
        </a-form-item>

        <a-row class="v2-form-row">
          <a-col :span="4" class="v2-label-col">URDF</a-col>
          <a-col :span="20">
            <a-space size="middle">
              <a-button type="primary" class="v2-blue-upload-btn">
                <template #icon><upload-outlined /></template> 上传URDF文件
              </a-button>
              <span class="v2-upload-hint">可上传最多1份urdf格式的文件</span>
            </a-space>
          </a-col>
        </a-row>

        <a-row class="v2-form-row">
          <a-col :span="4" class="v2-label-col">设备图片</a-col>
          <a-col :span="20">
            <a-upload list-type="picture-card" class="v2-pic-upload">
              <div class="v2-upload-trigger">
                <plus-outlined class="v2-plus-icon" />
              </div>
            </a-upload>
            <div class="v2-upload-hint">可上传最多5张单个不超过2MB且格式为jpg/jpeg/png/gif的图片</div>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- Part Modal: Add Robot Part -->
    <a-modal 
      title="添加机器人部件" 
      v-model:visible="isPartModalOpen" 
      :width="1000"
      centered
      @ok="isPartModalOpen = false"
      :close-icon="h('span', { style: 'color: #64748b; font-size: 20px' }, '×')"
    >
      <a-form layout="horizontal" class="v2-modal-form" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="部件名称" required :label-col="{ span: 6 }">
              <a-input placeholder="请输入部件名称" suffix="0 / 50" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="英文名称" :label-col="{ span: 6 }">
              <a-input placeholder="请输入英文名称" suffix="0 / 50">
                <template #suffix>
                  <a-tooltip title="System ID"><info-circle-outlined class="v2-info-icon" /></a-tooltip>
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="部件类型" required :label-col="{ span: 6 }">
              <a-select placeholder="请选择部件类型" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部件品牌" :label-col="{ span: 6 }">
              <a-input placeholder="请输入部件品牌" suffix="0 / 50" />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="v2-internal-section">
          <div class="internal-label">Topic组件</div>
          <div class="internal-table-box">
            <a-table 
              :data-source="topicData"
              :pagination="false"
              size="small"
              bordered
              :columns="topicGridColumns"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'seq'">
                  {{ record.seq }}
                </template>
                <template v-else-if="column.key === 'name' || column.key === 'ename' || column.key === 'topic'">
                  <input class="v2-invisible-input" :placeholder="'请输入' + column.title" />
                </template>
                <template v-else-if="column.key === 'res'">
                  <div class="v2-res-inputs">
                    <input class="res-mini-input" placeholder="宽" />
                    <span class="xt">×</span>
                    <input class="res-mini-input" placeholder="高" />
                  </div>
                </template>
                <template v-else-if="column.key === 'action'">
                  <div class="v2-double-circles">
                    <div class="v2-minus-circle">-</div>
                    <div class="v2-plus-circle">+</div>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>

        <a-form-item label="传感器描述">
          <div class="textarea-wrapper">
            <a-textarea :rows="3" placeholder="请输入传感器描述" />
            <span class="v2-char-limit">0 / 500</span>
          </div>
        </a-form-item>

        <a-row class="v2-form-row">
          <a-col :span="3" class="v2-label-col">URDF</a-col>
          <a-col :span="21">
            <a-space size="middle">
              <a-button type="primary" class="v2-blue-upload-btn">
                <template #icon><upload-outlined /></template> 上传URDF文件
              </a-button>
              <span class="v2-upload-hint">可上传最多1份urdf格式的文件</span>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { 
  SearchOutlined, 
  SyncOutlined, 
  PlusOutlined, 
  UploadOutlined,
  DownOutlined,
  UpOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';

const isExpanded = ref(false);
const activeTab = ref('devices');
const isDeviceModalOpen = ref(false);
const isPartModalOpen = ref(false);

const searchForm = ref({
  name: '',
  version: '',
  status: undefined
});

const resetSearch = () => {
  searchForm.value = { name: '', version: '', status: undefined };
};

const deviceListData = ref([
  { key: '1', name: 'galbot_2.2_RGB', enName: 'galbot_2.2', version: 'V2.2', desc: '预置 galbot V2.2 机器人配套 RGB 相机模块', urdf: 'galbot_v2.urdf', image: '无图片', regDate: '2025-12-20', status: 'enabled' },
  { key: '2', name: 'galbot_2.2_深度', enName: 'galbot_2.2.1', version: 'V2.2.1', desc: '预置 galbot V2.2 机器人配套深度相机模块', urdf: 'galbot_v2_depth.urdf', image: '无图片', regDate: '2025-12-19', status: 'enabled' },
]);

const partListData = ref([
  { key: '1', name: '灵巧手_右', enName: 'LingQiaoShou_Right', version: 'G1.0', desc: '五指驱动灵巧采集手', urdf: 'hand_r.urdf', image: '无图片', regDate: '2025-12-20', stat: 'enabled' },
]);

const deviceTableColumns = [
  { title: '机器人名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 180 },
  { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
  { title: '版本', dataIndex: 'version', key: 'version', width: 100 },
  { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 180 },
  { title: '注册时间', dataIndex: 'regDate', key: 'regDate', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', fixed: 'right', width: 180 },
];

const partTableColumns = [
  { title: '部件名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 150 },
  { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
  { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 180 },
  { title: '状态', dataIndex: 'stat', key: 'stat', width: 100 },
  { title: '操作', key: 'action', fixed: 'right', width: 180 },
];

const selectedParts = ref([
  { key: 1, name: '头部左相机', type: 'Body-HeadLeftCamera(本体-头...' }
]);

const nestedPartColumns = [
  { title: '对齐点', dataIndex: 'align', key: 'align', width: 80, align: 'center' },
  { title: '部件名称', dataIndex: 'name', key: 'name' },
  { title: '部件类型', dataIndex: 'type', key: 'type' },
  { title: '操作', key: 'action', width: 80, align: 'center' }
];

const topicData = ref([
  { key: 1, seq: 1 }
]);

const topicGridColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: 'Topic名称', dataIndex: 'name', key: 'name' },
  { title: '英文名称', dataIndex: 'ename', key: 'ename' },
  { title: 'Topic', dataIndex: 'topic', key: 'topic' },
  { title: '分辨率', dataIndex: 'res', key: 'res', width: 160 },
  { title: '操作', key: 'action', width: 100, align: 'center' }
];

const handleAddClick = () => {
  if (activeTab.value === 'devices') isDeviceModalOpen.value = true;
  else isPartModalOpen.value = true;
};
</script>

<style scoped>
.device-types-wrapper {
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

.filter-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.filter-actions {
  display: flex;
  align-items: center;
}

.table-outer-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
}

.table-top-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.v2-inner-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.v2-primary-btn {
  border-radius: 6px;
}

.v2-badge {
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

.v2-link {
  color: #1a73e8;
}

.v2-action-links :deep(.ant-btn-link) {
  padding: 0;
}

/* Modal Styling */
.v2-modal-form {
  margin-top: 24px;
}

.v2-info-icon {
  color: #64748b;
}

.v2-internal-section {
  display: flex;
  margin-bottom: 24px;
}

.internal-label {
  width: 16.66%;
  text-align: right;
  padding-right: 8px;
  padding-top: 8px;
  font-weight: 500;
  color: #64748b;
}

/* Specific alignments for parts list */
.is-part-layout .internal-label {
  width: 12.5%;
}

.internal-table-box {
  flex: 1;
}

.textarea-wrapper {
  position: relative;
}

.v2-char-limit {
  position: absolute;
  right: 8px;
  bottom: 4px;
  color: #9403b8;
  font-size: 12px;
}

.v2-form-row {
  margin-bottom: 24px;
}

.v2-label-col {
  text-align: right;
  padding-right: 8px;
  font-weight: 500;
  color: #000;
}

.v2-blue-upload-btn {
  background: #3b82f6;
  border-color: #3b82f6;
  border-radius: 6px;
}

.v2-upload-hint {
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

/* Modal Inner Table Details */
.v2-align-point {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 4px solid #3b82f6;
  margin: 0 auto;
}

.v2-minus-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ff4d4f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto;
  font-size: 16px;
}

.v2-plus-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}

.v2-double-circles {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.v2-invisible-input {
  border: none;
  width: 100%;
  background: transparent;
  outline: none;
}

.v2-res-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.res-mini-input {
  width: 45px;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 0 4px;
}

.xt {
  font-size: 12px;
  color: #999;
}
</style>
