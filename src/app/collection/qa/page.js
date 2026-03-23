'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { motion } from 'framer-motion';
import { DownOutlined, UpOutlined, ReloadOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Row, Col, Select, Card, Input, Button, Space, Typography, Tag, Progress, Tabs } from 'antd';
import Link from 'next/link';

export default function QualityInspectionDashboard() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  // Dimension: Package (包列表)
  const qaData = [
    { id: 'PKG-20240301-001', taskName: '餐具摆放采集', device: 'galbot_001', time: '2026-03-01 10:23', total: 47, audited: 12, status: 'pending', sourceStatus: 'paused' },
    { id: 'PKG-20240301-002', taskName: '餐具摆放采集', device: 'galbot_001', time: '2026-03-01 15:28', total: 50, audited: 50, status: 'done', sourceStatus: 'completed' },
    { id: 'PKG-20240302-001', taskName: '商业场景采集', device: 'galbot_002', time: '2026-03-02 11:05', total: 30, audited: 30, status: 'done', sourceStatus: 'completed' },
    { id: 'PKG-20240302-002', taskName: '商业场景采集', device: 'galbot_002', time: '2026-03-02 11:22', total: 25, audited: 5, status: 'error', sourceStatus: 'completed' },
    { id: 'PKG-20240303-001', taskName: '物品整理采集', device: 'galbot_003', time: '2026-03-03 14:30', total: 40, audited: 0, status: 'pending', sourceStatus: 'paused' },
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
        <Card variant="borderless" style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '24px 24px 8px' } }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="id" label="包ID" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入包ID" />
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
                <Form.Item name="source" label="来源状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择来源">
                    <Select.Option value="completed">已完成</Select.Option>
                    <Select.Option value="paused">已暂停</Select.Option>
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
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px 0 24px' }}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              type="card"
              tabBarStyle={{ borderBottom: 'none', marginBottom: 0 }}
              items={[
                { key: 'all', label: (<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>📋</span> 全部</div>) },
                { key: 'pending', label: (<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>🕐</span> 待质检</div>) },
                { key: 'done', label: (<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>✅</span> 已通过</div>) },
                { key: 'error', label: (<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>❌</span> 已拒绝</div>) },
              ]}
            />
          </div>
          
          <div className="toolbar" style={{ padding: '16px 24px' }}>
            <div className="toolbar-left"><span className="tbl-title">分包质检列表</span></div>
            <div className="toolbar-right">
              <div className="icon-btn">↻</div>
            </div>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>包ID</th>
                  <th>所属任务</th>
                  <th>来源状态</th>
                  <th>记录总数</th>
                  <th>质检进度</th>
                  <th>质检状态</th>
                  <th>最后更新</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {filteredData.map((t, idx) => {
                  const s = sMap[t.status];
                  const percent = Math.round((t.audited / t.total) * 100);
                  return (
                    <tr key={idx}>
                      <td><input type="checkbox" /></td>
                      <td className="tbl-link">
                        <Link href={`/collection/qa/${t.id}`}>{t.id}</Link>
                      </td>
                      <td>{t.taskName}</td>
                      <td>
                        {t.sourceStatus === 'completed' ? (
                          <Tag color="success" style={{ margin: 0, borderRadius: 4 }}>已完成</Tag>
                        ) : (
                          <Tag color="purple" style={{ margin: 0, borderRadius: 4 }}>已暂停</Tag>
                        )}
                      </td>
                      <td><b>{t.total}</b> 条</td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                          <span>{t.audited}/{t.total} 已审</span>
                          <span>{percent}%</span>
                        </div>
                        <Progress percent={percent} size="small" showInfo={false} strokeColor={percent === 100 ? '#52c41a' : '#1677ff'} />
                      </td>
                      <td><span className={`badge-tag ${s.c}`}>{s.l}</span></td>
                      <td>{t.time}</td>
                      <td>
                        <Link href={`/collection/qa/${t.id}`}>
                          <Button type="link" size="small" icon={<EyeOutlined />}>查看记录</Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pager" style={{ padding: '12px 24px' }}>
            <span className="pager-info">共 <b>{qaData.length}</b> 个分包</span>
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
