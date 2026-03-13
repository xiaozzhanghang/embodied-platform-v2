'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tabs, Progress, Avatar, Badge, Calendar, List, Tag, DatePicker } from 'antd';
import { 
  PlusOutlined, 
  RightOutlined, 
  BellOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  SettingOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  MailOutlined,
  CustomerServiceOutlined,
  AppstoreOutlined,
  FileSearchOutlined,
  TeamOutlined,
  SolutionOutlined,
  MonitorOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  DeploymentUnitOutlined,
  ControlOutlined,
  SafetyOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  CloudServerOutlined,
  SecurityScanOutlined,
  ApiOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Tiny, Pie } from '@ant-design/plots';
import MainLayout from '@/components/MainLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Mock data - Embodied Intelligence themed
const taskStats = [
  { type: '已交付', value: 4 },
  { type: '待处理', value: 6 },
];

const performanceData = [
  { title: '累计有效数采(小时)', value: '1,248', trend: '+15.2%', data: [120, 140, 135, 150, 149, 160, 170, 191, 225] },
  { title: '多模态数据量(TB)', value: '42.6', trend: '+8.4%', data: [30, 32, 35, 34, 38, 40, 41, 42, 42.6] },
  { title: '标注清洗准确率(%)', value: '98.5', trend: '+1.2%', data: [95, 96, 95.5, 97, 97.5, 98, 98.2, 98.4, 98.5] },
  { title: '模型训练迭代次数', value: '52', trend: '+22.7%', data: [10, 15, 20, 25, 30, 35, 40, 48, 52] },
  { title: '真机部署验证成功率(%)', value: '88.4', trend: '+5.7%', data: [75, 78, 80, 82, 85, 84, 86, 87, 88.4] },
  { title: '仿真模拟任务完成率', value: '94.2%', trend: '+3.1%', data: [88, 89, 90, 91, 92, 92.5, 93, 94, 94.2] },
  { title: '本月新增数据集', value: '12', trend: '+2', data: [2, 3, 2, 4, 3, 5, 4, 6, 12] },
  { title: '设备平均在线时长(h)', value: '18.5', trend: '+2.1%', data: [16, 16.5, 17, 17.5, 18, 18.2, 18.3, 18.4, 18.5] },
];

const todoList = [
  { title: '厨房场景多模态数采评审', time: '09:00-10:00', type: '会议', status: 'meeting' },
  { title: '视觉-语言模型联合微调实验', time: '11:00-12:30', type: '研发', status: 'research' },
  { title: '数据标注一致性误差分析', time: '14:30-16:00', type: '质检', status: 'task' },
];

const notifications = [
  { title: '宇树 Go2 采集设备固件已更新', date: '03-12', type: '系统' },
  { title: '北京机房 A-04 机器人电池告警', date: '03-13', type: '告警' },
  { title: '桌面抓取数据集(V2.0)发布成功', date: '03-13', type: '动态' },
];

const commonTools = [
  { title: '设备管理', icon: <RobotIcon />, color: '#3b82f6' },
  { title: '任务中心', icon: <TaskIcon />, color: '#ef4444' },
  { title: '数据资产', icon: <DataIcon />, color: '#3b82f6' },
  { title: '模型评测', icon: <EvalIcon />, color: '#f59e0b' },
  { title: '仿真测试', icon: <SimIcon />, color: '#10b981' },
  { title: '标注工具', icon: <ToolIcon />, color: '#f59e0b' },
];

