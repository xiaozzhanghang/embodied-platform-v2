'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag, Progress, Avatar } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, BarChartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AnnotationProjects() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();

  const dataSource = [
    { key: '1', name: '桌面物品 3D 包围盒标注', type: '3D 点云处理', progress: 85, annotators: 5, status: 'doing' },
    { key: '2', name: '厨房水槽场景 2D 分割', type: '2D 图像语义', progress: 100, annotators: 3, status: 'done' },
    { key: '3', name: '关节力矩与动作状态对齐', type: '多模态时序', progress: 42, annotators: 8, status: 'doing' },
  ];

  const columns = [
    { title: '标注项目名称', dataIndex: 'name', key: 'name', render: text => <span style={{ fontWeight: 600 }}>{text}</span> },
    { title: '标注类型', dataIndex: 'type', key: 'type', render: text => <Tag color="blue">{text}</Tag> },
    { 
      title: '整体进度', 
      dataIndex: 'progress', 
      key: 'progress',
      render: p => <Progress percent={p} size="small" strokeColor={p === 100 ? '#10b981' : '#3b82f6'} style={{ width: 150 }} />
    },
    { 
      title: '参与人数', 
      dataIndex: 'annotators', 
      key: 'annotators',
      render: n => (
        <Avatar.Group size="small" maxCount={3} maxStyle={{ color: '#fff', backgroundColor: '#94a3b8' }}>
          {Array.from({ length: n }).map((_, i) => <Avatar key={i} style={{ backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'][i % 3] }} />)}
        </Avatar.Group>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: s => s === 'doing' ? <Tag color="processing">进行中</Tag> : <Tag color="success">已结项</Tag>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space size="middle">
          <Button type="text" style={{ color: '#3b82f6', padding: 0 }} icon={<BarChartOutlined />}>统计数据</Button>
          <Button type="text" style={{ padding: 0 }} icon={<EditOutlined />}>管理</Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#0f172a' }}>标注项目管理</Title>
            <p style={{ color: '#64748b', marginTop: 4 }}>管理所有发起的具身数据结构化目标项目，分配人员与标准。</p>
          </div>
          <Space>
            <Button type="primary" size="large" icon={<PlusOutlined />} style={{ background: '#0C182B', borderRadius: 8 }}>新建标注项目</Button>
          </Space>
        </div>

        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px 4px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="项目名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="type" label="标注类型" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择标注类型" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="项目状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择项目状态" />
                </Form.Item>
              </Col>
              
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="creator" label="创建人" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入创建人" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="time" label="创建时间" style={{ marginBottom: 16 }}>
                  <Input placeholder="请选择时间范围" />
                </Form.Item>
              </Col>

              <Col span={expand ? 8 : 24} style={{ textAlign: 'right', marginBottom: 16 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
                  <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
                  <span style={{ fontSize: 14, color: '#1677ff', cursor: 'pointer', marginLeft: 8 }} onClick={() => setExpand(!expand)}>
                    {expand ? <>收起 <UpOutlined style={{ fontSize: 12 }} /></> : <>展开 <DownOutlined style={{ fontSize: 12 }} /></>}
                  </span>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <Table rowSelection={{ type: 'checkbox', fixed: 'left' }} scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} />
      </motion.div>
    </MainLayout>
  );
}
