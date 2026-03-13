'use client';

import React, { useState } from 'react';
import { Card, Tabs, Input, Button, Table, Space, Tag, Typography, Dropdown, Menu, Avatar } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, StopOutlined, SettingOutlined, FilterOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import MainLayout from '@/components/MainLayout';

const { TabPane } = Tabs;
const { Title } = Typography;

export default function DeviceManagementPage() {
    const [activeTab, setActiveTab] = useState('2'); // 默认定位在“机器人部件”如截图所示

    const columns = [
        {
            title: '部件名称',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: '英文名称',
            dataIndex: 'englishName',
            key: 'englishName',
            width: 200,
        },
        {
            title: '传感器描述',
            dataIndex: 'sensorDesc',
            key: 'sensorDesc',
            width: 150,
        },
        {
            title: 'URDF',
            dataIndex: 'urdf',
            key: 'urdf',
            width: 120,
        },
        {
            title: '设备图片',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: () => <span style={{ color: '#94a3b8', fontSize: 13 }}>暂无图片</span>
        },
        {
            title: '注册时间',
            dataIndex: 'registerTime',
            key: 'registerTime',
            width: 180,
            render: t => <span style={{ color: '#64748b', fontSize: 13 }}>{t}</span>
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 180,
            render: t => <span style={{ color: '#64748b', fontSize: 13 }}>{t}</span>
        },
        {
            title: '设备状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={status === 'run' ? 'success' : 'default'} style={{ borderRadius: 4 }}>
                    {status === 'run' ? '在线' : '离线'}
                </Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button type="text" style={{ color: '#3b82f6' }}>监控</Button>
                    <Button type="text" style={{ color: '#3b82f6' }}>设置</Button>
                    <Button type="text" style={{ color: record.status === 'run' ? '#ef4444' : '#10b981' }}>
                        {record.status === 'run' ? '停用' : '启用'}
                    </Button>
                </Space>
            ),
        },
    ];

    const data = [
        { key: '1', name: '灵巧手_右', englishName: 'LingQiaoShou_You', sensorDesc: '', urdf: '', registerTime: '2025-12-20 10:00:00', updateTime: '2025-12-20 10:00:00', status: 'run' },
        { key: '2', name: '夹爪_右', englishName: 'JiaZhao_You', sensorDesc: '', urdf: '', registerTime: '2025-12-20 11:00:00', updateTime: '2025-12-20 11:00:00', status: 'run' },
        { key: '3', name: '手部右相机_红外', englishName: 'ShouBuYouXiangJi_HongWai', sensorDesc: '', urdf: '', registerTime: '2025-12-19 15:30:00', updateTime: '2025-12-19 15:30:00', status: 'run' },
        { key: '4', name: '手部右相机_深度', englishName: 'ShouBuYouXiangJi_ShenDu', sensorDesc: '', urdf: '', registerTime: '2025-12-19 15:35:00', updateTime: '2025-12-19 15:35:00', status: 'run' },
        { key: '5', name: '手部左相机_红外', englishName: 'ShouBuZuoXiangJi_HongWai', sensorDesc: '', urdf: '', registerTime: '2025-12-19 16:00:00', updateTime: '2025-12-19 16:00:00', status: 'run' },
        { key: '6', name: '手部左相机_深度', englishName: 'ShouBuZuoXiangJi_ShenDu', sensorDesc: '', urdf: '', registerTime: '2025-12-19 16:05:00', updateTime: '2025-12-19 16:05:00', status: 'run' },
        { key: '7', name: '灵巧手_左', englishName: 'LingQiaoShou_Zuo', sensorDesc: '', urdf: '', registerTime: '2025-12-19 16:30:00', updateTime: '2025-12-19 16:30:00', status: 'run' },
        { key: '8', name: '夹爪_左', englishName: 'JiaZhao_Zuo', sensorDesc: '', urdf: '', registerTime: '2025-12-19 17:00:00', updateTime: '2025-12-19 17:00:00', status: 'run' },
        { key: '9', name: '机器人雷达', englishName: 'JiQiRenLeiDa', sensorDesc: '', urdf: '', registerTime: '2025-12-19 17:30:00', updateTime: '2025-12-19 17:30:00', status: 'run' },
        { key: '10', name: '机器人IMU', englishName: 'JiQiRenIMU', sensorDesc: '', urdf: '', registerTime: '2025-12-19 18:00:00', updateTime: '2025-12-19 18:00:00', status: 'run' },
    ];

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="v2-global-card"
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>采集设备大厅</Title>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>统一纳管所有具身智能训练所需的物理机器人和传感部件。</p>
                        
                        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large" tabBarGutter={32} style={{ marginTop: 16 }}>
                            <TabPane tab="机器人整机" key="1" />
                            <TabPane tab="传感器与部件" key="2" />
                        </Tabs>
                    </div>
                </div>

                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            placeholder="搜索设备名称、IP 或特征码..."
                            style={{ width: 280 }}
                            size="large"
                            allowClear
                        />
                        <Button size="large" icon={<FilterOutlined />}>高级筛选</Button>
                    </Space>
                    <Space>
                        <Button size="large" icon={<SettingOutlined />}>批量管理</Button>
                        <Button type="primary" size="large" icon={<PlusOutlined />}>
                            录入新设备
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowClassName={() => 'custom-table-row'}
                    pagination={{
                        total: 27,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条`
                    }}
                    size="middle"
                    rowKey="key"
                    tableLayout="auto"
                />
            </motion.div>
            <style>{`
                .custom-table-row:hover > td { background-color: #f8fafc !important; }
                .ant-tabs-nav::before { border-bottom: none !important; }
                .ant-table-thead > tr > th { background: transparent !important; color: #475569; font-weight: 600; border-bottom: 2px solid #f1f5f9; }
            `}</style>
        </MainLayout>
    );
}
