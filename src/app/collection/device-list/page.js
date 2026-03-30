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
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  DownOutlined, 
  UpOutlined, 
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  ColumnHeightOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function DeviceList() {
  const [expand, setExpand] = useState(false);
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
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/collection/device-list/${record.key}`}>
            <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          </Link>
          <Link href={`/collection/device-list/${record.key}/edit`}>
            <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          </Link>
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
            <Link href="/collection/device-list/create">
              <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 6 }}>
                新建
              </Button>
            </Link>
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


      </motion.div>
    </MainLayout>
  );
}
