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
  Modal
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
  InfoCircleOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

export default function DeviceList() {
  const [expand, setExpand] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
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

      {/* Redesigned Filter Section */}
      <Card className="search-form" bordered={false}>
        <Form form={form} layout="horizontal">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="name" label="设备名称">
                <Input placeholder="请输入设备名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="id" label="设备编号">
                <Input placeholder="请输入设备编号" allowClear />
              </Form.Item>
            </Col>
            <AnimatePresence>
              {!expand ? (
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
                    <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
                    <Button type="link" onClick={() => setExpand(!expand)} style={{ fontSize: 13 }}>
                      展开 <DownOutlined />
                    </Button>
                  </Space>
                </Col>
              ) : null}
            </AnimatePresence>
          </Row>
          
          <AnimatePresence>
            {expand && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item name="status" label="设备状态">
                      <Select placeholder="请选择状态" allowClear>
                        <Select.Option value="enabled">启用</Select.Option>
                        <Select.Option value="disabled">禁用</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="regDate" label="注册时间">
                      <Input placeholder="请点击选择日期范围" />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Space>
                      <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
                      <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
                      <Button type="link" onClick={() => setExpand(!expand)} style={{ fontSize: 13 }}>
                        收起 <UpOutlined />
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </motion.div>
            )}
          </AnimatePresence>
        </Form>
      </Card>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={5} style={{ margin: 0 }}>设备实例列表</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            添加设备
          </Button>
        </div>

        <Table 
          rowSelection={{ type: 'checkbox', fixed: 'left' }}
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

        {/* Add Device Modal */}
        <Modal 
          title={<Space><PlusOutlined />添加新设备实例</Space>} 
          open={isModalOpen} 
          onCancel={() => setIsModalOpen(false)} 
          width={650}
          okText="创建"
          cancelText="取消"
          centered
        >
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="选择设备类型" required extra="设备实例必须基于已定义的设备类型创建">
              <Select placeholder="请选择上层设备类型">
                <Select.Option value="1">galbot_2.2_RGB</Select.Option>
                <Select.Option value="2">galbot_2.2_深度</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="实例名称 / 编号" required>
              <Input placeholder="例如: R1-HEAD-CAMERA-01" maxLength={50} showCount />
            </Form.Item>
            <Form.Item label="备注信息">
              <Input.TextArea rows={3} placeholder="选填，例如: 放置于3号实验室" />
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </MainLayout>
  );
}
