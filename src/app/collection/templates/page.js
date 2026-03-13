'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, DatePicker, Typography, Popconfirm, Modal, Form, Row, Col, Select, Card } from 'antd';
import { motion } from 'framer-motion';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SyncOutlined,
  DownOutlined,
  UpOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function TaskTemplates() {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewStepsRecord, setViewStepsRecord] = useState(null);

  const dataSource = [
    { key: '1', id: '297', name: '线缆整理', type: '格式化步骤', creator: '天奇数采中心', createTime: '2025-01-01 10:00:00', updateTime: '2025-01-02 12:30:00' },
    { key: '2', id: '281', name: '餐具摆放', type: '格式化步骤', creator: '天奇数采中心', createTime: '2025-01-05 09:20:00', updateTime: '2025-01-05 09:20:00' },
    { key: '3', id: '205', name: '桌面清理验证', type: '纯视觉验证', creator: 'AI Agent组', createTime: '2026-02-15 14:10:00', updateTime: '2026-02-18 11:45:00' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '模板名称', dataIndex: 'name', key: 'name', render: text => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '类型', dataIndex: 'type', key: 'type', render: text => <span style={{ color: '#64748b' }}>{text}</span> },
    { 
      title: '模板步骤', 
      key: 'steps',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => setViewStepsRecord(record)}>
          查看步骤
        </Button>
      )
    },
    { title: '创建人', dataIndex: 'creator', key: 'creator' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', render: t => <span style={{ color: '#475569', fontSize: 13 }}>{t}</span> },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', render: t => <span style={{ color: '#475569', fontSize: 13 }}>{t}</span> },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space size="middle">
          <Button type="text" style={{ color: '#3b82f6', padding: 0 }} icon={<EditOutlined />}>编辑</Button>
          <Popconfirm title="确定删除该模板吗？" okText="确定" cancelText="取消">
            <Button type="text" danger style={{ padding: 0 }} icon={<DeleteOutlined />}>删除</Button>
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
                <Form.Item name="name" label="模板名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="id" label="模板ID" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入ID" />
                </Form.Item>
              </Col>
              
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="creator" label="创建人" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入创建人" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="date" label="创建时间" style={{ marginBottom: 16 }}>
                  <RangePicker style={{ width: '100%' }} />
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

        {/* main table block */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="tabs-bar" style={{ padding: '0 24px' }}>
            <div className="tabs-pill">
              <button className="tab-pill active">📋 全部 <span className="tab-count">1,250</span></button>
              <button className="tab-pill">格式化模板</button>
              <button className="tab-pill">视觉模板</button>
            </div>
          </div>

          <div className="toolbar" style={{ padding: '16px 24px' }}>
            <div className="toolbar-left">
              <span className="tbl-title">任务模板列表</span>
            </div>
            <div className="toolbar-right">
              <Button type="primary" icon={<PlusOutlined />} size="small" style={{ background: '#0C182B' }}>添加模板</Button>
              <div className="icon-btn"><ReloadOutlined /></div>
              <div className="icon-btn"><SettingOutlined /></div>
            </div>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 50, textAlign: 'center' }}><input type="checkbox" /></th>
                  <th>ID</th>
                  <th>模板名称</th>
                  <th>类型</th>
                  <th>模板步骤</th>
                  <th>创建人</th>
                  <th>创建时间</th>
                  <th>更新时间</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {dataSource.map((t, idx) => (
                  <tr key={t.key}>
                    <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                    <td>{t.id}</td>
                    <td className="tbl-link">{t.name}</td>
                    <td>{t.type}</td>
                    <td>
                      <Button type="link" size="small" onClick={() => setViewStepsRecord(t)}>查看步骤</Button>
                    </td>
                    <td>{t.creator}</td>
                    <td style={{ fontSize: 12, color: '#666' }}>{t.createTime}</td>
                    <td style={{ fontSize: 12, color: '#666' }}>{t.updateTime}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="act-btns" style={{ justifyContent: 'flex-end' }}>
                        <button className="act-btn">编辑</button>
                        <span className="act-sep">|</span>
                        <button className="act-btn del" style={{ color: '#ff4d4f' }}>删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager" style={{ padding: '12px 24px' }}>
            <span className="pager-info">共 <b>1,250</b> 条数据</span>
            <div className="pager-right">
              <select className="pager-size"><option>20 条/页</option></select>
              <button className="pager-btn" disabled>‹</button>
              <button className="pager-btn cur">1</button>
              <button className="pager-btn">2</button>
              <button className="pager-btn">3</button>
              <button className="pager-btn">›</button>
            </div>
          </div>
        </div>

        <Modal
          title={`查看任务模板步骤: ${viewStepsRecord?.name}`}
          open={!!viewStepsRecord}
          onCancel={() => setViewStepsRecord(null)}
          footer={[<Button key="close" onClick={() => setViewStepsRecord(null)}>关闭</Button>]}
          width={600}
        >
          <div style={{ padding: '20px 0' }}>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 12, borderLeft: '4px solid #3b82f6' }}>
              <strong>步骤一：</strong> 机器人导航至操作台面
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 12, borderLeft: '4px solid #3b82f6' }}>
              <strong>步骤二：</strong> 识别目标物体并预估姿态
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, borderLeft: '4px solid #3b82f6' }}>
              <strong>步骤三：</strong> 执行精确抓取并反馈力控数据
            </div>
          </div>
        </Modal>
      </motion.div>
    </MainLayout>
  );
}
