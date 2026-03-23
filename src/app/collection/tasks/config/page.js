'use client';

import React, { useState } from 'react';
import { Card, Steps, Radio, Select, Button, Table, InputNumber, Upload, Switch, Input, Space, Typography, Row, Col } from 'antd';
import { PlusOutlined, CloudUploadOutlined, HolderOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import MainLayout from '@/components/MainLayout';

const { Step } = Steps;
const { Text } = Typography;
const { TextArea } = Input;

export default function TaskConfigPage() {
    const [stepData, setStepData] = useState([
        { key: '1', step: 1, endEffector: 'RightHand(右灵巧手)', skill: 'Pick(拿起)', object: 'USB线', from: '台面', to: '台面上方' },
        { key: '2', step: 2, endEffector: 'RightHand(右灵巧手)', skill: 'Place(放置)', object: 'USB线', from: '台面上方', to: '四宫格料框' },
        { key: '3', step: 3, endEffector: 'RightHand(右灵巧手)', skill: 'Pick(拿起)', object: 'HDMI线', from: '台面', to: '台面上方' },
        { key: '4', step: 4, endEffector: 'RightHand(右灵巧手)', skill: 'Place(放置)', object: 'HDMI线', from: '台面上方', to: '四宫格料框' },
        { key: '5', step: 5, endEffector: 'RightHand(右灵巧手)', skill: 'Pick(拿起)', object: '电源线', from: '台面', to: '台面上方' },
        { key: '6', step: 6, endEffector: 'RightHand(右灵巧手)', skill: 'Place(放置)', object: '电源线', from: '台面上方', to: '四宫格料框' },
        { key: '7', step: 7, endEffector: 'RightHand(右灵巧手)', skill: 'Pick(拿起)', object: '网线', from: '台面', to: '台面上方' },
        { key: '8', step: 8, endEffector: 'RightHand(右灵巧手)', skill: 'Place(放置)', object: '网线', from: '台面上方', to: '四宫格料框' },
    ]);

    const handleAddStep = () => {
        const newStepNum = stepData.length + 1;
        setStepData([...stepData, {
            key: newStepNum.toString(),
            step: newStepNum,
            endEffector: 'RightHand(右灵巧手)',
            skill: 'Pick(拿起)',
            object: 'USB线',
            from: '台面',
            to: '台面上方'
        }]);
    };

    const handleDeleteStep = (key) => {
        setStepData(stepData.filter(item => item.key !== key).map((item, index) => ({ ...item, step: index + 1 })));
    };

    const columns = [
        {
            title: '步骤',
            dataIndex: 'step',
            key: 'step',
            width: 80,
            render: (text) => (
                <Space>
                    <HolderOutlined style={{ color: '#bfbfbf', cursor: 'grab' }} />
                    {text}
                </Space>
            )
        },
        {
            title: '执行末端类型',
            dataIndex: 'endEffector',
            key: 'endEffector',
            width: 180,
            render: (val) => <Select defaultValue={val} style={{ width: '100%' }} options={[{ value: val, label: val }, { value: 'LeftHand', label: 'LeftHand(左灵巧手)' }]} />
        },
        {
            title: '原子技能',
            dataIndex: 'skill',
            key: 'skill',
            width: 140,
            render: (val) => <Select defaultValue={val} style={{ width: '100%' }} options={[{ value: 'Pick(拿起)', label: 'Pick(拿起)' }, { value: 'Place(放置)', label: 'Place(放置)' }]} />
        },
        {
            title: '操作对象',
            dataIndex: 'object',
            key: 'object',
            width: 140,
            render: (val) => <Select defaultValue={val} style={{ width: '100%' }} options={[{ value: 'USB线', label: 'USB线' }, { value: 'HDMI线', label: 'HDMI线' }, { value: '电源线', label: '电源线' }, { value: '网线', label: '网线' }]} />
        },
        {
            title: '操作目标',
            key: 'target',
            render: (_, record) => (
                <Space>
                    <Text type="secondary">从</Text>
                    <Select defaultValue={record.from} style={{ width: 100 }} options={[{ value: '台面', label: '台面' }, { value: '台面上方', label: '台面上方' }]} />
                    <Text type="secondary">至</Text>
                    <Select defaultValue={record.to} style={{ width: 120 }} options={[{ value: '台面上方', label: '台面上方' }, { value: '四宫格料框', label: '四宫格料框' }]} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteStep(record.key)} />
                </Space>
            )
        }
    ];

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}
            >
                <Card variant="borderless" className="shadow-sm" style={{ borderRadius: '12px' }} styles={{ body: { padding: '32px' } } }>

                    {/* Stepper Header */}
                    <div style={{ padding: '0 100px', marginBottom: 48  } }>
                        <Steps current={1} size="default">
                            <Step title="基础信息" description="已完成" />
                            <Step title="任务配置" description="进行中" />
                            <Step title="派发任务" description="待处理" />
                        </Steps>
                    </div>

                    <div style={{ marginBottom: 32  } }>
                        <Row gutter={24} align="middle">
                            <Col span={14}>
                                <Space size="large">
                                    <span style={{ color: '#ff4d4f'  } }>*</span>
                                    <Text strong>动作步骤</Text>
                                    <Radio.Group defaultValue="format">
                                        <Radio value="format">格式化步骤</Radio>
                                        <Radio value="nlp">自然语言描述步骤</Radio>
                                    </Radio.Group>
                                </Space>
                            </Col>
                            <Col span={10}>
                                <div style={{ display: 'flex', alignItems: 'center'  } }>
                                    <span style={{ color: '#ff4d4f', marginRight: 8  } }>*</span>
                                    <Text strong style={{ marginRight: 16  } }>任务模板</Text>
                                    <Select defaultValue="线缆管理" style={{ width: 200 }} options={[{ value: '线缆管理', label: '线缆管理' }, { value: '桌面整理', label: '桌面整理' }]} />
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } }>
                        <Text strong style={{ fontSize: 16  } }>格式化步骤配置</Text>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStep} style={{ background: '#69b1ff'  } }>新增步骤</Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={stepData}
                        pagination={false}
                        size="middle"
                        bordered
                        style={{ marginBottom: 32 }}
                    />

                    <Row gutter={48} style={{ marginBottom: 24  } }>
                        <Col span={12}>
                            <Space>
                                <span style={{ color: '#ff4d4f'  } }>*</span>
                                <Text>采集数量</Text>
                                <InputNumber placeholder="请输入采集数量" style={{ width: 200 }} />
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space align="start">
                                <Text>上传文件</Text>
                                <div>
                                    <Upload>
                                        <Button type="primary" icon={<CloudUploadOutlined />}>上传文件</Button>
                                    </Upload>
                                    <div style={{ marginTop: 8, color: '#bfbfbf', fontSize: 12  } }>请上传场景的layout文件</div>
                                </div>
                            </Space>
                        </Col>
                    </Row>

                    <div style={{ marginBottom: 24  } }>
                        <Space>
                            <Text>是否为货架</Text>
                            <Switch />
                        </Space>
                    </div>

                    <Row gutter={24} style={{ marginBottom: 32  } }>
                        <Col span={12}>
                            <div style={{ marginBottom: 8  } }><Text>场景初始状态</Text></div>
                            <TextArea placeholder="请描述场景初始状态" rows={4} maxLength={500} showCount />
                        </Col>
                        <Col span={12}>
                            <div style={{ marginBottom: 8  } }><Text>英文场景初始状态</Text></div>
                            <TextArea placeholder="请描述英文场景初始状态" rows={4} maxLength={500} showCount />
                        </Col>
                    </Row>

                    <div style={{ textAlign: 'right', marginTop: 48, paddingTop: 24, borderTop: '1px solid #f0f0f0'  } }>
                        <Space size="middle">
                            <Button size="large">取消</Button>
                            <Button size="large">上一步</Button>
                            <Button type="primary" size="large">确定</Button>
                        </Space>
                    </div>

                </Card>
            </motion.div>
        </MainLayout>
    );
}
