'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SystemTags() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  
  const dataSource = [
    { key: '1', name: '高优先级 (P0)', color: 'red', usage: 24, lastUpdate: '2026-03-10' },
    { key: '2', name: '视觉类算子 (Vision)', color: 'cyan', usage: 8, lastUpdate: '2026-03-09' },
    { key: '3', name: '客户专项 (Client-A)', color: 'purple', usage: 12, lastUpdate: '2026-03-05' },
    { key: '4', name: '待废弃 (Deprecated)', color: 'default', usage: 2, lastUpdate: '2026-03-01' },
  ];

  const columns = [
    { title: '标签全称', dataIndex: 'name', key: 'name', render: text => <span style={{ fontWeight: 600 }}>{text}</span> },
    { 
      title: '视觉呈现', 
      dataIndex: 'color', 
      key: 'color', 
      render: (color, record) => <Tag color={color} style={{ borderRadius: 4 }}>{record.name}</Tag> 
    },
    { title: '关联业务数', dataIndex: 'usage', key: 'usage' },
    { title: '最近更新', dataIndex: 'lastUpdate', key: 'lastUpdate', render: text => <span style={{ color: '#64748b' }}>{text}</span> },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" style={{ color: '#3b82f6', padding: 0 }} icon={<EditOutlined />}>编辑</Button>
          <Button type="text" danger style={{ padding: 0 }} icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a' }}>全局业务标签管理</Title>
              <p style={{ color: '#64748b', marginTop: 4 }}>统管系统中用于各个模块（采集、项目、工作流）打标分类的系统级标签字典。</p>
            </div>
            <Space>
             <Button type="primary" size="large" icon={<PlusOutlined />} style={{ background: '#0C182B', borderRadius: 8 }}>新建标签</Button>
            </Space>
          </div>

        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px 4px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="标签名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入标签全称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="color" label="视觉呈现" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择颜色" />
                </Form.Item>
              </Col>
              
              <Col span={8} style={{ textAlign: 'right', marginBottom: 16 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>搜索</Button>
                  <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
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
