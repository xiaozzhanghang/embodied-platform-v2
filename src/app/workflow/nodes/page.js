'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag, Dropdown, Menu } from 'antd';
import { SearchOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function WorkflowNodes() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const dataSource = [
    { key: '1', name: '视觉识别 (YOLOv8)', type: '感知节点', io: 'RGB -> BBox', version: 'v2.1', status: 'online' },
    { key: '2', name: '力矩反馈监测', type: '感知节点', io: 'ForceSensor -> Array', version: 'v1.4', status: 'online' },
    { key: '3', name: '机械臂路径规划 (MoveIt)', type: '决策计算', io: 'BBox+Target -> Trajectory', version: 'v3.0', status: 'online' },
    { key: '4', name: '五指抓取闭合', type: '执行控制', io: 'Trajectory -> PWM', version: 'v1.0', status: 'maintenance' },
  ];

  const columns = [
    { title: '节点名称/算法模型', dataIndex: 'name', key: 'name', render: text => <span style={{ fontWeight: 600 }}>{text}</span> },
    { 
      title: '算子类型', 
      dataIndex: 'type', 
      key: 'type', 
      render: text => {
        let color = text === '感知节点' ? 'cyan' : text === '决策计算' ? 'blue' : 'purple';
        return <Tag color={color}>{text}</Tag>;
      } 
    },
    { title: 'I/O 形式', dataIndex: 'io', key: 'io', render: text => <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{text}</span> },
    { title: '版本', dataIndex: 'version', key: 'version' },
    { 
      title: '服务状态', 
      dataIndex: 'status', 
      key: 'status',
      render: status => status === 'online' ? <Tag color="success">运行正常</Tag> : <Tag color="warning">维护中</Tag>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space size="small">
          <Button type="text" style={{ color: '#3b82f6' }} icon={<SettingOutlined />}>参数配置</Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a' }}>算子节点管理</Title>
              <p style={{ color: '#64748b', marginTop: 4 }}>管理底层接入模型、算子，用于在工作流画布中作为拖拽组件使用。</p>
            </div>
            <Space>
               <Button type="primary" size="large" icon={<PlusOutlined />}>接入新算子模型</Button>
            </Space>
          </div>

        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px 4px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="算子名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="type" label="算子类型" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择类型" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="服务状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="version" label="版本范围" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入版本" />
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

        <Table rowSelection={{ type: 'checkbox', fixed: 'left' }} scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={{ pageSize: 10 }} />
      </motion.div>
    </MainLayout>
  );
}
