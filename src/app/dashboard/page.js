'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, DatePicker, Button, Space, Typography, Tooltip, Divider, Table, Tag, Avatar, Badge, Skeleton } from 'antd';
import { InfoCircleOutlined, FilterOutlined, DownOutlined, CalendarOutlined, ExpandOutlined, AlertOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { DualAxes } from '@ant-design/plots';
import MainLayout from '@/components/MainLayout';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

// Mock Data Builders
const generateChartData = (baseDuration, baseCount, periods) => {
    return periods.map((period, index) => ({
        time: period,
        duration: Number((baseDuration + Math.random() * 0.2).toFixed(3)),
        count: Math.floor(baseCount + Math.random() * 20),
    }));
};

const periods = ['2026-07', '2026-08', '2026-09', '2026-10'];

const collectionData = generateChartData(0.1, 5, periods);
const qaData = generateChartData(0.3, 10, periods);
const annotationData = generateChartData(0.05, 2, periods);
const reviewData = generateChartData(0.002, 1, periods);

// Reusable Chart Component matching the screenshot
const StatChartCard = ({ title, data, maxDuration, maxCount, loading }) => {
    const defaultChartConfig = {
        data: [data, data],
        xField: 'time',
        yField: ['duration', 'count'],
        slider: {
            x: {
                values: [0, 1],
            }
        },
        geometryOptions: [
            {
                geometry: 'column',
                color: '#3b82f6', // Blueprint dark blue
                columnWidthRatio: 0.4, // Make column distinct
                label: {
                    position: 'top',
                    style: { fill: '#8c8c8c' }
                }
            },
            {
                geometry: 'column', // Force second geometry to also be column implicitly by dodge? Actually G2 plot might overlap. 
                color: '#38bdf8', // Light blue
            },
        ],
        yAxis: {
            duration: {
                title: { text: '数据时长 (小时)', position: 'end' },
                max: maxDuration,
            },
            count: {
                title: { text: '条数', position: 'end' },
                max: maxCount,
            },
        },
        legend: {
            custom: true,
            position: 'top-left',
            items: [
                { id: '1', name: '数据时长 (小时)', color: '#3b82f6', marker: 'square' },
                { id: '2', name: '条数', color: '#38bdf8', marker: 'square' },
            ],
        },
        tooltip: {
            showMarkers: false,
        },
    };

    // To prevent overlapping columns in standard DualAxes (which doesn't support grouping across axes easily),
    // we use a trick: we will just render them as an overlapping bar design which looks ultra-modern,
    // or we render one as a line if overlapping is poor. Let's refine the config to use line for count locally to bypass the library limitation for now.
    const safeConfig = {
        data: [data, data],
        xField: 'time',
        yField: ['duration', 'count'],
        slider: { x: { values: [0, 1] } },
        geometryOptions: [
            { geometry: 'column', color: '#3b82f6', columnWidthRatio: 0.2 },
            { geometry: 'line', color: '#38bdf8', point: { shape: 'circle' } },
        ],
        yAxis: {
            duration: { title: { text: '数据时长 (小时)', position: 'end' } },
            count: { title: { text: `${title.replace(' ', '')}条数`, position: 'end' } },
        },
        legend: { position: 'top-left' }
    };

    return (
        <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%' }} styles={{ body: { padding: '20px 24px' } }}>
            <Skeleton active loading={loading} paragraph={{ rows: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <Text strong style={{ fontSize: 16 }}>{title}</Text>
                        <Tooltip title={`统计${title}的详细数据`}><InfoCircleOutlined style={{ color: '#bfbfbf' }} /></Tooltip>
                    </Space>
                    <Space>
                        <Text type="secondary" style={{ fontSize: 13 }}>已选字段(2)</Text>
                        <ExpandOutlined style={{ color: '#bfbfbf', cursor: 'pointer' }} />
                    </Space>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                    <Select defaultValue="60days" style={{ width: 120 }} options={[{ value: '60days', label: '最近60天' }, { value: '30days', label: '最近30天' }]} />
                    <RangePicker defaultValue={[dayjs('2026-01-06'), dayjs('2026-03-06')]} />
                </div>
                <div style={{ height: 320 }}>
                    <DualAxes {...safeConfig} />
                </div>
            </Skeleton>
        </Card>
    );
};


export default function DashboardPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const actionRequiredData = [
        { key: '1', id: 'TSK-1027', name: '厨房拣选泛化采集_v4', priority: 'High', type: '采集设备异常', message: '机械臂夹爪未能成功复位，设备已脱机', assign: 'Alice Smith' },
        { key: '2', id: 'TSK-1030', name: '厨房拣选泛化采集_v7', priority: 'Medium', type: '专家抽检请求', message: '标注置信度低于0.8，需要人工二次复核', assign: 'Admin (You)' },
        { key: '3', id: 'PROJ-01X', name: '桌面物品精细标注', priority: 'Low', type: '众包结算审核', message: '第一批 20,000 帧已验收，等待财务结算', assign: 'Admin (You)' },
        { key: '4', id: 'SIM-9920', name: '四足机器人全地形导航', priority: 'Medium', type: '仿真环境构建', message: '材质纹理加载失败，需更新资产包', assign: 'David Chen' },
    ];

    const actionColumns = [
        { title: '任务 / 资产 ID', dataIndex: 'id', key: 'id', render: t => <Text type="secondary" style={{ fontSize: 13 }}>{t}</Text>, width: 120 },
        { title: '关联名称', dataIndex: 'name', key: 'name', render: t => <Text strong style={{ color: '#0f172a' }}>{t}</Text>, width: 200 },
        { title: '优先级', dataIndex: 'priority', key: 'priority', render: p => <Tag color={p==='High'?'#ef4444':p==='Medium'?'#f59e0b':'#3b82f6'} style={{ border: 'none', borderRadius: 4 }}>{p==="High"?"紧急":p==="Medium"?"高":"中"}</Tag>, width: 100 },
        { title: '异常/待办类型', dataIndex: 'type', key: 'type', render: t => <Badge status="warning" text={t} />, width: 160 },
        { title: '详细描述', dataIndex: 'message', key: 'message', render: t => <Text style={{ color: '#475569' }}>{t}</Text> },
        { title: '处理人', dataIndex: 'assign', key: 'assign', render: a => <Space><Avatar size="small" style={{ backgroundColor: a.includes('You') ? '#10b981' : '#94a3b8' }}>{a[0]}</Avatar><Text style={{ fontSize: 13, color: '#334155' }}>{a}</Text></Space>, width: 150 },
        { title: '操作', key: 'action', fixed: 'right', render: () => <Button type="primary" size="small" style={{ borderRadius: 4, background: '#0f172a' }}>立即处理</Button>, width: 100, align: 'center' }
    ];

    return (
        <MainLayout>
            <div style={{ paddingBottom: 24, paddingRight: 8 }}>
                {/* GLOBAL FILTER BAR */}
                <Card variant="borderless" style={{ marginBottom: 24 }} styles={{ body: { padding: '16px 24px' } }}>
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Space size="large">
                                <Space>
                                    <FilterOutlined style={{ color: '#3b82f6' }} />
                                    <Text strong>全局时段筛选</Text>
                                </Space>
                                <Divider type="vertical" />
                                <Space>
                                    <Select defaultValue="custom" style={{ width: 100 }} variant="borderless">
                                        <Select.Option value="custom">自定义</Select.Option>
                                    </Select>
                                    <RangePicker placeholder={['请选择时间', '请选择时间']} variant="borderless" />
                                </Space>
                            </Space>
                        </Col>
                        <Col>
                            <Space size="large">
                                <Space>
                                    <Text type="secondary">数采中心</Text>
                                    <Select defaultValue="center1" style={{ width: 160 }} variant="borderless">
                                        <Select.Option value="center1">天奇数采中心</Select.Option>
                                    </Select>
                                </Space>
                                <Space>
                                    <Text type="secondary">项目</Text>
                                    <Select placeholder="请选择" style={{ width: 160 }} variant="borderless" />
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* CHARTS GRID */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <StatChartCard title="采集" data={collectionData} maxDuration={0.5} maxCount={40} loading={loading} />
                            </motion.div>
                        </Col>
                        <Col span={12}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <StatChartCard title="质检" data={qaData} maxDuration={0.6} maxCount={30} loading={loading} />
                            </motion.div>
                        </Col>
                        <Col span={12}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <StatChartCard title="标注" data={annotationData} maxDuration={0.15} maxCount={20} loading={loading} />
                            </motion.div>
                        </Col>
                        <Col span={12}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <StatChartCard title="审核" data={reviewData} maxDuration={0.02} maxCount={10} loading={loading} />
                            </motion.div>
                        </Col>
                    </Row>
                    
                    <Row style={{ marginTop: 24 }}>
                        <Col span={24}>
                            <motion.div variants={itemVariants}>
                                <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }} styles={{ body: { padding: '24px' } }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Space>
                                            <AlertOutlined style={{ color: '#ef4444', fontSize: 18 }} />
                                            <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>待办与异常收件箱</Title>
                                        </Space>
                                        <Button type="link">查看全部 (12)</Button>
                                    </div>
                                    <Table 
                                        rowSelection={{ type: 'checkbox', fixed: 'left' }}
                                        scroll={{ x: 'max-content' }}
                                        columns={actionColumns}
                                        dataSource={actionRequiredData}
                                        pagination={false}
                                        size="middle"
                                        loading={loading}
                                        rowClassName={() => 'custom-table-row'}
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                </motion.div>
            </div>
            
            <style>{`
              .custom-table-row:hover > td {
                background-color: #f8fafc !important;
              }
            `}</style>
        </MainLayout>
    );
}