const sopStages = [
  {
    key: 'prep',
    title: '系统架构',
    subtitle: '核心框架搭建完成模块化可扩展设计',
    actions: [
      {
        title: '系统基础架构搭建与核心开发',
        desc: '核心框架搭建完成模块化可扩展设计',
        btnText: '查看架构',
        icon: <ControlOutlined />,
        img: '/illustrations/sop_infra_1_glassy.png'
      },
      {
        title: '分布式存储与计算集群',
        desc: '支持 PB 级多模态数据存储，提供高性能计算资源调度与管理。\n数据存储可用率 99.9%',
        btnText: '资源管理',
        icon: <CloudServerOutlined />,
        img: '/illustrations/sop_infra_2_glassy.png'
      },
      {
        title: '安全防护与准入机制',
        desc: '多重身份验证、动态权限分配，保障数据传输与离线实验安全。\n已通过三级等保认证',
        btnText: '安全设置',
        icon: <SecurityScanOutlined />,
        img: '/illustrations/sop_infra_3.png'
      }
    ]
  },
  {
    key: 'collect',
    title: '数据自动化处理',
    subtitle: '自动标注与清洗\n持续提升数据质量',
    actions: [
      {
        title: '通用化设备接入能力',
        desc: '支持多种通用数据采集设备（例如：激光雷达、热成像仪、RGBD摄像头）的即插即用。\n已兼容 12 种不同设备',
        btnText: '设备管理',
        icon: <MonitorOutlined />,
        img: '/illustrations/sop_core_1.png'
      },
      {
        title: '末端关节精密运动控制',
        desc: '高度集成的精密闭环驱动系统，支持毫秒级响应与亚毫米级精度定位。\n控制周期 < 1ms',
        btnText: '运动调试',
        icon: <ControlOutlined />,
        img: '/illustrations/sop_core_2.png'
      },
      {
        title: '大模型驱动的任务规划',
        desc: '结合 LLM/VLM 模型实现自然语言指令解析与动态长程任务规划。\n任务成功率提升 40%',
        btnText: '实验评测',
        icon: <ThunderboltOutlined />,
        img: '/illustrations/sop_core_3.png'
      }
    ]
  },
  {
    key: 'process',
    title: '通用设备接入',
    subtitle: '即插即用接入能力\n多协议适配',
    actions: [
      {
        title: '自动化数据标注与清洗',
        desc: '通过内置算法，实现海量采集数据的自动化标注、清洗与预处理，提升数据质量。\n已处理 10,000+ 小时数据',
        btnText: '配置管线',
        icon: <SolutionOutlined />,
        img: '/illustrations/sop_access_1.png'
      },
      {
        title: '多协议通信协议栈',
        desc: '兼容 ROS2/MQTT/DDS 等主流机器人通信协议，支持海量异构设备高效互联。\n吞吐量超 2Gbps',
        btnText: '协议配置',
        icon: <ApiOutlined />,
        img: '/illustrations/sop_access_2.png'
      },
      {
        title: '可视化性能诊断看板',
        desc: '实时全量数据采集与多维指标可视化，支持毫秒级端到端延迟分析报告。\n覆盖 200+ 监测项',
        btnText: '查看看板',
        icon: <DashboardOutlined />,
        img: '/illustrations/sop_access_3.png'
      }
    ]
  }
];

// Custom icons
function RobotIcon() { return <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}><RobotOutlined /></div>; }
function TaskIcon() { return <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><ThunderboltOutlined /></div>; }
function DataIcon() { return <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><AppstoreOutlined /></div>; }
function EvalIcon() { return <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><DeploymentUnitOutlined /></div>; }
function SimIcon() { return <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><ControlOutlined /></div>; }
function ToolIcon() { return <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><SolutionOutlined /></div>; }

