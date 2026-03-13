'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Space, Input, Form, Card, Typography, Tabs, Modal, Switch, App } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';

const { Title } = Typography;

const sceneData = [
    { key: '1', id: 1, name: '桌面抓取', desc: '桌面场景下的物体抓取任务', status: true },
    { key: '2', id: 2, name: '仓库搬运', desc: '仓库场景下的物体搬运任务', status: true },
    { key: '3', id: 3, name: '桌面放置', desc: '桌面场景下的物体放置任务', status: true },
    { key: '4', id: 4, name: '分拣场景', desc: '分拣不同颜色/形状物体', status: false },
    { key: '5', id: 5, name: '装配场景', desc: '零部件装配操作场景', status: true },
];

const actionData = [
    { key: '1', id: 1, name: '抓取', desc: '机器人端执行器抓取动作', status: true },
    { key: '2', id: 2, name: '放置', desc: '机器人端执行器放置动作', status: true },
    { key: '3', id: 3, name: '搬运', desc: '机器人从A点运动到B点', status: true },
    { key: '4', id: 4, name: '推', desc: '机器人推动物体', status: true },
    { key: '5', id: 5, name: '拉', desc: '机器人拉动物体', status: false },
    { key: '6', id: 6, name: '旋转', desc: '机器人旋转物体', status: true },
];

const objectData = [
    { key: '1', id: 1, name: '红色方块', desc: '5cm红色正方体木块', status: true },
    { key: '2', id: 2, name: '蓝色圆柱', desc: '直径3cm蓝色圆柱体', status: true },
    { key: '3', id: 3, name: '绿色球体', desc: '直径4cm绿色球体', status: true },
    { key: '4', id: 4, name: '黄色三角', desc: '三角形积木', status: false },
    { key: '5', id: 5, name: '杯子', desc: '标准水杯', status: true },
];

function ConfigTable({ data, type, addLabel }) {
  const { message } = App.useApp();
    const [addOpen, setAddOpen] = useState(false);

    const columns = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
        { title: `${type}名称`, dataIndex: 'name', key: 'name', width: 200 },
        { title: '描述', dataIndex: 'desc', key: 'desc' },
        {
            title: '生效状态', dataIndex: 'status', key: 'status', width: 120,
            render: (s) => <Tag color={s ? 'success' : 'default'}>{s ? '启用' : '停用'}</Tag>,
        },
        {
            title: '操作', key: 'action', width: 150, fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button type="link" size="small" onClick={() => message.success(record.status ? '已停用' : '已启用')}>
                        {record.status ? '停用' : '启用'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between' }}>
                <Form layout="inline">
                    <Form.Item label={`${type}名称`}><Input placeholder={`请输入${type}名称`} allowClear style={{ width: 200 }} /></Form.Item>
                    <Form.Item><Space><Button type="primary" icon={<SearchOutlined />}>查询</Button><Button icon={<ReloadOutlined />}>重置</Button></Space></Form.Item>
                </Form>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>{addLabel}</Button>
            </div>
            <Table rowSelection={{ type: 'checkbox', fixed: 'left' }} scroll={{ x: 'max-content' }} columns={columns} dataSource={data} pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} />

            <Modal title={addLabel} open={addOpen} onCancel={() => setAddOpen(false)} onOk={() => { setAddOpen(false); message.success('新增成功'); }} okText="确定" cancelText="取消">
                <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item label={`${type}名称`} required><Input placeholder={`请输入${type}名称`} /></Form.Item>
                    <Form.Item label="描述"><Input.TextArea rows={3} placeholder="请输入描述" /></Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default function ConfigPage() {
  const { message } = App.useApp();
    return (
            <MainLayout>
                <div className="page-header"><h3 className="page-header-title">配置管理</h3></div>
                <Card>
                    <Tabs
                        defaultActiveKey="scene"
                        items={[
                            { key: 'scene', label: '采集场景', children: <ConfigTable data={sceneData} type="采集场景" addLabel="新增采集场景" /> },
                            { key: 'action', label: '动作库', children: <ConfigTable data={actionData} type="动作" addLabel="新增动作" /> },
                            { key: 'object', label: '对象库', children: <ConfigTable data={objectData} type="对象" addLabel="新增对象" /> },
                        ]}
                    />
                </Card>
            </MainLayout>
    );
}
