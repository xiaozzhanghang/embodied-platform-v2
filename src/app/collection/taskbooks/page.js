'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag, Popconfirm, Form, Row, Col, Select, Card } from 'antd';
import { motion } from 'framer-motion';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined,
  StopOutlined,
  SyncOutlined,
  DownOutlined,
  UpOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title } = Typography;

export default function Taskbooks() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const dataSource = [
    { key: '1', name: '采集任务书', code: 'tianqi001', en: 'caijirenwushu', link: 'https://collect.galbot.com/collection/taskbook', status: 'enabled' },
    { key: '2', name: '全屋清洁指引', code: 'tianqi002', en: 'house_cleaning_guideline', link: 'https://collect.galbot.com/collection/taskbook/2', status: 'disabled' },
  ];

  const columns = [
    { title: '任务书名称', dataIndex: 'name', key: 'name', render: text => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '任务书编号', dataIndex: 'code', key: 'code', render: text => <span style={{ color: '#475569' }}>{text}</span> },
    { title: '英文名称', dataIndex: 'en', key: 'en', render: text => <span style={{ color: '#475569' }}>{text}</span> },
    { 
      title: '任务书链接', 
      dataIndex: 'link', 
      key: 'link',
      render: text => <a href={text} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>{text}</a>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: status => (
        status === 'enabled' 
          ? <Tag color="success" style={{ padding: '0 8px', borderRadius: 4 }}>启用</Tag> 
          : <Tag color="default" style={{ padding: '0 8px', borderRadius: 4 }}>禁用</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" style={{ color: '#3b82f6', padding: 0 }} icon={<EditOutlined />}>编辑</Button>
          <Popconfirm title={`确定${record.status === 'enabled' ? '禁用' : '启用'}该任务书吗？`} okText="确定" cancelText="取消">
            <Button type="text" style={{ color: record.status === 'enabled' ? '#ef4444' : '#10b981', padding: 0 }} icon={<StopOutlined />}>
              {record.status === 'enabled' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: 0 }}>
        
        {/* filter-card */}
        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '24px 24px 8px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="任务书名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="code" label="任务书编号" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入编号" />
                </Form.Item>
              </Col>
              
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="status" label="状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="creator" label="创建人" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入创建人" />
                </Form.Item>
              </Col>

              <Col span={expand ? 16 : 8} style={{ textAlign: 'right', marginBottom: 16 }}>
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

        {/* main card content */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="tabs-bar" style={{ padding: '0 24px' }}>
            <div className="tabs-pill">
              <button className="tab-pill active">📋 全部</button>
              <button className="tab-pill">已启用</button>
              <button className="tab-pill">已禁用</button>
            </div>
          </div>

          <div className="toolbar" style={{ padding: '16px 24px' }}>
            <div className="toolbar-left">
              <span className="tbl-title">任务书列表</span>
            </div>
            <div className="toolbar-right">
              <Button type="primary" icon={<PlusOutlined />} size="small" style={{ background: '#0C182B' }}>添加任务书</Button>
              <div className="icon-btn"><ReloadOutlined /></div>
              <div className="icon-btn"><SettingOutlined /></div>
            </div>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 50, textAlign: 'center' }}><input type="checkbox" /></th>
                  <th>任务书名称</th>
                  <th>任务书编号</th>
                  <th>英文名称</th>
                  <th>任务书链接</th>
                  <th>状态</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {dataSource.map((t, idx) => (
                  <tr key={t.key}>
                    <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                    <td className="tbl-link">{t.name}</td>
                    <td>{t.code}</td>
                    <td>{t.en}</td>
                    <td><a href={t.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>{t.link}</a></td>
                    <td>
                      {t.status === 'enabled' 
                        ? <Tag color="success" style={{ padding: '0 8px', borderRadius: 4 }}>启用</Tag> 
                        : <Tag color="default" style={{ padding: '0 8px', borderRadius: 4 }}>禁用</Tag>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="act-btns" style={{ justifyContent: 'flex-end' }}>
                        <button className="act-btn">编辑</button>
                        <span className="act-sep">|</span>
                        <button className="act-btn" style={{ color: t.status === 'enabled' ? '#ef4444' : '#10b981' }}>
                          {t.status === 'enabled' ? '禁用' : '启用'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager" style={{ padding: '12px 24px' }}>
            <span className="pager-info">共 <b>{dataSource.length}</b> 条数据</span>
            <div className="pager-right">
              <select className="pager-size"><option>20 条/页</option></select>
              <button className="pager-btn" disabled>‹</button>
              <button className="pager-btn cur">1</button>
              <button className="pager-btn">›</button>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
