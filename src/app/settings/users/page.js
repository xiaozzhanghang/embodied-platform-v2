'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Avatar, Space, Typography, Tag, Button } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card, Input } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SystemUsers() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const dataSource = [
    { key: '1', name: 'Admin', role: '超级管理员', email: 'admin@galbot.com', lastLogin: '2026-03-11 12:45', status: 'active' },
    { key: '2', name: 'Test User A', role: '标注员', email: 'annotator_a@galbot.com', lastLogin: '2026-03-10 18:22', status: 'active' },
    { key: '3', name: 'Dev Ops B', role: '硬件运维', email: 'ops@galbot.com', lastLogin: '2026-03-09 09:12', status: 'disabled' },
  ];

  const columns = [
    {
      title: '用户信息',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar size="default" style={{ backgroundColor: record.role === '超级管理员' ? '#ef4444' : '#3b82f6'  } }>{text.charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 600  } }>{text}</div>
            <div style={{ color: '#64748b', fontSize: 13  } }>{record.email}</div>
          </div>
        </Space>
      )
    },
    { 
      title: '系统角色', 
      dataIndex: 'role', 
      key: 'role', 
      render: role => <Tag color={role === '超级管理员' ? 'red' : role === '硬件运维' ? 'orange' : 'blue'}>{role}</Tag> 
    },
    { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin' },
    { 
      title: '账号状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: status => status === 'active' ? <Tag color="success">正常访问</Tag> : <Tag color="default">已冻结</Tag> 
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} style={{ color: '#3b82f6'  } }>配置权限</Button>
          <Button type="text" danger icon={<DeleteOutlined />}>注销</Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24  } }>
          <div>
            <Title level={3} style={{ margin: 0, color: '#0f172a'  } }>系统成员与角色权限</Title>
          </div>
          <Button type="primary" size="large" style={{ background: '#0C182B', borderRadius: 8  } }>邀请新成员</Button>
        </div>

        <Card variant="borderless" style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '20px 24px 4px'  } } }>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1  } }>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="用户名称" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="role" label="系统角色" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择角色" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="账号状态" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="email" label="电子邮箱" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>

              <Col span={expand ? 16 : 24} style={{ textAlign: 'right', marginBottom: 16  } }>
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
        <Table rowSelection={{ type: 'checkbox', fixed: 'left' }} scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} />
      </motion.div>
    </MainLayout>
  );
}
