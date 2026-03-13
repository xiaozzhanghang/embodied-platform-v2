'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { motion } from 'framer-motion';
import { Form, Row, Col, Select, Card, Input, Button, Space, Typography } from 'antd';
import { DownOutlined, UpOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

export default function ReviewList() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  const reviewData = [
    { id: 'A001', name: '餐具摆放', type: '轨迹标注', user: '张三', status: 'done', reviewStatus: 'done', date: '2026-03-01' },
    { id: 'A002', name: '商业采集', type: '关键帧标注', user: '李四', status: 'running', reviewStatus: 'pending', date: '2026-03-01' },
    { id: 'A003', name: '物品整理', type: '关键帧标注', user: '—', status: 'pending', reviewStatus: 'pending', date: '2026-03-02' },
    { id: 'A004', name: '餐具摆放', type: '轨迹标注', user: '王五', status: 'done', reviewStatus: 'error', date: '2026-03-02' },
    { id: 'A005', name: '商业采集', type: '轨迹标注', user: '张三', status: 'running', reviewStatus: 'pending', date: '2026-03-03' },
  ];

  const sMap = {
    done: { l: '已完成', c: 'tag-done' },
    running: { l: '标注中', c: 'tag-running' },
    pending: { l: '待标注', c: 'tag-pending' },
    error: { l: '已完成', c: 'tag-done' }
  };

  const filteredData = reviewData.filter(t => activeTab === 'all' || 
    (activeTab === 'pending' && t.status === 'pending') ||
    (activeTab === 'labeling' && t.status === 'running') ||
    (activeTab === 'done' && t.status === 'done')
  );

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: 24, paddingBottom: 64 }}>
        
        {/* filter-card */}
        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px 4px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="任务名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入任务名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="标注状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态">
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="pending">待标注</Select.Option>
                    <Select.Option value="running">标注中</Select.Option>
                    <Select.Option value="done">已完成</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="user" label="标注人" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入标注人" />
                </Form.Item>
              </Col>

              <Col span={24} style={{ textAlign: 'right', marginBottom: 16 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
                  <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Review stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
          <div className="qs-card"><div className="qs-val" style={{ color: '#1a73e8' }}>1,254</div><div className="qs-lbl">总标注数</div><div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>较上月 ↑ 9.2%</div></div>
          <div className="qs-card"><div className="qs-val" style={{ color: '#10b981' }}>60,402</div><div className="qs-lbl">已完成帧</div><div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>较上月 ↑ 14.1%</div></div>
          <div className="qs-card"><div className="qs-val" style={{ color: '#f59e0b' }}>47</div><div className="qs-lbl">待审核</div><div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>今日新增 +3</div></div>
          <div className="qs-card"><div className="qs-val" style={{ color: '#ef4444' }}>6</div><div className="qs-lbl">已驳回</div><div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>较昨日 ↑ 1</div></div>
        </div>

        {/* card block */}
        <div className="card" style={{ padding: 0 }}>
          <div className="tabs-bar">
            <div className="tabs-pill">
              <button className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                📋 全部 <span className="tab-count">156</span>
              </button>
              <button className={`tab-pill ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                🕐 待标注 <span className="tab-count">42</span>
              </button>
              <button className={`tab-pill ${activeTab === 'labeling' ? 'active' : ''}`} onClick={() => setActiveTab('labeling')}>
                ✏️ 标注中 <span className="tab-count">38</span>
              </button>
              <button className={`tab-pill ${activeTab === 'done' ? 'active' : ''}`} onClick={() => setActiveTab('done')}>
                ✅ 已完成 <span className="tab-count">76</span>
              </button>
            </div>
          </div>
          
          <div className="toolbar">
            <div className="toolbar-left"><span className="tbl-title">标注审核列表</span></div>
            <div className="toolbar-right">
              <button className="btn btn-primary btn-sm">分配标注</button>
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
                  <th>标注类型</th>
                  <th>标注人</th>
                  <th>标注状态</th>
                  <th>审核状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {filteredData.map((t, idx) => {
                  let badgeData = sMap[t.status];
                  const rc = t.id === 'A004' ? 'tag-error' : (t.reviewStatus === 'pending' ? 'tag-pending' : 'tag-done');
                  const rl = t.id === 'A004' ? '已驳回' : (t.reviewStatus === 'pending' ? '待审核' : '已通过');

                  return (
                    <tr key={idx}>
                      <td><input type="checkbox" /></td>
                      <td className="tbl-link">{t.id}</td>
                      <td>{t.name}</td>
                      <td>{t.type}</td>
                      <td>{t.user}</td>
                      <td><span className={`badge-tag ${badgeData.c}`}>{badgeData.l}</span></td>
                      <td><span className={`badge-tag ${rc}`}>{rl}</span></td>
                      <td>{t.date}</td>
                      <td>
                        <div className="act-btns">
                          <button className="act-btn">查看</button><span className="act-sep">|</span>
                          <button className="act-btn">通过</button><span className="act-sep">|</span>
                          <button className="act-btn del" style={{ color: '#ff4d4f' }}>驳回</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <span className="pager-info">共 <b>156</b> 条数据</span>
            <div className="pager-right">
              <select className="pager-size"><option>20 条/页</option></select>
              <button className="pager-btn" disabled>‹</button>
              <button className="pager-btn cur">1</button>
              <button className="pager-btn">2</button>
              <button className="pager-btn">›</button>
            </div>
          </div>
        </div>

      </motion.div>
    </MainLayout>
  );
}