export default function WorkbenchPage() {
  const [activeStage, setActiveStage] = useState('prep');
  const [isSopCollapsed, setIsSopCollapsed] = useState(false);

  // Chart configs
  const pieConfig = {
    appendPadding: 10,
    data: taskStats,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.75,
    color: ['#1677ff', '#f0f2f5'],
    label: false,
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 24,
          fontWeight: 700,
        },
        content: '68%\n交付率',
      },
    },
  };

  return (
    <MainLayout>
      <div className="workbench-container" style={{ padding: '0 8px 24px 8px' }}>
        <Row gutter={20}>
          {/* Main Content Column */}
          <Col span={18}>
            {/* Redesigned SOP Section to match Expanded Content */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Title level={4} style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>具身智能数据采集管理平台</Title>
                <Button 
                  type="link" 
                  size="small" 
                  onClick={() => setIsSopCollapsed(!isSopCollapsed)}
                  style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {isSopCollapsed ? '展开' : '收起'} <RightOutlined rotate={isSopCollapsed ? 90 : -90} style={{ fontSize: 10, transition: 'transform 0.3s' }} />
                </Button>
              </div>
              
              <motion.div
                initial={false}
                animate={{ height: isSopCollapsed ? 0 : 'auto', opacity: isSopCollapsed ? 0 : 1, marginBottom: isSopCollapsed ? 0 : 24 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <Card bordered={false} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
                  <div style={{ display: 'flex', minHeight: 220 }}>
                    {/* Left Sidebar for SOP Categories */}
                    <div style={{ width: 180, background: '#f8fafc', borderRight: '1px solid #f1f5f9', padding: '12px 0' }}>
                      {sopStages.map((stage) => (
                        <div 
                          key={stage.key}
                          onClick={() => setActiveStage(stage.key)}
                          style={{ 
                            padding: '16px 20px', 
                            cursor: 'pointer',
                            position: 'relative',
                            background: activeStage === stage.key ? '#fff' : 'transparent',
                            transition: 'all 0.2s',
                            borderLeft: activeStage === stage.key ? '4px solid #1677ff' : '4px solid transparent'
                          }}
                        >
                          <Text strong style={{ color: activeStage === stage.key ? '#1677ff' : '#334155', display: 'block', fontSize: 14 }}>{stage.title}</Text>
                          <div style={{ marginTop: 4 }}>
                            {stage.subtitle.split('\n').map((line, i) => (
                              <Text key={i} type="secondary" style={{ fontSize: 11, display: 'block', lineHeight: '1.4' }}>{line}</Text>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Content Area: showing 3 cards side-by-side for active stage */}
                    <div style={{ flex: 1, padding: '20px', background: '#fff', display: 'flex', gap: 16, overflowX: 'auto' }}>
                      {sopStages.find(s => s.key === activeStage)?.actions.map((action, idx) => (
                        <Card 
                          key={idx} 
                          bordered={false} 
                          className="sop-action-card"
                          style={{ 
                            flex: 1, 
                            minWidth: 260,
                            borderRadius: 12, 
                            background: 'linear-gradient(135deg, #e2edff 0%, #fbfcff 100%)', 
                            backdropFilter: 'blur(8px)',
                            position: 'relative', 
                            overflow: 'hidden',
                            border: '1px solid rgba(191, 219, 254, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          styles={{ body: { padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' } }}
                        >
                          <div style={{ position: 'relative', zIndex: 1, maxWidth: '75%' }}>
                            <Title level={5} style={{ margin: 0, color: '#0f172a', fontSize: 14, fontWeight: 700, marginBottom: 8, height: 40, overflow: 'hidden' }}>{action.title}</Title>
                            <div style={{ minHeight: 64 }}>
                              {action.desc.split('\n').map((line, i) => (
                                <Text key={i} type="secondary" style={{ fontSize: 11, display: 'block', color: '#475569', lineHeight: '1.5' }}>{line}</Text>
                              ))}
                            </div>
                            <div style={{ marginTop: 16 }}>
                              <Button type="primary" size="small" style={{ borderRadius: 6, background: '#1d4ed8', border: 'none', padding: '0 12px', height: 26, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                                {action.icon} {action.btnText}
                              </Button>
                            </div>
                          </div>
                          <div style={{ position: 'absolute', right: -10, bottom: -10, width: '55%', textAlign: 'right' }}>
                            <img src={action.img} alt="bg" style={{ width: '100%', maxWidth: 140, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.08))' }} />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>


            {/* My Tasks Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }} styles={{ body: { padding: '20px 24px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>任务中心</Title>
                  <Button type="primary" icon={<PlusOutlined />} size="small" style={{ borderRadius: 4 }}>新建数采/标注任务</Button>
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', marginBottom: 24, gap: 24 }}>
                  <div style={{ padding: '0 0 12px 0', borderBottom: '2px solid #1677ff', cursor: 'pointer', color: '#1677ff', fontWeight: 600 }}>全部任务</div>
                  <div style={{ padding: '0 0 12px 0', cursor: 'pointer', color: '#64748b' }}>数据采集</div>
                  <div style={{ padding: '0 0 12px 0', cursor: 'pointer', color: '#64748b' }}>标注与清洗</div>
                  <div style={{ padding: '0 0 12px 0', cursor: 'pointer', color: '#64748b' }}>模型训练评测</div>
                  <span style={{ marginLeft: 'auto', color: '#1677ff', cursor: 'pointer', fontSize: 13 }}>查看资产地图 <RightOutlined style={{ fontSize: 10 }} /></span>
                </div>

                <Row gutter={24}>
                  <Col span={6}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ width: 3, height: 16, background: '#1677ff', marginRight: 8 }}></div>
                        <Text strong>本月交付统计</Text>
                        <Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12 }}>2026-03</Text>
                      </div>
                      <div style={{ height: 160, width: '100%', position: 'relative' }}>
                        <Pie {...pieConfig} />
                      </div>
                      <div style={{ width: '100%', marginTop: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Space><Badge color="#1677ff" /> <Text type="secondary">已入库</Text></Space>
                          <Text strong>4</Text>
                          <Space><Text type="secondary">本月计划</Text> <Text strong>10</Text></Space>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Space><Badge color="#f0f2f5" /> <Text type="secondary">待清洗</Text></Space>
                          <Text strong>6</Text>
                          <Space><Text type="secondary">新增需求</Text> <Text strong>2</Text></Space>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col span={9}>
                    <Card style={{ background: '#f8fafc', border: 'none', borderRadius: 8, height: '100%' }} styles={{ body: { padding: 16 } }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Title level={5} style={{ margin: 0, fontSize: 14 }}>厨房场景泛化数采_v2</Title>
                        <Tag color="blue" style={{ margin: 0, borderRadius: 4 }}>数采</Tag>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Space><Tag color="green" style={{ border: 'none' }}>有效时长</Tag> <Text type="secondary">设备：</Text> <Text strong>宇树 Go2</Text></Space>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>采集进度：84/100组</Text>
                          <Text strong style={{ fontSize: 12, color: '#1677ff' }}>84%</Text>
                        </div>
                        <Progress percent={84} showInfo={false} strokeColor="#1677ff" size="small" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <Avatar.Group size="small">
                          <Avatar icon={<UserOutlined />} />
                          <Avatar style={{ backgroundColor: '#10b981' }}>R</Avatar>
                          <Avatar style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }}>+4</Avatar>
                        </Avatar.Group>
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>协作者：数据工程师</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Text type="secondary" style={{ fontSize: 12 }}>截止时间：<Text type="warning">剩余 3 天</Text></Text>
                         <Space>
                           <Button size="small" type="primary" ghost style={{ borderRadius: 4 }}>设备自诊</Button>
                           <Button size="small" type="primary" style={{ borderRadius: 4 }}>进入工作台</Button>
                         </Space>
                      </div>
                    </Card>
                  </Col>

                  <Col span={9}>
                    <Card style={{ background: '#f8fafc', border: 'none', borderRadius: 8, height: '100%' }} styles={{ body: { padding: 16 } }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Title level={5} style={{ margin: 0, fontSize: 14 }}>抓取位姿精细化标注</Title>
                            <Tag color="orange" style={{ margin: 0, borderRadius: 4 }}>标注</Tag>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Space><Tag color="green" style={{ border: 'none' }}>精度：98%</Tag> <Text type="secondary">规模：</Text> <Text strong>2.5万帧</Text></Space>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>标注进度：1.5/2.5万帧</Text>
                                <Text strong style={{ fontSize: 12, color: '#1677ff' }}>60%</Text>
                            </div>
                            <Progress percent={60} showInfo={false} strokeColor="#1677ff" size="small" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                            <Avatar.Group size="small">
                                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" />
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<TeamOutlined />} />
                            </Avatar.Group>
                            <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>供应商：众包 A 组</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>异常告警：<Text type="danger">5 帧坐标偏移</Text></Text>
                            <Button size="small" type="primary" style={{ borderRadius: 4 }}>立即抽检</Button>
                        </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Performance Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card bordered={false} style={{ borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>效能看板</Title>
                  <Space>
                    <DatePicker picker="month" defaultValue={dayjs('2026-03')} size="small" bordered={false} style={{ width: 100 }} />
                    <div style={{ display: 'flex', background: '#f5f5f5', padding: 2, borderRadius: 4 }}>
                       <Button size="small" type="text" style={{ background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', borderRadius: 2 }}>个人</Button>
                       <Button size="small" type="text">项目组</Button>
                    </div>
                    <Button type="primary" size="small" ghost style={{ borderRadius: 4 }}>资产统计</Button>
                    <Button size="small" type="text">研发趋势</Button>
                  </Space>
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', marginBottom: 24, gap: 24 }}>
                  <div style={{ padding: '0 0 12px 0', borderBottom: '2px solid #1677ff', cursor: 'pointer', color: '#1677ff', fontWeight: 600 }}>数据资产</div>
                  <div style={{ padding: '0 0 12px 0', cursor: 'pointer', color: '#64748b' }}>标注质量</div>
                  <div style={{ padding: '0 0 12px 0', cursor: 'pointer', color: '#64748b' }}>设备负载</div>
                  <div style={{ padding: '0 0 12px 0', cursor: 'pointer', color: '#64748b' }}>实验交付</div>
                  <div style={{ padding: '0 0 12px 0', cursor: 'pointer', color: '#64748b' }}>知识补齐</div>
                </div>

                <Row gutter={[24, 24]}>
                  {performanceData.map((item, idx) => (
                    <Col span={6} key={idx}>
                      <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>{item.title}</Text>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                          <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{item.value}</Title>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Text type="secondary" style={{ fontSize: 12 }}>环比增长 <Text type="success">{item.trend}</Text></Text>
                         <div style={{ width: 60, height: 24 }}>
                            <Tiny.Area 
                              data={item.data} 
                              autoFit={true}
                              smooth={true}
                              color="#1677ff"
                              areaStyle={{ fill: 'l(270) 0:#ffffff 1:#1677ff' }}
                            />
                         </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </motion.div>
          </Col>

          {/* Sidebar Column */}
          <Col span={6}>
            {/* Common Functions (Renamed from Common Laboratory Functions) */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }} styles={{ body: { padding: '16px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text strong>常用功能</Text>
                  <Button type="link" size="small" style={{ color: '#94a3b8', padding: 0 }}>管理 <SettingOutlined /></Button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {commonTools.map((tool, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                      {tool.icon}
                      <Text style={{ fontSize: 12, marginTop: 8 }}>{tool.title}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* To-do List */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }} styles={{ body: { padding: '16px' } }}>
                <Text strong style={{ display: 'block', marginBottom: 16 }}>我的待办</Text>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                   <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RobotOutlined style={{ color: '#3b82f6' }} /></div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>3</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>在线告警</Text>
                      </div>
                   </div>
                   <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileSearchOutlined style={{ color: '#ef4444' }} /></div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>5</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>待抽检</Text>
                      </div>
                   </div>
                   <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DeploymentUnitOutlined style={{ color: '#f59e0b' }} /></div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>2</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>待评测</Text>
                      </div>
                   </div>
                   <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleOutlined style={{ color: '#10b981' }} /></div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>18</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>已验收</Text>
                      </div>
                   </div>
                </div>
              </Card>
            </motion.div>

            {/* Schedule */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }} styles={{ body: { padding: '16px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text strong>数采与研发日程</Text>
                  <Button type="link" size="small" style={{ color: '#94a3b8', padding: 0 }}>更多 <RightOutlined style={{ fontSize: 10 }} /></Button>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>2026-03-13</Text>
                  <span style={{ float: 'right', color: '#1677ff', cursor: 'pointer', fontSize: 12 }}>回到今日</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                   {[10, 11, 12, 13, 14].map((day, i) => (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px', borderRadius: 4, background: i === 3 ? '#1677ff' : 'transparent', color: i === 3 ? '#fff' : '#000' }}>
                        <Text style={{ fontSize: 10, color: i === 3 ? '#fff' : '#94a3b8' }}>{['二', '三', '四', '五', '六'][i]}</Text>
                        <Text strong style={{ color: i === 3 ? '#fff' : '#000' }}>{day}</Text>
                        {i === 3 && <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#fff' }}></div>}
                     </div>
                   ))}
                </div>

                <List
                  dataSource={todoList}
                  renderItem={item => (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 4, background: item.status === 'meeting' ? '#e0f2fe' : item.status === 'research' ? '#fff7ed' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {item.status === 'meeting' ? <SolutionOutlined style={{ color: '#3b82f6', fontSize: 12 }} /> : item.status === 'research' ? <ThunderboltOutlined style={{ color: '#f59e0b', fontSize: 12 }} /> : <CheckCircleOutlined style={{ color: '#10b981', fontSize: 12 }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong style={{ fontSize: 12 }}>{item.title}</Text>
                          <Text type="link" style={{ fontSize: 11 }}>详情</Text>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <Tag color={item.status === 'meeting' ? 'blue' : item.status === 'research' ? 'orange' : 'green'} style={{ fontSize: 10, lineHeight: '16px', height: 16, margin: 0, padding: '0 4px', border: 'none' }}>{item.type}</Tag>
                          <Text type="secondary" style={{ fontSize: 10 }}>{item.time}</Text>
                        </div>
                      </div>
                    </div>
                  )}
                />
                <Button block icon={<PlusOutlined />} size="small" style={{ borderRadius: 4, borderStyle: 'dashed', marginTop: 8 }}>添加实验计划</Button>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card bordered={false} style={{ borderRadius: 12 }} styles={{ body: { padding: '16px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text strong>实验室通告</Text>
                  <Button type="link" size="small" style={{ color: '#94a3b8', padding: 0 }}>更多 <RightOutlined style={{ fontSize: 10 }} /></Button>
                </div>
                <List
                  dataSource={notifications}
                  renderItem={item => (
                    <List.Item style={{ padding: '8px 0', border: 'none' }}>
                       <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 8 }}>
                          <Tag color={item.type === '告警' ? 'red' : item.type === '系统' ? 'blue' : 'green'} style={{ margin: 0, borderRadius: 2, fontSize: 10, padding: '0 4px' }}>{item.type}</Tag>
                          <Text ellipsis style={{ flex: 1, fontSize: 12 }}>{item.title}</Text>
                          <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{item.date}</Text>
                       </div>
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>

      <style jsx global>{`
        .workbench-container .ant-card {
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }
        .sop-action-card:hover {
          transform: scale(1.02);
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.1);
          border-color: #1677ff !important;
        }
        .workbench-container .ant-card-body {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        .workbench-container .ant-card-body::-webkit-scrollbar {
          height: 4px;
        }
        .workbench-container .ant-card-body::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </MainLayout>
  );
}
