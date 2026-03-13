'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Tabs, 
  Modal, 
  Form, 
  Select, 
  Typography, 
  Upload, 
  Tag, 
  Card,
  Row,
  Col,
  Tooltip,
  Divider
} from 'antd';
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
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { TextArea } = Input;
const { Text, Title } = Typography;

export default function DeviceTypes() {
  const [activeTab, setActiveTab] = useState('devices');
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [expandFilter, setExpandFilter] = useState(false);

  // Mock Data
  const deviceData = [
    { key: '1', name: 'galbot_2.2_RGB', enName: 'galbot_2.2', version: 'V2.2', desc: '预置 galbot V2.2 机器人配套 RGB 相机模块', urdf: 'galbot_v2.urdf', image: '无图片', regDate: '2025-12-20', status: 'enabled' },
    { key: '2', name: 'galbot_2.2_深度', enName: 'galbot_2.2.1', version: 'V2.2.1', desc: '预置 galbot V2.2 机器人配套深度相机模块', urdf: 'galbot_v2_depth.urdf', image: '无图片', regDate: '2025-12-19', status: 'enabled' },
    { key: '3', name: 'galbot_2.2_红外', enName: 'galbot_2.2_IR', version: 'V2.2', desc: '预置 galbot V2.2 机器人配套红外传感器模块', urdf: 'galbot_v2_ir.urdf', image: '无图片', regDate: '2025-12-19', status: 'disabled' },
  ];

  const partData = [
    { key: '1', name: '灵巧手_右', enName: 'LingQiaoShou_Right', version: 'G1.0', desc: '五指驱动灵巧采集手', urdf: 'hand_r.urdf', image: '无图片', regDate: '2025-12-20', stat: 'enabled' },
    { key: '2', name: '夹爪_右', enName: 'JiaZhao_Right', version: 'C2.1', desc: '工业级平行夹爪', urdf: 'gripper_r.urdf', image: '无图片', regDate: '2025-12-20', stat: 'enabled' },
  ];

  const deviceColumns = [
    { title: '机器人名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 180 },
    { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
    { title: '版本', dataIndex: 'version', key: 'version', width: 100 },
    { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 180, render: (t) => t ? <a style={{ color: '#1a73e8' }}>{t}</a> : '-' },
    { 
      title: '传感器描述', 
      dataIndex: 'desc', 
      key: 'desc', 
      ellipsis: true,
      render: (t) => <Tooltip title={t}><span style={{ color: '#666' }}>{t}</span></Tooltip>
    },
    { title: '注册时间', dataIndex: 'regDate', key: 'regDate', width: 150 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (s) => (
        <span className={`status-badge ${s === 'enabled' ? 'status-success' : 'status-default'}`}>
          {s === 'enabled' ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: () => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<StopOutlined />}>禁用</Button>
        </Space>
      ),
    },
  ];

  const partColumns = [
    { title: '部件名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 150 },
    { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
    { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 180, render: (t) => t ? <a style={{ color: '#1a73e8' }}>{t}</a> : '-' },
    { title: '注册时间', dataIndex: 'regDate', key: 'regDate', width: 150 },
    { 
      title: '状态', 
      dataIndex: 'stat', 
      key: 'stat', 
      width: 100,
      render: (s) => (
        <span className={`status-badge ${s === 'enabled' ? 'status-success' : 'status-default'}`}>
          {s === 'enabled' ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: () => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<StopOutlined />}>禁用</Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'devices', label: '机器人设备' },
    { key: 'parts', label: '机器人部件' },
  ];

  const handleAdd = () => {
    if (activeTab === 'devices') setIsDeviceModalOpen(true);
    else setIsPartModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="page-header">
        <Title level={4} className="page-header-title">设备类型管理</Title>
        <Text type="secondary" className="page-header-desc">统一管理机器人设备及其组成部件的类型定义与URDF配置</Text>
      </div>

      {/* Collapsible Filter Section */}
      <Card className="search-form" bordered={false}>
        <Form layout="horizontal">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="设备名称">
                <Input placeholder="请输入设备名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="版本号">
                <Input placeholder="请输入版本号" allowClear />
              </Form.Item>
            </Col>
            <AnimatePresence>
              {expandFilter && (
                <>
                  <Col span={8}>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <Form.Item label="状态">
                        <Select placeholder="请选择状态" allowClear>
                          <Select.Option value="enabled">启用</Select.Option>
                          <Select.Option value="disabled">禁用</Select.Option>
                        </Select>
                      </Form.Item>
                    </motion.div>
                  </Col>
                </>
              )}
            </AnimatePresence>
            <Col span={expandFilter ? 24 : 8} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                <Button icon={<SyncOutlined />}>重置</Button>
                <Button type="link" onClick={() => setExpandFilter(!expandFilter)} style={{ fontSize: 13 }}>
                  {expandFilter ? '收起' : '展开'} {expandFilter ? <UpOutlined /> : <DownOutlined />}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            items={tabItems} 
            type="card"
            style={{ marginBottom: 0 }} 
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加{activeTab === 'devices' ? '设备' : '部件'}
          </Button>
        </div>

        <Table 
          rowSelection={{ type: 'checkbox', fixed: 'left' }}
          scroll={{ x: 'max-content' }}
          columns={activeTab === 'devices' ? deviceColumns : partColumns} 
          dataSource={activeTab === 'devices' ? deviceData : partData} 
          pagination={{ 
            total: activeTab === 'devices' ? deviceData.length : partData.length, 
            showSizeChanger: true, 
            showQuickJumper: true, 
            showTotal: (t) => `共 ${t} 条` 
          }}
        />

        {/* Device Modal */}
        <Modal 
          title={<Space><PlusOutlined />添加机器人设备</Space>} 
          open={isDeviceModalOpen} 
          onCancel={() => setIsDeviceModalOpen(false)} 
          width={800}
          okText="确定"
          cancelText="取消"
          centered
        >
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="机器人名称" required>
                  <Input placeholder="请输入机器人名称" maxLength={50} showCount />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span>英文名称 <Tooltip title="系统内部唯一标识"><InfoCircleOutlined /></Tooltip></span>}>
                  <Input placeholder="请输入英文名称" maxLength={50} showCount />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="机器人版本" required>
                  <Input placeholder="例如: V1.0.1" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="关联部件">
                  <Select placeholder="选择已有部件" mode="multiple" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item label="传感器及其它详细描述" required>
              <TextArea rows={4} placeholder="描述机器人核心传感器规格、作业半径等参数..." />
            </Form.Item>

            <Form.Item label="URDF 配置文件">
              <Upload.Dragger multiple={false} accept=".urdf">
                <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                <p className="ant-upload-text">点击或将文件拖拽到此处上传</p>
                <p className="ant-upload-hint">支持 .urdf 格式，单文件不超过 10MB</p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item label="设备外观图片">
              <Upload listType="picture-card" maxCount={5}>
                <div><PlusOutlined /><div style={{ marginTop: 8 }}>上传</div></div>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Part Modal */}
        <Modal 
          title={<Space><PlusOutlined />添加机器人部件</Space>} 
          open={isPartModalOpen} 
          onCancel={() => setIsPartModalOpen(false)} 
          width={900}
          okText="确定"
          cancelText="取消"
          centered
        >
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="部件名称" required>
                  <Input placeholder="请输入部件名称" maxLength={50} showCount />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="英文名称" required>
                  <Input placeholder="请输入系统英文标识" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="部件类型" required>
                  <Select placeholder="请选择类型">
                    <Select.Option value="hand">手部</Select.Option>
                    <Select.Option value="head">头部</Select.Option>
                    <Select.Option value="base">底盘</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="部件品牌">
                  <Input placeholder="请输入生产商品牌" />
                </Form.Item>
              </Col>
            </Row>
            
            <Divider orientation="left" plain><Text type="secondary" style={{ fontSize: 13 }}>Topic 配置元件</Text></Divider>
            
            <Table 
              dataSource={[{ key: 1, seq: 1, name: '', enName: '', topic: '', sign: '', res: '' }]}
              pagination={false}
              size="small"
              bordered
              columns={[
                { title: '序号', dataIndex: 'seq', width: 60 },
                { title: 'Topic名称', render: () => <Input size="small" placeholder="名称" /> },
                { title: '英文名', render: () => <Input size="small" placeholder="EN" /> },
                { title: 'Topic URL', render: () => <Input size="small" placeholder="/topic/..." /> },
                { title: '操作', width: 80, render: () => <Button type="text" danger icon={<PlusOutlined style={{transform: 'rotate(45deg)'}}/>} /> }
              ]}
            />

            <Form.Item label="功能描述" style={{ marginTop: 24 }}>
              <TextArea rows={3} placeholder="详述部件核心功能..." />
            </Form.Item>

            <Form.Item label="URDF / Mesh 资源">
              <Upload>
                <Button icon={<UploadOutlined />}>选择资源压缩包</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

      </motion.div>
    </MainLayout>
  );
}
