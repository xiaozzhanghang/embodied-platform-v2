'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Typography, 
  Tag, 
  Form, 
  Row, 
  Col, 
  Select, 
  Card, 
  Tooltip,
  Modal,
  Upload,
  Dropdown,
  Menu
} from 'antd';
import { 
  SearchOutlined, 
  SyncOutlined, 
  PlusOutlined, 
  DownOutlined, 
  UpOutlined, 
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  EllipsisOutlined,
  ColumnHeightOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

export default function DeviceList() {
  const [expand, setExpand] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  const data = Array.from({ length: 10 }).map((_, i) => ({
    key: i.toString(),
    name: `R001GBDDAAAE08${10 + i}`,
    enName: 'R001GBDDAAA...',
    id: `DEV-B-10${i}`,
    urdf: i % 3 === 0 ? 'galbot_v2.urdf' : '-',
    image: '无图片',
    regDate: '2026-02-25 16:13:55',
    activeDate: '2026-02-25 16:13:55',
    status: i % 4 === 0 ? 'disabled' : 'enabled'
  }));

  const columns = [
    { title: '设备名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 200 },
    { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
    { 
      title: '设备编号', 
      dataIndex: 'id', 
      key: 'id', 
      width: 150,
      render: (t) => <Text code>{t}</Text>
    },
    { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 150, render: (t) => t !== '-' ? <a style={{ color: '#1a73e8' }}>{t}</a> : '-' },
    { title: '设备图片', dataIndex: 'image', key: 'image', width: 120, render: text => <span style={{ color: '#aaa' }}>{text}</span> },
    { title: '注册时间', dataIndex: 'regDate', key: 'regDate', width: 180 },
    { title: '活跃时间', dataIndex: 'activeDate', key: 'activeDate', width: 180 },
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

  return (
    <MainLayout>
      <div className="page-header">
        <Title level={4} className="page-header-title">设备列表</Title>
        <Text type="secondary" className="page-header-desc">查看和管理所有已注册的机器人设备实例及其运行状态</Text>
      </div>

      {/* ProTable Style Search Section */}
      <Card className="search-form" variant="borderless" styles={{ body: { padding: '24px 24px' } }} style={{ marginBottom: 16 }}>
        <Form form={form} layout="horizontal" labelCol={{ flex: '80px' }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="name" label="设备名称" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="id" label="设备编号" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={6}>
                  <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="enabled">启用</Select.Option>
                      <Select.Option value="disabled">禁用</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={expand ? 6 : 12} style={{ textAlign: 'right' }}>
              <Form.Item label=" " colon={false} style={{ marginBottom: 0 }}>
                <Space size="middle">
                  <Button onClick={() => form.resetFields()}>重置</Button>
                  <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                  <Button type="link" onClick={() => setExpand(!expand)} style={{ fontSize: 14, padding: 0 }}>
                    {expand ? '收起' : '展开'} {expand ? <UpOutlined /> : <DownOutlined />}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="v2-global-card">
        {/* ProTable Toolbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '4px 0 16px',
          marginBottom: 8 
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.88)' }}>设备实例列表</div>
          <Space size="middle">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ borderRadius: 6 }}>
              新建
            </Button>
            <Space size={12} style={{ marginLeft: 8, color: 'rgba(0,0,0,0.45)', fontSize: 16 }}>
              <Tooltip title="刷新"><ReloadOutlined style={{ cursor: 'pointer' }} /></Tooltip>
              <Tooltip title="密度"><ColumnHeightOutlined style={{ cursor: 'pointer' }} /></Tooltip>
              <Tooltip title="列设置"><SettingOutlined style={{ cursor: 'pointer' }} /></Tooltip>
            </Space>
          </Space>
        </div>

        {/* Batch Operations (Smooth Overlay) */}
        <AnimatePresence>
          {selectedRowKeys.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ 
                position: 'relative',
                zIndex: 10,
                marginBottom: 16
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 24px', 
                background: '#fff', 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <Space size="middle">
                  <span style={{ fontSize: 14, color: '#64748b' }}>已选 {selectedRowKeys.length} 项</span>
                  <Button type="link" onClick={() => setSelectedRowKeys([])} style={{ padding: 0 }}>取消</Button>
                </Space>
                <Space size="middle">
                  <Button danger style={{ borderColor: '#ef4444', color: '#ef4444', borderRadius: 6 }}>批量禁用</Button>
                </Space>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Table 
          rowSelection={rowSelection}
          scroll={{ x: 'max-content' }}
          columns={columns} 
          dataSource={data} 
          pagination={{ 
            total: 32, 
            showSizeChanger: true, 
            showQuickJumper: true, 
            showTotal: (t) => `共 ${t} 条` 
          }}
        />

        {/* Add Device Modal (Fig 3) */}
        <Modal 
          title="添加设备" 
          open={isModalOpen} 
          onCancel={() => setIsModalOpen(false)} 
          width={650}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)} style={{ borderRadius: 6 }}>取消</Button>,
            <Button key="ok" type="primary" onClick={() => setIsModalOpen(false)} style={{ borderRadius: 6, background: '#3b82f6' }}>确定</Button>
          ]}
          centered
          closeIcon={<span style={{ color: '#64748b', fontSize: 20 }}>×</span>}
        >
          <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} style={{ marginTop: 24 }}>
            <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 设备名称</span>} colon={false}>
              <Input placeholder="请输入设备名称" suffix="0 / 50" style={{ borderRadius: 6 }} />
            </Form.Item>
            
            <Form.Item label={<span style={{ fontWeight: 500 }}>英文名称 <Tooltip title="System ID"><InfoCircleOutlined style={{ color: '#64748b' }} /></Tooltip></span>} colon={false}>
              <Input placeholder="请输入英文名称" suffix="0 / 50" style={{ borderRadius: 6 }} />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 设备编号</span>} colon={false}>
              <Input placeholder="请输入设备编号" suffix="0 / 50" style={{ borderRadius: 6 }} />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 设备类型</span>} colon={false}>
              <Select placeholder="请选择设备类型" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 500 }}>URDF</span>} colon={false}>
              <Space size="middle">
                <Button type="primary" icon={<UploadOutlined />} style={{ borderRadius: 6, background: '#3b82f6' }}>上传URDF文件</Button>
                <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>可上传最多1份urdf格式的文件</Text>
              </Space>
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 500 }}>设备图片</span>} colon={false}>
              <div>
                <Upload listType="picture-card" showUploadList={false}>
                  <div style={{ color: '#94a3b8' }}>
                    <PlusOutlined style={{ fontSize: 24 }} />
                  </div>
                </Upload>
                <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 12 }}>
                  可上传最多5张单个不超过2MB且格式为jpg/jpeg/png/gif的图片
                </div>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </MainLayout>
  );
}
