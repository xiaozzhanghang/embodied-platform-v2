'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, PlaySquareOutlined, CodeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function WorkflowTasks() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const dataSource = [
    { key: '1', name: '清空抓取台', desc: '控制机械臂将当前台面所有识别物体推入回收槽', language: 'Python/ROS', uses: 845, status: 'active' },
    { key: '2', name: '紧急刹车复位', desc: '多关节安全锁死并缓慢返回初始零点姿态', language: 'C++', uses: 120, status: 'active' },
    { key: '3', name: '随机扰动测试', desc: '对基座注入高频微小随机位移，用于步态鲁棒性验证', language: 'Python', uses: 34, status: 'beta' },
  ];

  const columns = [
    { 
      title: '预设工具 / 脚本名称', 
      dataIndex: 'name', 
      key: 'name',
      render: (text, record) => (
        <Space>
          <CodeOutlined style={{ color: '#94a3b8' }} />
          <span style={{ fontWeight: 600 }}>{text}</span>
          {record.status === 'beta' && <Tag color="warning" style={{ margin: 0, padding: '0 4px', fontSize: 11 }}>BETA</Tag>}
        </Space>
      )
    },
    { title: '工具详情与作用', dataIndex: 'desc', key: 'desc', render: text => <span style={{ color: '#64748b' }}>{text}</span> },
    { title: '运行环境', dataIndex: 'language', key: 'language', render: text => <Tag color="default">{text}</Tag> },
    { title: '全局调用次数', dataIndex: 'uses', key: 'uses' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space size="middle">
          <Button type="text" style={{ color: '#3b82f6', padding: 0 }} icon={<PlaySquareOutlined />}>试运行</Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a' }}>工作流预设工具库</Title>
              <p style={{ color: '#64748b', marginTop: 4 }}>开箱即用的高频机器人动作脚本，可直接插入工作流使用。</p>
            </div>
            <Space>
               <Button type="primary" size="large" icon={<PlusOutlined />}>编写新脚本</Button>
            </Space>
          </div>

        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px 4px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="工具名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="language" label="运行环境" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择环境" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="creator" label="创建人" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入创建人" />
                </Form.Item>
              </Col>

              <Col span={expand ? 16 : 24} style={{ textAlign: 'right', marginBottom: 16 }}>
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
