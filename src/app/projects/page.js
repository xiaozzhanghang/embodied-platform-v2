'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Space, Typography, Table, Tag, Button, Input, Dropdown, Menu, Avatar, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  MoreOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CameraOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProjectsManagement() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  
  const projects = [
    { 
      id: 1, 
      name: '通用家政服务大模型 v1.0', 
      code: 'PROJ_HOME_01', 
      desc: '涵盖全屋清洁、收纳整理、餐具清洗等20余项泛化任务的高质量数据集采集与强化学习训练。', 
      progress: 68, 
      status: 'active',
      tasks: 124,
      dataSize: '4.2 TB',
      team: ['Z', 'L', 'W', '+3']
    },
    { 
      id: 2, 
      name: '工业级柔性部件分拣验证', 
      code: 'PROJ_IND_FLEX', 
      desc: '针对 3C 生产线中线缆、胶垫等易形变物体的位姿识别与精确抓取。', 
      progress: 92, 
      status: 'active',
      tasks: 87,
      dataSize: '1.8 TB',
      team: ['H', 'Y']
    },
    { 
      id: 3, 
      name: '四足机器人全地形导航测试', 
      code: 'PROJ_QUAD_NAV', 
      desc: '户外泥地、阶梯、废墟环境下的感知盲区测试与步态鲁棒性数据收集。', 
      progress: 24, 
      status: 'active',
      tasks: 256,
      dataSize: '8.5 TB',
      team: ['D', 'C', 'M']
    },
    { 
      id: 4, 
      name: '零售商品抓取避障模型', 
      code: 'PROJ_RETAIL_12', 
      desc: '无序货架环境中的商品识别、防碰撞路径规划、轻重量物体拿取。', 
      progress: 100, 
      status: 'completed',
      tasks: 45,
      dataSize: '950 GB',
      team: ['K', 'S']
    },
  ];

  const columns = [
    {
      title: '项目名称与编号',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14  } }>{text}</div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4  } }>
            <Tag color={record.status === 'completed' ? 'success' : 'processing'} style={{ border: 'none', margin: 0, marginRight: 8, padding: '0 6px', fontSize: 11  } }>
              {record.status === 'completed' ? '已归档' : '进行中'}
            </Tag>
            {record.code}
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: '项目说明',
      dataIndex: 'desc',
      key: 'desc',
      render: text => <p style={{ color: '#475569', fontSize: 13, margin: 0, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={text}>{text}</p>,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress, record) => (
        <div style={{ minWidth: 100  } }>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8  } }>
            <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden'  } }>
              <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#10b981' : '#3b82f6', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, color: '#475569', width: 32  } }>{progress}%</span>
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: '资产总览',
      key: 'assets',
      render: (_, record) => (
        <Space size="middle" style={{ color: '#64748b', fontSize: 13  } }>
          <Tooltip title="关联具身任务数">
            <span><CameraOutlined /> {record.tasks}</span>
          </Tooltip>
          <Tooltip title="产生的数据资产量">
            <span><AppstoreOutlined /> {record.dataSize}</span>
          </Tooltip>
        </Space>
      ),
      width: 180,
    },
    {
      title: '参与团队',
      key: 'team',
      render: (_, record) => (
        <Avatar.Group size="small" maxCount={3} maxStyle={{ color: '#fff', backgroundColor: '#94a3b8', fontSize: 12  } }>
          {record.team.map((m, i) => (
            m.includes('+') ? null : <Avatar key={i} style={{ backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'][i % 4], fontSize: 12  } }>{m}</Avatar>
          ))}
        </Avatar.Group>
      ),
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown overlay={
          <Menu>
            <Menu.Item key="1">编辑配置</Menu.Item>
            <Menu.Item key="2">导出报表</Menu.Item>
            <Menu.Divider />
            {record.status !== 'completed' && <Menu.Item key="3" danger>结项归档</Menu.Item>}
          </Menu>
        } trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
      width: 80,
      align: 'center',
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24  } }>
            <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 700  } }>项目集合管理</Title>
              <p style={{ margin: '4px 0 0 0', color: '#64748b'  } }>一站式管理所有具身大模型项目的生命周期，从数据采集、质检标注到归档流转。</p>
            </div>
             <Space size="middle">
               <Button type="primary" size="large" icon={<PlusOutlined />}>新建大项目群</Button>
             </Space>
          </div>

        <Card variant="borderless" style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '20px 24px 4px'  } } }>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1  } }>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="项目名称" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="code" label="项目编号" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入编号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="项目状态" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="manager" label="负责人" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入名字" />
                </Form.Item>
              </Col>

              <Col span={expand ? 16 : 24} style={{ textAlign: 'right', marginBottom: 16  } }>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>搜索</Button>
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
            dataSource={projects.map(p => ({ ...p, key: p.id }))}
            pagination={{ pageSize: 10 }}
            rowClassName={() => 'custom-table-row'}
          />

        </motion.div>
    </MainLayout>
  );
}
