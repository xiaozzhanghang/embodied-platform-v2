'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Col, Descriptions, Dropdown, Menu, Row, Steps, Table, Tag, Tabs, Space, Statistic, Divider, Typography, Tooltip, Input, Select, DatePicker, Modal, Form, InputNumber } from 'antd';
import { ArrowLeftOutlined, EllipsisOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined, DownOutlined, UpOutlined, InfoCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, PauseCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Text } = Typography;

export default function TaskAdvancedProfile({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id || '10383';
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isAddPkgModalOpen, setIsAddPkgModalOpen] = useState(false);
  const [isPackagingModalOpen, setIsPackagingModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const [mockStatus, setMockStatus] = useState('running'); // 'running', 'packaging', 'paused'
  const [packagingProgress, setPackagingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('1');

  const handleConfirmPause = () => {
    setIsPauseModalOpen(false);
    setMockStatus('packaging');
    setIsPackagingModalOpen(true);
    setPackagingProgress(0);
    
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      if (prog >= 100) {
        clearInterval(interval);
        setPackagingProgress(100);
        setMockStatus('paused');
        setTimeout(() => setIsPackagingModalOpen(false), 800);
      } else {
        setPackagingProgress(prog);
      }
    }, 150);
  };

  // Package Data
  const pkData = [
    { 
      key: '1', 
      instanceId: '12745', 
      taskName: '餐具摆放', 
      isAutoDataset: false, 
      isShelfTask: false, 
      rowCol: '--', 
      labelType: '处面标注', 
      packageTarget: 15, 
      totalTarget: 120, 
      assignee: '李明', 
      startTime: '2026-03-18 10:00', 
      endTime: '2026-03-20 18:00', 
      progress: 53, 
      qcProgress: 0, 
      status: 'working'
    },
    { 
      key: '2', 
      instanceId: '12744', 
      taskName: '餐具摆放', 
      isAutoDataset: false, 
      isShelfTask: false, 
      rowCol: '--', 
      labelType: '处面标注', 
      packageTarget: 15, 
      totalTarget: 120, 
      assignee: '张悦', 
      startTime: '2026-03-18 10:00', 
      endTime: '2026-03-20 18:00', 
      progress: 80, 
      qcProgress: 0, 
      status: 'paused' 
    },
    { 
      key: '3', 
      instanceId: '12619', 
      taskName: '餐具摆放', 
      isAutoDataset: false, 
      isShelfTask: false, 
      rowCol: '--', 
      labelType: '处面标注', 
      packageTarget: 15, 
      totalTarget: 120, 
      assignee: '王锋', 
      startTime: '2026-03-16 09:00', 
      endTime: '2026-03-17 18:00', 
      progress: 0, 
      qcProgress: 0, 
      status: 'pending' 
    },
    { 
      key: '4', 
      instanceId: '12511', 
      taskName: '餐具摆放', 
      isAutoDataset: false, 
      isShelfTask: false, 
      rowCol: '--', 
      labelType: '处面标注', 
      packageTarget: 15, 
      totalTarget: 120, 
      assignee: '赵薇', 
      startTime: '2026-03-15 09:00', 
      endTime: '2026-03-16 18:00', 
      progress: 100, 
      qcProgress: 100, 
      status: 'done',
      syncFailed: true
    },
  ];

  const filteredData = pkData.filter(item => {
    if (activeTab === '1') return true;
    if (activeTab === '2') return item.status === 'pending';
    if (activeTab === '3') return item.status === 'working' || item.status === 'paused';
    if (activeTab === '4') return item.status === 'done';
    if (activeTab === '5') return item.syncFailed;
    return true;
  });

    const pkColumns = [
    { title: '实例ID', dataIndex: 'instanceId', key: 'instanceId', fixed: 'left', width: 100 },
    { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 120 },
    { title: '是否自动生成数据集', dataIndex: 'isAutoDataset', key: 'isAutoDataset', render: val => val ? <Tag color="success" style={{ margin: 0 }}>是</Tag> : <Tag color="error" style={{ margin: 0 }}>否</Tag>, width: 150 },
    { title: '是否货架任务', dataIndex: 'isShelfTask', key: 'isShelfTask', render: val => val ? <Tag color="success" style={{ margin: 0 }}>是</Tag> : <Tag color="error" style={{ margin: 0 }}>否</Tag>, width: 120 },
    { title: '行列号', dataIndex: 'rowCol', key: 'rowCol', width: 100 },
    { title: '标注类型', dataIndex: 'labelType', key: 'labelType', render: text => <span style={{ color: '#1a73e8' }}>{text}</span>, width: 120 },
    { title: '单包采集量', dataIndex: 'packageTarget', key: 'packageTarget', width: 100 },
    { title: '计划采集量', dataIndex: 'totalTarget', key: 'totalTarget', width: 100 },
    { title: '采集人员', dataIndex: 'assignee', key: 'assignee', width: 100 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 150, render: text => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text> },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 150, render: text => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text> },
    { 
      title: '采集进度', 
      dataIndex: 'progress', 
      key: 'progress', 
      fixed: 'right',
      width: 160,
      render: pct => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: '#f0f0f0', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: '#1a73e8', borderRadius: 3 }} />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>{pct}%</Text>
        </div>
      )
    },
    { 
      title: '质检进度', 
      dataIndex: 'qcProgress', 
      key: 'qcProgress', 
      fixed: 'right',
      width: 160,
      render: pct => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: '#f0f0f0', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: '#1a73e8', borderRadius: 3 }} />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>{pct}%</Text>
        </div>
      )
    },
    { 
      title: '任务状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => {
        switch (status) {
          case 'done': return <span style={{ color: '#52c41a' }}>已完成</span>;
          case 'paused': return <span style={{ color: '#722ed1' }}>已暂停</span>;
          case 'pending': return <span style={{ color: '#8c8c8c' }}>待执行</span>;
          default: return <span style={{ color: '#1a73e8' }}>进行中</span>;
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 260,
      render: (_, record) => {
        const actions = [];
        
        if (record.status === 'working') {
          actions.push(
            <a 
              key="pause"
              style={{ color: '#fa8c16', fontSize: 12 }} 
              onClick={() => { 
                setSelectedRowKeys([record.key]);
                setIsPauseModalOpen(true);
              }}
            >
              暂停
            </a>
          );
          actions.push(<a key="complete" style={{ color: '#1a73e8', fontSize: 12 }}>完成</a>);
        } else if (record.status === 'paused') {
          actions.push(
            <a 
              key="resume"
              style={{ color: '#52c41a', fontSize: 12 }} 
              onClick={() => { 
                setIsResumeModalOpen(true);
              }}
            >
              恢复
            </a>
          );
          actions.push(<a key="complete" style={{ color: '#1a73e8', fontSize: 12 }}>完成</a>);
        } else if (record.status === 'done') {
          actions.push(<a key="download" style={{ color: '#1a73e8', fontSize: 12 }}>下载</a>);
          actions.push(<a key="qc" style={{ color: '#1a73e8', fontSize: 12 }}>质检详情</a>);
          if (record.syncFailed) {
            actions.push(<a key="upload" style={{ color: '#ff4d4f', fontSize: 12 }}>手动上传</a>);
          }
        } else if (record.status === 'pending') {
          actions.push(<a key="edit" style={{ color: '#1a73e8', fontSize: 12 }}>编辑</a>);
          actions.push(<a key="delete" style={{ color: '#ff4d4f', fontSize: 12 }}>删除</a>);
        }

        return (
          <Space size={10} wrap={false} split={<span style={{ color: '#f0f0f0' }}>|</span>}>
            {actions}
          </Space>
        );
      }
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
            <div style={{ flex: 1, minWidth: 0 }}>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, marginRight: 16 }}>
                  任务详情：餐具摆放 ({id})
                </h1>
                {mockStatus === 'running' && <Tag color="processing" style={{ borderRadius: 12, padding: '0 8px' }}>进行中</Tag>}
                {mockStatus === 'packaging' && <Tag color="warning" style={{ borderRadius: 12, padding: '0 8px' }}>数据打包中</Tag>}
                {mockStatus === 'paused' && <Tag color="purple" style={{ borderRadius: 12, padding: '0 8px' }}>已暂停</Tag>}
              </div>

              {/* Dynamic Banners */}
              {mockStatus === 'packaging' && (
                <div style={{ background: '#e6f4ff', border: '1px solid #91caff', padding: '12px 24px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ fontSize: 20 }}>📦</motion.div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0050b3' }}>数据打包中... ({packagingProgress}%)</div>
                      <div style={{ fontSize: 12, color: '#0958d9' }}>归档进度 {Math.floor(packagingProgress / 100 * 47)}/47 条 · 预计剩余 {Math.max(0, Math.ceil((100 - packagingProgress) / 20))}秒</div>
                    </div>
                  </div>
                  <div style={{ width: 200, height: 6, background: '#bae0ff', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${packagingProgress}%`, background: '#1677ff' }} />
                  </div>
                </div>
              )}

              {mockStatus === 'paused' && (
                <div style={{ background: '#f9f0ff', border: '1px solid #d3adf7', padding: '12px 24px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, background: '#722ed1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20 }}>⏸</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#391085', fontSize: 15 }}>任务已暂停 · 数据归档完成</div>
                      <div style={{ fontSize: 12, color: '#722ed1', marginTop: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>今日采集数据已完成解析打包，各分包断点进度已保存，随时可恢复执行。</span>
                        <span style={{ padding: '0 6px', background: '#fff', borderRadius: 4, border: '1px solid #e2c6ff' }}>📍 INS-006 · 断点第 8 条</span>
                        <span style={{ padding: '0 6px', background: '#fff', borderRadius: 4, border: '1px solid #e2c6ff' }}>📍 INS-007 · 断点第 12 条</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'center', background: '#fff', padding: '4px 12px', borderRadius: 6, border: '1px solid #e2c6ff' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#722ed1' }}>47</div>
                        <div style={{ fontSize: 11, color: '#b37feb' }}>已归档条数</div>
                    </div>
                    <div style={{ textAlign: 'center', background: '#fff', padding: '4px 12px', borderRadius: 6, border: '1px solid #e2c6ff' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#722ed1' }}>3</div>
                        <div style={{ fontSize: 11, color: '#b37feb' }}>待续分包</div>
                    </div>
                    <div style={{ textAlign: 'center', background: '#fff', padding: '4px 12px', borderRadius: 6, border: '1px solid #e2c6ff' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#722ed1' }}>2h 15m</div>
                        <div style={{ fontSize: 11, color: '#b37feb' }}>暂停时长</div>
                    </div>
                    
                    <Space direction="vertical" size={6} style={{ marginLeft: 8 }}>
                      <Button style={{ background: '#f6ffed', borderColor: '#b7eb8f', color: '#389e0d', height: 28, fontSize: 12, display: 'flex', alignItems: 'center' }} onClick={() => setIsResumeModalOpen(true)}>▶ 恢复执行</Button>
                      <Button size="small" type="link" style={{ padding: 0, height: 20 }}>查看归档数据</Button>
                    </Space>
                  </div>
                </div>
              )}


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
                        onClick={() => setIsAddPkgModalOpen(true)}
                        style={{ 
                          height: 36, 
                          background: '#1a73e8', 
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        添加分包
                      </Button>
                      <Button 
                        type="primary" 
                        disabled={selectedRowKeys.length === 0 || mockStatus !== 'running'}
                        icon={<PauseCircleOutlined />} 
                        onClick={() => setIsPauseModalOpen(true)}
                        style={{ 
                          height: 36, 
                          background: (selectedRowKeys.length === 0 || mockStatus !== 'running') ? 'rgba(26, 115, 232, 0.4)' : '#1a73e8', 
                          borderColor: 'transparent',
                          color: (selectedRowKeys.length === 0 || mockStatus !== 'running') ? 'rgba(255, 255, 255, 0.7)' : '#fff',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          opacity: (selectedRowKeys.length === 0 || mockStatus !== 'running') ? 0.8 : 1
                        }}
                      >
                        暂停任务
                      </Button>
                      <Button 
                        type="primary" 
                        disabled={selectedRowKeys.length === 0}
                        icon={<PlusOutlined />} 
                        style={{ 
                          height: 36, 
                          background: selectedRowKeys.length === 0 ? 'rgba(26, 115, 232, 0.4)' : '#1a73e8', 
                          borderColor: 'transparent',
                          color: selectedRowKeys.length === 0 ? 'rgba(255, 255, 255, 0.7)' : '#fff',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          opacity: selectedRowKeys.length === 0 ? 0.8 : 1
                        }}
                      >
                        添加标注任务
                      </Button>
                    </Space>
                  </div>
                </div>

                <div style={{ padding: '0 24px 12px' }}>
                  <Tabs 
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    type="card"
                    className="custom-pill-tabs"
                    tabBarGutter={8}
                    items={[
                      { key: '1', label: <span>全部 <Text type="secondary" style={{ fontSize: 11, background: '#eff6ff', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>{pkData.length}</Text></span> },
                      { key: '2', label: <span>待分配 <Text type="secondary" style={{ fontSize: 11, background: '#f1f5f9', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>{pkData.filter(d=>d.status==='pending').length}</Text></span> },
                      { key: '3', label: <span>采集中 <Text type="secondary" style={{ fontSize: 11, background: '#f1f5f9', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>{pkData.filter(d=>d.status==='working'||d.status==='paused').length}</Text></span> },
                      { key: '4', label: <span>已完成 <Text type="secondary" style={{ fontSize: 11, background: '#eff6ff', padding: '0 6px', borderRadius: 10, marginLeft: 4 }}>{pkData.filter(d=>d.status==='done').length}</Text></span> },
                      { key: '5', label: <Tag color="processing" style={{ margin: 0, borderRadius: 12, border: 'none', background: '#eff6ff', color: '#1a73e8' }}>异常 {pkData.filter(d=>d.syncFailed).length}</Tag> },
                    ]}
                  />
                </div>

                <div style={{ padding: '0 24px 24px 24px' }}>
                  <Table 
                    rowSelection={{ 
                      selectedRowKeys,
                      onChange: (keys) => setSelectedRowKeys(keys),
                      type: 'checkbox',
                      fixed: 'left'
                    }}
                    columns={pkColumns} 
                    dataSource={filteredData} 
                    pagination={false}
                    size="middle"
                    rowClassName="high-fidelity-row"
                    scroll={{ x: 1800 }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PAUSE MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#fa8c16', fontSize: 18 }}>⏸</span> 暂停任务
          </div>
        }
        open={isPauseModalOpen}
        onCancel={() => setIsPauseModalOpen(false)}
        footer={null}
        width={560}
      >
        <div style={{ padding: '8px 0 16px' }}>
          <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
             <div style={{ color: '#d48806', fontWeight: 600, marginBottom: 8 }}>⚠️ 将暂停以下 {selectedRowKeys.length} 个进行中的分包：</div>
             <Space size={8} wrap style={{ marginBottom: 12 }}>
                {pkData.filter(d => selectedRowKeys.includes(d.key)).map(item => (
                  <Tag key={item.key} style={{ background: '#fff', border: '1px solid #d9d9d9', color: '#595959', padding: '2px 8px' }}>
                    {item.assignee} (已采 {Math.floor(item.progress/100 * item.packageTarget)}/{item.packageTarget})
                  </Tag>
                ))}
             </Space>
             <div style={{ fontSize: 12, color: '#8c8c8c' }}>* 另外 {pkData.length - selectedRowKeys.length} 个已完成或待分配的分包不受影响。</div>
          </div>
          
          <div style={{ fontSize: 13.5, color: '#595959', lineHeight: 1.6 }}>
            <div>暂停确认后立即触发数据打包，预计 <b>3–5 分钟</b>完成。今日已采集的 <b>47 条</b>数据全部归档，<b>不会丢失</b>。打包期间编辑、恢复均不可用。</div>
          </div>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#bfbfbf' }}>确认后操作不可撤销</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => setIsPauseModalOpen(false)}>取消</Button>
            <Button style={{ background: '#fa8c16', color: '#fff', borderColor: '#fa8c16' }} onClick={handleConfirmPause}>⏸ 确认暂停，开始打包归档</Button>
          </div>
        </div>
      </Modal>

      {/* PACKAGING PROGRESS MODAL */}
      <Modal
        title={null}
        open={isPackagingModalOpen}
        footer={null}
        closable={false}
        maskClosable={false}
        width={400}
      >
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <div style={{ marginBottom: 20 }}>
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ display: 'inline-block', fontSize: 36, color: '#1677ff', marginBottom: 12 }}>⏳</motion.div>
             <div style={{ fontSize: 16, fontWeight: 700, color: '#1f1f1f' }}>数据打包中... {packagingProgress}%</div>
             <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 8 }}>正在打包归档当前进度，预计剩余 {Math.max(0, Math.ceil((100 - packagingProgress) / 20))} 秒</div>
          </div>
          
          <div style={{ 
            height: 10, 
            background: '#f0f0f0', 
            borderRadius: 5, 
            overflow: 'hidden', 
            marginBottom: 24 
          }}>
            <div style={{ 
              height: '100%', 
              background: packagingProgress >= 100 ? '#52c41a' : '#1677ff', 
              width: `${packagingProgress}%`,
              transition: 'width 0.2s',
              borderRadius: 5
            }} />
          </div>
          
          <div style={{ textAlign: 'left', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: packagingProgress >= 50 ? '#52c41a' : '#8c8c8c' }}>
              <span style={{ fontSize: 16 }}>{packagingProgress >= 50 ? '✅' : '⚪'}</span> 解析保存所有断点记录
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: packagingProgress >= 100 ? '#52c41a' : '#8c8c8c' }}>
               <span style={{ fontSize: 16 }}>{packagingProgress >= 100 ? '✅' : '⚪'}</span> 打包合并为新数据版本并覆盖当前状态
            </div>
          </div>
        </div>
      </Modal>

      {/* RESUME MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#52c41a' }}>▶</span> 恢复执行任务
          </div>
        }
        open={isResumeModalOpen}
        onCancel={() => setIsResumeModalOpen(false)}
        footer={null}
        width={680}
      >
        <div style={{ padding: '8px 0 16px' }}>
          <div style={{ fontSize: 13.5, color: '#595959', marginBottom: 20 }}>
            将从系统保存的断点处恢复这 3 个进行中分包的采集。
          </div>
          
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
             {/* Card 1: INS-006 */}
             <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 24 }}>
               <div style={{ width: 80, fontWeight: 600, color: '#1f1f1f' }}>PKG-006</div>
               <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12.5 }}>
                     <div><span style={{ color: '#52c41a', fontWeight: 600 }}>✓ 已采 8 条</span><span style={{ color: '#d9d9d9', margin: '0 8px' }}>|</span><span style={{ color: '#1677ff', fontWeight: 500 }}>待续采 7 条</span></div>
                     <Tag color="purple" style={{ margin: 0 }}>📍 从第 9 条开始</Tag>
                  </div>
                  <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', width: '53%', background: '#52c41a' }} />
                    <div style={{ height: '100%', width: '47%', background: '#bae0ff' }} />
                  </div>
               </div>
               <div style={{ width: 60, textAlign: 'right', color: '#595959', fontSize: 12 }}>李明</div>
             </div>
             
             {/* Card 2: INS-007 */}
             <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 24 }}>
               <div style={{ width: 80, fontWeight: 600, color: '#1f1f1f' }}>PKG-007</div>
               <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12.5 }}>
                     <div><span style={{ color: '#52c41a', fontWeight: 600 }}>✓ 已采 12 条</span><span style={{ color: '#d9d9d9', margin: '0 8px' }}>|</span><span style={{ color: '#1677ff', fontWeight: 500 }}>待续采 3 条</span></div>
                     <Tag color="purple" style={{ margin: 0 }}>📍 从第 13 条开始</Tag>
                  </div>
                  <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', width: '80%', background: '#52c41a' }} />
                    <div style={{ height: '100%', width: '20%', background: '#bae0ff' }} />
                  </div>
               </div>
               <div style={{ width: 60, textAlign: 'right', color: '#595959', fontSize: 12 }}>张悦</div>
             </div>
             
             {/* Card 3: INS-008 */}
             <div style={{ border: '1px dashed #d9d9d9', borderRadius: 8, padding: '14px 18px', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 24 }}>
               <div style={{ width: 80, fontWeight: 600, color: '#8c8c8c' }}>PKG-008</div>
               <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ color: '#8c8c8c', fontSize: 12.5 }}>0 / 15 条</div>
                 <Tag color="cyan">✨ 全新开始</Tag>
               </div>
               <div style={{ width: 60, textAlign: 'right', color: '#8c8c8c', fontSize: 12 }}>王锋</div>
             </div>
          </Space>
          
          <div style={{ marginTop: 24, background: '#e6f4ff', padding: '12px 16px', borderRadius: 8, border: '1px solid #91caff', fontSize: 13, color: '#0958d9', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span>ℹ️</span>
            <div>确认后将通过系统消息通知采集员 <b>李明、张悦、王锋</b> 恢复任务执行，任务系统状态将变更为「进行中」。</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <Button onClick={() => setIsResumeModalOpen(false)}>取消</Button>
          <Button type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => { setMockStatus('running'); setIsResumeModalOpen(false); }}>确认恢复执行</Button>
        </div>
      </Modal>

      {/* ADD PACKAGE MODAL */}
      <Modal
        title="添加分包"
        open={isAddPkgModalOpen}
        onCancel={() => setIsAddPkgModalOpen(false)}
        onOk={() => setIsAddPkgModalOpen(false)}
        okText="确认"
        cancelText="取消"
        width={480}
      >
        <div style={{ paddingTop: 16 }}>
          <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Form.Item 
              label="计划采集量" 
              name="totalTarget" 
              initialValue={2}
              rules={[{ required: true, message: '请输入计划采集量' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item 
              label="单包采集量" 
              name="packageTarget" 
              rules={[{ required: true, message: '请输入单包采集量' }]}
            >
              <InputNumber placeholder="请输入单包采集量" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item 
              label="分配采集员" 
              name="assignee" 
              rules={[{ required: true, message: '请选择采集员' }]}
            >
              <Select placeholder="请选择采集员">
                <Select.Option value="liming">李明</Select.Option>
                <Select.Option value="zhangyue">张悦</Select.Option>
                <Select.Option value="wangfeng">王锋</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>

    </MainLayout>
  );
}
