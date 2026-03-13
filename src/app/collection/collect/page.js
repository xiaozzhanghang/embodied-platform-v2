'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Tag, Input, Typography, Dropdown, Menu, Avatar } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  MoreOutlined,
  CalendarOutlined,
  GlobalOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card, DatePicker } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function TaskManagement() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dataSource = Array.from({ length: 12 }).map((_, i) => ({
    key: i.toString(),
    taskName: `厨房拣选泛化采集_v${i+1}`,
    taskId: `TSK-10${24+i}`,
    project: '通用家政大模型 v1.0',
    scene: '模拟厨房',
    operator: i % 2 === 0 ? '张三 (Zhang San)' : 'Alice Smith',
    status: i === 0 ? 'running' : i === 1 ? 'draft' : i % 3 === 0 ? 'failed' : 'completed',
    date: `2026-03-${String(10 - (i % 5)).padStart(2, '0')}`,
    progress: Math.floor(Math.random() * 100),
  }));

  const columns = [
    {
      title: '任务名称与ID',
      dataIndex: 'taskName',
      key: 'taskName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{text}</div>
          <div style={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Tag color="cyan" style={{ margin: 0, padding: '0 4px', fontSize: 11, border: 'none' }}>{record.taskId}</Tag>
            <span>{record.project}</span>
          </div>
        </div>
      ),
    },
    {
      title: '指定采集场景',
      dataIndex: 'scene',
      key: 'scene',
      render: t => <span style={{ color: '#475569' }}><GlobalOutlined style={{ marginRight: 6 }} />{t}</span>
    },
    {
      title: '执行人员',
      dataIndex: 'operator',
      key: 'operator',
      render: t => (
        <Space>
           <Avatar size="small" style={{ backgroundColor: '#0284c7' }}>{t.charAt(0)}</Avatar>
           <span style={{ color: '#334155' }}>{t}</span>
        </Space>
      )
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      render: (s, record) => {
        const conf = {
          draft: { color: 'default', text: '草稿/排队中' },
          running: { color: 'processing', text: `执行中 (${record.progress}%)` },
          completed: { color: 'success', text: '已完成收录' },
          failed: { color: 'error', text: '设备故障脱机' }
        };
        return <Tag color={conf[s].color} style={{ borderRadius: 4 }}>{conf[s].text}</Tag>;
      }
    },
    {
      title: '计划时间',
      dataIndex: 'date',
      key: 'date',
      render: t => <span style={{ color: '#64748b', fontSize: 13 }}><CalendarOutlined style={{ marginRight: 6 }}/>{t}</span>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space size="small">
          <Button type="text" style={{ color: '#3b82f6' }}>监控</Button>
          <Button type="text" style={{ color: '#3b82f6' }}>详情</Button>
          <Dropdown overlay={
            <Menu>
              <Menu.Item key="1">复制任务策略</Menu.Item>
              <Menu.Item key="2" danger>终止该任务</Menu.Item>
            </Menu>
          } trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>具身采集任务列表</Title>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 13 }}>全局管理需要下发给机器人的采集指令，追踪真机执行状态与进度。</p>
          </div>
          <Space>
            <Button size="large" icon={<SettingOutlined />}>批量操作</Button>
            <Button href="/workflow" type="primary" size="large" icon={<PlusOutlined />} style={{ background: '#0C182B' }}>
              去配置新任务 (V2)
            </Button>
          </Space>
        </div>
        
        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px 4px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="任务名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入任务名称/ID" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="project" label="所属项目" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择项目" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="运行状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="operator" label="执行人员" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入人员姓名" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="scene" label="指定场景" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择场景" />
                </Form.Item>
              </Col>

              <Col span={expand ? 8 : 24} style={{ textAlign: 'right', marginBottom: 16 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>检索</Button>
                  <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
                  <span style={{ fontSize: 14, color: '#1677ff', cursor: 'pointer', marginLeft: 8 }} onClick={() => setExpand(!expand)}>
                    {expand ? <>收起 <UpOutlined style={{ fontSize: 12 }} /></> : <>展开 <DownOutlined style={{ fontSize: 12 }} /></>}
                  </span>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <Table 
          rowSelection={{ type: 'checkbox', fixed: 'left' }}
          scroll={{ x: 'max-content' }}
          columns={columns} 
          dataSource={dataSource} 
          pagination={{ pageSize: 10, align: 'center' }} 
          rowClassName={() => 'custom-table-row'}
          style={{ borderTop: '1px solid #f1f5f9' }}
        />
      </motion.div>
      <style>{`
        .custom-table-row:hover > td { background-color: #f8fafc !important; }
        .ant-table-thead > tr > th { background: transparent !important; color: #475569; font-weight: 600; }
      `}</style>
    </MainLayout>
  );
}
