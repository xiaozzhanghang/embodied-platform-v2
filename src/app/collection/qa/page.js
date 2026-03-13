'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card, Input, Button, Space, Typography } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

export default function QualityInspectionDashboard() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  const qaData = [
    { id: 'D20240301001', name: '餐具摆放', device: 'galbot_001', time: '2026-03-01 10:23', duration: '2m 34s', status: 'pending', inspector: '—', inspectTime: '—' },
    { id: 'D20240301002', name: '餐具摆放', device: 'galbot_001', time: '2026-03-01 10:28', duration: '1m 58s', status: 'done', inspector: '张三', inspectTime: '2026-03-02' },
    { id: 'D20240301003', name: '商业采集', device: 'galbot_002', time: '2026-03-01 11:05', duration: '3m 12s', status: 'done', inspector: '李四', inspectTime: '2026-03-02' },
    { id: 'D20240301004', name: '商业采集', device: 'galbot_002', time: '2026-03-01 11:22', duration: '2m 45s', status: 'error', inspector: '王五', inspectTime: '2026-03-02' },
    { id: 'D20240301005', name: '物品整理', device: 'galbot_003', time: '2026-03-01 14:30', duration: '1m 20s', status: 'pending', inspector: '—', inspectTime: '—' },
  ];

  const sMap = {
    done: { l: '已通过', c: 'tag-done' },
    running: { l: '待复检', c: 'tag-running' },
    error: { l: '已拒绝', c: 'tag-error' },
    pending: { l: '待质检', c: 'tag-pending' }
  };

  const filteredData = qaData.filter(t => activeTab === 'all' || t.status === activeTab);

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: 0 }}>
        
        {/* filter-card */}
        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '24px 24px 8px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="任务名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入任务名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="质检状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态">
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="pending">待质检</Select.Option>
                    <Select.Option value="done">已通过</Select.Option>
                    <Select.Option value="error">已拒绝</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="device" label="设备类型" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择设备">
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="galbot_2.2_RGB">galbot_2.2_RGB</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={expand ? 24 : 8} style={{ textAlign: 'right', marginBottom: 16 }}>
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

        {/* card block */}
        <div className="card" style={{ padding: 0 }}>
          <div className="tabs-bar" style={{ padding: '0 24px' }}>
            <div className="tabs-pill">
              <button className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                📋 全部 <span className="tab-count">21,551</span>
              </button>
              <button className={`tab-pill ${activeTab === 'pending' ? 'active' : ''}`} data-t="pending" onClick={() => setActiveTab('pending')}>
                🕐 待质检 <span className="tab-count">2,847</span>
              </button>
              <button className={`tab-pill ${activeTab === 'done' ? 'active' : ''}`} data-t="done" onClick={() => setActiveTab('done')}>
                ✅ 已通过 <span className="tab-count">18,234</span>
              </button>
              <button className={`tab-pill ${activeTab === 'error' ? 'active' : ''}`} data-t="error" onClick={() => setActiveTab('error')}>
                ❌ 已拒绝 <span className="tab-count">342</span>
              </button>
              <button className={`tab-pill ${activeTab === 'running' ? 'active' : ''}`} data-t="running" onClick={() => setActiveTab('running')}>
                🔄 待复检 <span className="tab-count">128</span>
              </button>
            </div>
          </div>
          
          <div className="toolbar" style={{ padding: '16px 24px' }}>
            <div className="toolbar-left"><span className="tbl-title">质检列表</span></div>
            <div className="toolbar-right">
              <button className="btn btn-primary btn-sm" style={{ marginRight: 6 }}>批量通过</button>
              <button className="btn btn-danger btn-sm" style={{ marginRight: 6 }}>批量拒绝</button>
              <div className="icon-btn">↻</div>
            </div>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>数据ID</th>
                  <th>任务名称</th>
                  <th>设备</th>
                  <th>采集时间</th>
                  <th>时长</th>
                  <th>质检状态</th>
                  <th>质检人</th>
                  <th>质检时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {filteredData.map((t, idx) => {
                  const s = sMap[t.status];
                  return (
                    <tr key={idx}>
                      <td><input type="checkbox" /></td>
                      <td className="tbl-link">{t.id}</td>
                      <td>{t.name}</td>
                      <td>{t.device}</td>
                      <td>{t.time}</td>
                      <td>{t.duration}</td>
                      <td><span className={`badge-tag ${s.c}`}>{s.l}</span></td>
                      <td>{t.inspector}</td>
                      <td>{t.inspectTime}</td>
                      <td>
                        <div className="act-btns">
                          <button className="act-btn">查看</button><span className="act-sep">|</span>
                          <button className="act-btn">通过</button><span className="act-sep">|</span>
                          <button className="act-btn del" style={{ color: '#ff4d4f' }}>拒绝</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pager" style={{ padding: '12px 24px' }}>
            <span className="pager-info">共 <b>21,551</b> 条数据</span>
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

      </motion.div>
    </MainLayout>
  );
}
