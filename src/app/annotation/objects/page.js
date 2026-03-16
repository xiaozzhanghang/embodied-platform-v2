'use client';

import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Table, Space, DatePicker, Select, Modal, Form, Tag, Typography, Tooltip, Divider, Checkbox, message } from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    FolderOpenOutlined,
    AppstoreOutlined,
    GoldOutlined,
    CloseCircleFilled,
    CheckSquareFilled,
    PushpinFilled,
    CloseOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/MainLayout';

const { Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const { Option } = Select;

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
];

export default function ObjectLibraryPage() {
    const [data, setData] = useState(initialData);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('饮品类');
    
    // Management states
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagEnName, setNewTagEnName] = useState('');

    // Manage categories and tags state
    const [allCategories, setAllCategories] = useState([
        { name: '饮品类', count: 12, tags: [
            { id: '1', zh: '碳酸饮料', en: 'Soda' },
            { id: '2', zh: '天然矿泉水', en: 'Mineral' },
            { id: '3', zh: '奶茶/品边饮料', en: 'Milk Tea' },
            { id: '4', zh: '矿泉水/泉水', en: 'Water' },
            { id: '5', zh: '果汁饮料', en: 'Juice' },
            { id: '6', zh: '乳制品饮料', en: 'Dairy' },
            { id: '7', zh: '奶茶/泡沫饮品', en: 'Tea' },
            { id: '8', zh: '维生素饮料', en: 'Vitamin' },
            { id: '9', zh: '功能饮品', en: 'Function' },
            { id: '10', zh: '运动饮料', en: 'Sport' },
            { id: '11', zh: '茶饮', en: 'Tea' },
            { id: '12', zh: '草本饮品', en: 'Herbal' }
        ]},
        { name: '酒类', count: 7, tags: [
            { id: '13', zh: '啤酒', en: 'Beer' },
            { id: '14', zh: '白酒', en: 'Biajiu' },
            { id: '15', zh: '红酒', en: 'Wine' },
            { id: '16', zh: '洋酒', en: 'Whisky' },
            { id: '17', zh: '黄酒', en: 'Rice Wine' },
            { id: '18', zh: '起泡酒', en: 'Sparkling' },
            { id: '19', zh: '鸡尾酒', en: 'Cocktail' }
        ]},
        { name: '零食类', count: 8, tags: [
            { id: '20', zh: '薯片', en: 'Chips' },
            { id: '21', zh: '坚果', en: 'Nuts' },
            { id: '22', zh: '巧克力', en: 'Choco' },
            { id: '23', zh: '饼干', en: 'Biscuit' },
            { id: '24', zh: '糖果', en: 'Candy' },
            { id: '25', zh: '肉干', en: 'Jerky' },
            { id: '26', zh: '海苔', en: 'Seaweed' },
            { id: '27', zh: '果干', en: 'Dry Fruit' }
        ]},
        { name: '日常用品', count: 4, tags: [
            { id: '28', zh: '纸巾', en: 'Tissue' },
            { id: '29', zh: '洗衣液', en: 'Laundry' },
            { id: '30', zh: '洗发水', en: 'Shampoo' },
            { id: '31', zh: '牙膏', en: 'Toothpaste' }
        ]},
        { name: '工具类', count: 3, tags: [
            { id: '32', zh: '扳手', en: 'Wrench' },
            { id: '33', zh: '螺丝刀', en: 'Driver' },
            { id: '34', zh: '钳子', en: 'Pliers' }
        ]},
        { name: '家具类', count: 4, tags: [
            { id: '35', zh: '沙发', en: 'Sofa' },
            { id: '36', zh: '桌子', en: 'Table' },
            { id: '37', zh: '椅子', en: 'Chair' },
            { id: '38', zh: '床', en: 'Bed' }
        ]},
        { name: '区域', count: 4, tags: [
            { id: '39', zh: '客厅', en: 'Living' },
            { id: '40', zh: '卧室', en: 'Bedroom' },
            { id: '41', zh: '厨房', en: 'Kitchen' },
            { id: '42', zh: '卫生间', en: 'Toilt' }
        ]}
    ]);

    const activeCatData = allCategories.find(c => c.name === activeCategory) || allCategories[0];
    const primaryCategories = allCategories.map(({ name, count }) => ({ name, count }));
    const secondaryTags = activeCatData.tags;

    const onConfirmAddCategory = () => {
        if (!newCategoryName.trim()) {
            setIsAddingCategory(false);
            return;
        }
        if (allCategories.find(c => c.name === newCategoryName)) {
            message.warning('分类已存在');
            return;
        }
        setAllCategories([...allCategories, { name: newCategoryName, count: 0, tags: [] }]);
        setNewCategoryName('');
        setIsAddingCategory(false);
        message.success('分类添加成功');
    };

    const onConfirmAddTag = () => {
        if (!newTagName.trim()) {
            setIsAddingTag(false);
            return;
        }
        setAllCategories(allCategories.map(cat => {
            if (cat.name === activeCategory) {
                if (cat.tags.find(t => t.zh === newTagName)) {
                    message.warning('标签已存在');
                    return cat;
                }
                const newTag = { 
                    id: Date.now().toString(), 
                    zh: newTagName, 
                    en: newTagEnName || 'Item' 
                };
                message.success('标签添加成功');
                return { ...cat, tags: [...cat.tags, newTag], count: cat.tags.length + 1 };
            }
            return cat;
        }));
        setNewTagName('');
        setNewTagEnName('');
        setIsAddingTag(false);
    };

    const handleDeleteTag = (tagId) => {
        setAllCategories(allCategories.map(cat => {
            if (cat.name === activeCategory) {
                return { ...cat, tags: cat.tags.filter(t => t.id !== tagId), count: cat.tags.length - 1 };
            }
            return cat;
        }));
        message.info('标签已移除');
    };

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
            <Layout style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', minHeight: 'calc(100vh - 120px)', boxShadow: 'none' }}>
                {/* Left Sidebar - Category Tree */}
                <Sider width={240} style={{ background: '#fff', boxShadow: 'none', borderRight: '1px solid #d9d9d9' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #d9d9d9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 14 }}>物体类型</Text>
                        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setIsTypeModalOpen(true)}>去添加</Button>
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
                            <Option value="industry">Industry(工业)</Option>
                            <Option value="kitchen">Kitchen(厨房)</Option>
                        </Select>
                        <Select placeholder="请选择物体类型" style={{ width: 180 }} allowClear>
                            <Option value="drink">饮品类</Option>
                            <Option value="wine">酒类</Option>
                            <Option value="snacks">零食类</Option>
                        </Select>
                        <Input placeholder="请输入名称" style={{ width: 180 }} allowClear />
                        <RangePicker style={{ width: 260 }} />
                        <Space style={{ marginLeft: 'auto' }}>
                            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
                            <Button icon={<ReloadOutlined />}>重置</Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>添加</Button>
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
                                showTotal: (total) => `共 ${total} 条`,
                                style: { marginTop: 16 }
                            }}
                            scroll={{ x: 1200, y: 'calc(100vh - 350px)' }}
                            onRow={(record) => ({
                                onMouseEnter: () => setHoveredRow(record.key),
                                onMouseLeave: () => setHoveredRow(null),
                            })}
                        />
                    </div>
                </Content>
            </Layout>

            {/* Modal 1: Object Type Management (Category & Tag Manager) */}
            <Modal
                title="物体类型管理"
                open={isTypeModalOpen}
                onCancel={() => setIsTypeModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsTypeModalOpen(false)}>取消</Button>,
                    <Button key="save" type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => setIsTypeModalOpen(false)}>保存</Button>
                ]}
                width={800}
                centered
                bodyStyle={{ padding: '20px 24px' }}
            >
                <div style={{ display: 'flex', border: '1px solid #f0f0f0', borderRadius: 4, overflow: 'hidden', height: 480 }}>
                    {/* Left Panel: Primary Categories */}
                    <div style={{ 
                        flex: 1, 
                        borderRight: '1px solid #f0f0f0', 
                        display: 'flex', 
                        flexDirection: 'column',
                        background: '#fff'
                    }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            <Text strong>一级分类</Text>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                            {primaryCategories.map(cat => (
                                <div 
                                    key={cat.name} 
                                    onClick={() => setActiveCategory(cat.name)}
                                    style={{ 
                                        padding: '10px 16px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: activeCategory === cat.name ? '#f0f7ff' : 'transparent',
                                        borderRight: activeCategory === cat.name ? '2px solid #1890ff' : 'none'
                                    }}
                                >
                                    <Text style={{ color: activeCategory === cat.name ? '#1890ff' : 'inherit' }}>{cat.name}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{cat.count}</Text>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
                            {isAddingCategory ? (
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <Input 
                                        size="small" 
                                        autoFocus 
                                        placeholder="分类名称" 
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        onPressEnter={onConfirmAddCategory}
                                    />
                                    <Button size="small" type="primary" style={{ padding: '0 8px' }} onClick={onConfirmAddCategory}>OK</Button>
                                    <Button size="small" icon={<CloseOutlined />} style={{ padding: '0 8px' }} onClick={() => setIsAddingCategory(false)} />
                                </div>
                            ) : (
                                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setIsAddingCategory(true)}>添加一级分类</Button>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Secondary Tags */}
                    <div style={{ 
                        flex: 1.5, 
                        display: 'flex', 
                        flexDirection: 'column',
                        background: '#fff'
                    }}>
                        <div style={{ 
                            padding: '12px 16px', 
                            borderBottom: '1px solid #f0f0f0', 
                            background: '#fafafa',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text strong>{activeCategory} · 二级标签</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{secondaryTags.length} 标签</Text>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '12px',
                                alignContent: 'start'
                            }}>
                                {secondaryTags.map(tag => (
                                    <div 
                                        key={tag.id} 
                                        style={{ 
                                            background: '#40a9ff', 
                                            borderRadius: '6px', 
                                            padding: '8px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            color: '#fff',
                                            height: '42px',
                                            boxShadow: '0 2px 4px rgba(64, 169, 255, 0.2)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, overflow: 'hidden' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tag.zh}</span>
                                            <span style={{ fontSize: '11px', opacity: 0.85, whiteSpace: 'nowrap' }}>({tag.en})</span>
                                        </div>
                                        <CloseOutlined 
                                            style={{ fontSize: '12px', cursor: 'pointer', marginLeft: 8 }} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTag(tag.id);
                                            }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {isAddingTag ? (
                            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fbfbfb', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <Input 
                                        size="small" 
                                        placeholder="中文名称" 
                                        autoFocus
                                        value={newTagName}
                                        onChange={e => setNewTagName(e.target.value)}
                                    />
                                    <Input 
                                        size="small" 
                                        placeholder="英文名称" 
                                        value={newTagEnName}
                                        onChange={e => setNewTagEnName(e.target.value)}
                                        onPressEnter={onConfirmAddTag}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                    <Button size="small" onClick={() => setIsAddingTag(false)}>取消</Button>
                                    <Button size="small" type="primary" onClick={onConfirmAddTag}>确认添加</Button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
                                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setIsAddingTag(true)}>添加二级标签</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Modal 2: Add Object (Image 2) */}
            <Modal
                title="添加物体"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                onOk={() => setIsAddModalOpen(false)}
                okText="确定"
                cancelText="取消"
                width={650}
                centered
            >
                <Form layout="vertical" style={{ marginTop: 20 }}>
                    <Title level={5} style={{ marginBottom: 16 }}>基本信息</Title>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <Form.Item label="名称" required extra={<div style={{ textAlign: 'right', fontSize: 12, color: '#999' }}>0 / 50</div>}>
                            <Input placeholder="请输入名称" />
                        </Form.Item>
                        <Form.Item label="英文名称" extra={<div style={{ textAlign: 'right', fontSize: 12, color: '#999' }}>0 / 50</div>}>
                            <Input placeholder="English name" />
                        </Form.Item>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: -10 }}>
                        <Form.Item label="物体类型" required>
                            <Select placeholder="请选择类型">
                                <Option value="drink">饮品类</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="场景" required>
                            <Select placeholder="请选择场景">
                                <Option value="kitchen">Kitchen(厨房)</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item label="材质特性">
                        <Select placeholder="请选择材质（可选）" />
                    </Form.Item>

                    <Title level={5} style={{ marginBottom: 16, marginTop: 10 }}>物体图片</Title>
                    <div style={{
                        border: '1px dashed #d9d9d9',
                        borderRadius: 8,
                        padding: '40px 20px',
                        textAlign: 'center',
                        background: '#fafafa',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: '#f0f0f0',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <PlusOutlined style={{ fontSize: 20, color: '#999' }} />
                        </div>
                        <div>
                            <Text style={{ color: '#1890ff' }}>点击上传</Text> <Text type="secondary">或拖拽图片至此</Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                            支持 JPG、JPEG、PNG、GIF，不超过 2MB
                        </Text>
                    </div>
                </Form>
            </Modal>
        </MainLayout>
    );
}
