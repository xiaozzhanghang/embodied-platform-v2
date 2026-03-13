'use client';

import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Table, Space, DatePicker, Select, Modal, Form, Tag, Typography, Tooltip } from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    FolderOpenOutlined,
    AppstoreOutlined,
    GoldOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/MainLayout';

const { Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const { Text } = Typography;

// Mock Data for Categories Tree
const categoryItems = [
    {
        key: 'cat-drink',
        icon: <FolderOpenOutlined />,
        label: '饮品类',
    },
    {
        key: 'cat-wine',
        icon: <FolderOpenOutlined />,
        label: '酒类',
    },
    {
        key: 'cat-snacks',
        icon: <FolderOpenOutlined />,
        label: '零食类',
        children: [
            { key: 'snack-1', label: '方便食品类' },
            { key: 'snack-2', label: '罐头食品类' },
        ],
    },
    {
        key: 'cat-daily',
        icon: <FolderOpenOutlined />,
        label: '日常用品类',
        children: [
            { key: 'daily-1', label: '卫生用品' },
            { key: 'daily-2', label: '药品类' },
            { key: 'daily-3', label: '类别类' },
            { key: 'daily-4', label: '家具类' },
            { key: 'daily-5', label: '仓储类' },
            { key: 'daily-6', label: '机器本体' },
            { key: 'daily-7', label: '区域' },
        ],
    },
];

// Mock Data for Object Table
const initialData = [
    { key: '1', scene: 'Industry(工业)', name: '网线', enName: 'Network cable', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:51:50', updateTime: '2026-03-06 16:51:50' },
    { key: '2', scene: 'Industry(工业)', name: '电源线', enName: 'power cord', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:51:27', updateTime: '2026-03-06 16:51:27' },
    { key: '3', scene: 'Industry(工业)', name: '四宫格料框', enName: 'four-compar...', material: '塑料', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:50:52', updateTime: '2026-03-06 16:50:52' },
    { key: '4', scene: 'Industry(工业)', name: 'HDMI线', enName: 'HDMI cable', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:49:08', updateTime: '2026-03-06 16:49:08' },
    { key: '5', scene: 'Industry(工业)', name: 'USB线', enName: 'USB cable', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-03-06 16:48:35', updateTime: '2026-03-06 16:48:35' },
    { key: '6', scene: 'Region(区域)', name: '盘子左侧', enName: 'left side of t...', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:57:37', updateTime: '2026-02-27 09:18:35' },
    { key: '7', scene: 'Kitchen(厨房)', name: '盘子右侧', enName: 'right side of ...', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:54:43', updateTime: '2026-02-27 09:19:03' },
    { key: '8', scene: 'Kitchen(厨房)', name: '托盘正中', enName: 'center of the...', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:54:09', updateTime: '2026-02-27 09:19:19' },
    { key: '9', scene: 'Household(家居)', name: '台面上方', enName: 'on the table', material: '', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:53:11', updateTime: '2026-02-27 09:19:35' },
    { key: '10', scene: 'Kitchen(厨房)', name: '餐刀', enName: 'knife', material: '金属', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:43:52', updateTime: '2026-02-26 13:43:52' },
    { key: '11', scene: 'Kitchen(厨房)', name: '叉子', enName: 'fork', material: '金属', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:43:14', updateTime: '2026-02-26 13:43:14' },
    { key: '12', scene: 'Kitchen(厨房)', name: '盘子', enName: 'plate', material: '陶瓷', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:42:12', updateTime: '2026-02-26 13:42:12' },
    { key: '13', scene: 'Kitchen(厨房)', name: '桌子', enName: 'table', material: '木质', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:40:55', updateTime: '2026-02-26 13:40:55' },
    { key: '14', scene: 'Kitchen(厨房)', name: '托盘', enName: 'tray', material: '塑料', pic: '无图片', creator: '天奇管理员', updater: '天奇管理员', createTime: '2026-02-26 13:39:16', updateTime: '2026-02-26 13:39:16' },
];

export default function ObjectLibraryPage() {
    const [data, setData] = useState(initialData);
    const [hoveredRow, setHoveredRow] = useState(null);

    const columns = [
        { title: '场景', dataIndex: 'scene', key: 'scene', width: 150, ellipsis: true },
        { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
        { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150, ellipsis: true },
        { title: '材质特性', dataIndex: 'material', key: 'material', width: 100 },
        {
            title: '物体图片',
            dataIndex: 'pic',
            key: 'pic',
            width: 100,
            render: (text) => <Text type="secondary">{text}</Text>
        },
        { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
        { title: '更新人', dataIndex: 'updater', key: 'updater', width: 120 },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 160 },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle" style={{ opacity: hoveredRow === record.key ? 1 : 0.8, transition: 'opacity 0.2s' }}>
                    <Button type="link" size="small" icon={<EditOutlined />} style={{ padding: 0 }}>编辑</Button>
                    <Button type="link" size="small" danger icon={<DeleteOutlined />} style={{ padding: 0 }}>删除</Button>
                </Space>
            ),
        },
    ];

    return (
        <MainLayout>
            <Layout style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', minHeight: 'calc(100vh - 120px)' }}>
                {/* Left Sidebar - Category Tree */}
                <Sider width={240} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 14 }}>物体类型</Text>
                        <Button type="link" size="small" style={{ padding: 0 }}>去添加</Button>
                    </div>
                    <Menu
                        mode="inline"
                        defaultOpenKeys={['cat-snacks', 'cat-daily']}
                        style={{ height: 'calc(100% - 55px)', borderRight: 0, overflowY: 'auto' }}
                        items={categoryItems}
                    />
                </Sider>

                {/* Right Content - Table and Filters */}
                <Content style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    {/* Filters Toolbar */}
                    <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <Select placeholder="请选择场景" style={{ width: 160 }} allowClear>
                            <Select.Option value="industry">Industry(工业)</Select.Option>
                            <Select.Option value="kitchen">Kitchen(厨房)</Select.Option>
                        </Select>
                        <Input placeholder="请输入名称" style={{ width: 200 }} allowClear />
                        <RangePicker style={{ width: 260 }} />
                        <Space style={{ marginLeft: 'auto' }}>
                            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
                            <Button icon={<ReloadOutlined />}>重置</Button>
                            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#1890ff' }}>添加</Button>
                        </Space>
                    </div>

                    {/* Data Table */}
                    <div style={{ flex: 1 }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            size="middle"
                            pagination={{
                                total: 79,
                                pageSize: 20,
                                showSizeChanger: true,
                                showTotal: (total) => `共 ${total} 条`,
                                style: { marginTop: 16 }
                            }}
                            scroll={{ x: 1300, y: 'calc(100vh - 350px)' }}
                            onRow={(record) => {
                                return {
                                    onMouseEnter: () => setHoveredRow(record.key),
                                    onMouseLeave: () => setHoveredRow(null),
                                };
                            }}
                        />
                    </div>
                </Content>
            </Layout>
        </MainLayout>
    );
}
