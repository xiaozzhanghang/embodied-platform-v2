'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Col, Descriptions, Dropdown, Menu, Row, Steps, Table, Tag, Tabs, Space, Statistic, Divider, Typography, Tooltip, Input, Select, DatePicker } from 'antd';
import { ArrowLeftOutlined, EllipsisOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined, DownOutlined, UpOutlined, InfoCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Text } = Typography;

export default function TaskAdvancedProfile({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id || '10383';
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Package Data
  const pkData = [
    { key: '1', pid: 'PK-12853-01', packNo: 'Pack-01', assignee: '张三', status: 'done', target: 10, done: 10, created: '2026-03-01', finished: '2026-03-02' },
    { key: '2', pid: 'PK-12853-02', packNo: 'Pack-02', assignee: '李四', status: 'done', target: 10, done: 10, created: '2026-03-01', finished: '2026-03-02' },
    { key: '3', pid: 'PK-12853-03', packNo: 'Pack-03', assignee: '王五', status: 'done', target: 10, done: 10, created: '2026-03-01', finished: '2026-03-03' },
  ];

  const pkColumns = [
    { title: '包ID', dataIndex: 'pid', key: 'pid', width: 140, render: text => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text> },
    { title: '包编号', dataIndex: 'packNo', key: 'packNo', render: text => <Text strong style={{ color: '#0f172a' }}>{text}</Text> },
    { title: '采集员', dataIndex: 'assignee', key: 'assignee' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: s => <Tag color="success" style={{ borderRadius: 12, padding: '0 8px' }}>● 已完成</Tag>
    },
    { title: '目标采集数', dataIndex: 'target', key: 'target', align: 'center' },
    { title: '已采集', dataIndex: 'done', key: 'done', align: 'center' },
    { 
      title: '进度', 
      dataIndex: 'done', 
      key: 'progress',
      width: 200,
      render: (val, record) => {
        const pct = Math.round((val / record.target) * 100);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: '#52c41a', borderRadius: 3 }} />
            </div>
            <Text style={{ fontSize: 13, minWidth: 40 }}>{pct}%</Text>
          </div>
        );
      }
    },
    { title: '创建时间', dataIndex: 'created', key: 'created', render: text => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text> },
    { title: '完成时间', dataIndex: 'finished', key: 'finished', render: text => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text> },
    { 
      title: '操作', 
      key: 'action', 
      render: () => (
        <Space split={<span style={{ color: '#e2e8f0' }}>|</span>} size={8}>
          <Text style={{ color: '#1a73e8', cursor: 'pointer', fontSize: 13 }}>上传</Text>
          <Text style={{ color: '#1a73e8', cursor: 'pointer', fontSize: 13 }}>编辑</Text>
          <Text style={{ color: '#1a73e8', cursor: 'pointer', fontSize: 13 }}>删除</Text>
          <Text style={{ color: '#1a73e8', cursor: 'pointer', fontSize: 13 }}>完成</Text>
        </Space>
      )
    }
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: '0 0 40px 0' }}>
        
        {/* Page Header Area */}
        <div style={{ padding: '0 24px 24px', marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Link href="/collection/tasks" style={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center' }}>
              <ArrowLeftOutlined style={{ marginRight: 6 }} /> 返回任务列表
            </Link>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, marginRight: 16 }}>
                  任务详情：餐具摆放 ({id})
                </h1>
                <Tag color="processing" style={{ borderRadius: 12, padding: '0 8px' }}>进行中</Tag>
              </div>

              {/* Task Info Section - Collapsible Header */}
              <div 
                style={{ 
                  background: '#fff',
                  padding: '20px 24px',
                  borderRadius: 12,
                  marginBottom: 20,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div 
                  onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none', marginBottom: isInfoExpanded ? 20 : 0 }}
                >
                  <Space size={12}>
                    <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8, display: 'flex' }}>
                       <InfoCircleOutlined style={{ color: '#64748b', fontSize: 16 }} />
                    </div>
                    <Text strong style={{ color: '#0f172a', fontSize: 16 }}>任务基本信息</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 13, background: '#f8fafc', padding: '4px 12px', borderRadius: 20 }}>
                    {isInfoExpanded ? '点击收起 ▴' : '点击展开详情 ▾'}
                  </Text>
                </div>

                <AnimatePresence initial={false}>
                  {isInfoExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Divider style={{ margin: '0 0 20px 0' }} />
                      <Row gutter={[32, 24]}>
                        {[
                          { label: '任务ID', value: id },
                          { label: '任务状态', value: <Tag color="default" style={{ borderRadius: 12 }}>已关闭</Tag> },
                          { label: '创建人', value: '天奇管理员' },
                          { label: '项目名', value: 'InternalCommercial (内部-商业)' },
                          { label: '场景分类', value: 'Supermarket (超市场景)' },
                          { label: '采集模式', value: 'WholeBody' },
                          { label: '遥操类型', value: 'Master-slave' },
                          { label: '创建时间', value: '2026-03-10 14:22' },
                        ].map((item, idx) => (
                          <Col span={6} key={idx}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <Text style={{ color: '#64748b', fontSize: 12 }}>{item.label}</Text>
                              <Text style={{ color: '#0f172a', fontWeight: 600, fontSize: 14 }}>{item.value}</Text>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stat Cards */}
              <Row gutter={16} style={{ marginBottom: 24 }}>
                {[
                  { icon: '📦', label: '总包数', value: '3', bg: '#eff6ff', color: '#1a73e8' },
                  { icon: '✅', label: '已完成包', value: '3', bg: '#ecfdf5', color: '#10b981' },
                  { icon: '⚡', label: '采集中包', value: '0', bg: '#fff7e6', color: '#f59e0b' },
                  { icon: '🔢', label: '采集记录进度', value: '30/30', bg: '#f3e8ff', color: '#7c3aed' },
                ].map((stat, idx) => (
                  <Col span={6} key={idx}>
                    <div style={{ 
                      background: '#fff', 
                      padding: '20px 24px', 
                      borderRadius: 12, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 16,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div style={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 10, 
                        background: stat.bg, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: 24 
                      }}>{stat.icon}</div>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, lineHeight: 1.2 }}>{stat.value}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{stat.label}</div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Package List Section - Design V3 */}
              <Card 
                bordered={false} 
                style={{ borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                  <Space size={12}>
                    <Text strong style={{ fontSize: 16, color: '#0f172a' }}>包列表</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>每个包分配给一名采集员，包内包含多条采集记录</Text>
                  </Space>
                  <Tooltip title="刷新">
                    <Button type="text" icon={<SyncOutlined />} style={{ color: '#64748b' }} />
                  </Tooltip>
                </div>

                {/* Styled Filter Bar from Specific Request (V4) */}
                <div style={{ padding: '0 24px 20px' }}>
                  <div style={{ 
                    background: '#fff', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    <Input 
                      placeholder="实例任务id" 
                      style={{ width: 160 }} 
                    />
                    <Select 
                      placeholder="操作物体" 
                      style={{ width: 160 }} 
                      suffixIcon={<DownOutlined style={{ fontSize: 10, color: '#bfbfbf' }} />}
                    />
                    <Select 
                      placeholder="采集人员" 
                      style={{ width: 160 }} 
                      suffixIcon={<DownOutlined style={{ fontSize: 10, color: '#bfbfbf' }} />}
                    />
                    
                    <div style={{ flex: 1 }} />
                    
                    <Space size={8}>
                      <Button 
                        icon={<ReloadOutlined />} 
                        style={{ 
                          height: 36, 
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          color: '#64748b'
                        }}
                      >
                        重置
                      </Button>
                      <Button 
                        type="primary" 
                        icon={<SearchOutlined />} 
                        style={{ 
                          height: 36, 
                          background: '#1a73e8', 
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        搜索
                      </Button>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        style={{ 
                          height: 36, 
                          background: '#1a73e8', 
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        添加
                      </Button>
                      <Button 
                        type="primary" 
                        disabled={selectedRowKeys.length === 0}
                        icon={<PlusOutlined />} 
                        style={{ 
                          height: 36, 
                          background: selectedRowKeys.length === 0 ? '#f5f5f5' : '#1a73e8', 
                          borderColor: selectedRowKeys.length === 0 ? '#d9d9d9' : '#1a73e8',
                          color: selectedRowKeys.length === 0 ? 'rgba(0, 0, 0, 0.25)' : '#fff',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        添加标注任务
                      </Button>
                    </Space>
                  </div>
                </div>

                <div style={{ padding: '0 24px 12px' }}>
                  <Tabs 
                    defaultActiveKey="1" 
                    type="card"
                    className="custom-pill-tabs"
                    tabBarGutter={8}
                    items={[
                      { key: '1', label: <span>全部 <Text type="secondary" style={{ fontSize: 11, background: '#eff6ff', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>3</Text></span> },
                      { key: '2', label: <span>待分配 <Text type="secondary" style={{ fontSize: 11, background: '#f1f5f9', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>0</Text></span> },
                      { key: '3', label: <span>采集中 <Text type="secondary" style={{ fontSize: 11, background: '#f1f5f9', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>0</Text></span> },
                      { key: '4', label: <span>已完成 <Text type="secondary" style={{ fontSize: 11, background: '#eff6ff', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>3</Text></span> },
                      { key: '5', label: <Tag color="processing" style={{ margin: 0, borderRadius: 12, border: 'none', background: '#eff6ff', color: '#1a73e8' }}>异常 0</Tag> },
                    ]}
                  />
                </div>

                <Table 
                  rowSelection={{ 
                    selectedRowKeys,
                    onChange: (keys) => setSelectedRowKeys(keys),
                    type: 'checkbox' 
                  }}
                  columns={pkColumns} 
                  dataSource={pkData} 
                  pagination={false}
                  size="middle"
                  style={{ padding: '0 0 24px 0' }}
                  rowClassName="high-fidelity-row"
                />
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
