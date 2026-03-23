'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag, Dropdown, Menu } from 'antd';
import { SearchOutlined, PlusOutlined, MoreOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function WorkflowList() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();

  const dataSource = [
    { key: '1', name: '标准视觉抓取流', trigger: 'API 触发', nodes: 8, status: 'active', lastRun: '2026-03-11 10:20', successRate: '98.5%' },
    { key: '2', name: '四足巡检避障流', trigger: '定时调度', nodes: 15, status: 'active', lastRun: '2026-03-11 08:00', successRate: '94.2%' },
    { key: '3', name: '桌面清理验证流', trigger: '手动触发', nodes: 5, status: 'draft', lastRun: '--', successRate: '--' },
  ];

  const columns = [
    { title: '工作流名称', dataIndex: 'name', key: 'name', render: text => <span style={{ fontWeight: 600  } }>{text}</span> },
    { title: '触发方式', dataIndex: 'trigger', key: 'trigger', render: text => <Tag color="blue">{text}</Tag> },
    { title: '节点数量', dataIndex: 'nodes', key: 'nodes' },
    { title: '近期成功率', dataIndex: 'successRate', key: 'successRate', render: text => <span style={{ color: '#10b981'  } }>{text}</span> },
    { title: '最后运行', dataIndex: 'lastRun', key: 'lastRun', render: text => <span style={{ color: '#64748b'  } }>{text}</span> },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: status => status === 'active' ? <Tag color="success">已发布</Tag> : <Tag color="default">草稿</Tag>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" style={{ color: '#3b82f6' }} icon={<PlayCircleOutlined />}>运行测试</Button>
          <Dropdown overlay={
            <Menu>
              <Menu.Item key="1">编辑编排</Menu.Item>
              <Menu.Item key="2" danger>删除</Menu.Item>
            </Menu>
          }>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24  } }>
          <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 700  } }>工作流列表</Title>
              <p style={{ color: '#64748b', marginTop: 4  } }>管理机器人的自动化执行逻辑与编排画布，统筹所有任务动作流。</p>
          </div>
          <Space size="middle">
            <Button type="primary" size="large" icon={<PlusOutlined />}>新建工作流</Button>
          </Space>
        </div>

        <Card variant="borderless" style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '20px 24px 4px'  } }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1  } }>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="工作流名称" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="trigger" label="触发方式" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择触发方式" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="状态" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="creator" label="创建人" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入创建人" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="date" label="最后运行" style={{ marginBottom: 16  } }>
                  <Input placeholder="日期范围" />
                </Form.Item>
              </Col>

              <Col span={expand ? 8 : 24} style={{ textAlign: 'right', marginBottom: 16  } }>
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
