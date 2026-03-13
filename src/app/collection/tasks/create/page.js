'use client';

import React, { useReducer, useEffect, useState } from 'react';
import { Button, Input, Select, Form, Row, Col, Table, Spin, Alert, Steps, Divider, Radio, Space } from 'antd';
import { AlertTriangle, AlertCircle, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';

// --- STATE MACHINE DEFINITIONS ---
const initialState = {
    status: 'IDLE', // IDLE, LOADING_DEVICES, READY, SUBMITTING, SUCCESS, ERROR
    projectInfo: { levelOneId: null, levelTwoId: null, taskName: '', taskPurpose: null, sceneCategory: null, taskBook: null, englishName: '', collectMode: null, subSceneCategory: null, remoteControlMode: null },
    deviceConfig: { deviceType: null, availableParts: [], selectedParts: [] },
    taskMeta: { dataGenMode: '真机', deleteAfterEnd: false, taskDesc: '' },
    errorLog: null,
};

function taskReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_PROJECT_INFO':
            return { ...state, projectInfo: { ...state.projectInfo, ...action.payload }, errorLog: null };

        case 'UPDATE_META':
            return { ...state, taskMeta: { ...state.taskMeta, ...action.payload }, errorLog: null };

        case 'SELECT_DEVICE_TYPE':
            if (state.deviceConfig.deviceType === action.payload) return state; // No change
            return {
                ...state,
                status: 'LOADING_DEVICES',
                projectInfo: { ...state.projectInfo, deviceType: action.payload },
                deviceConfig: { deviceType: action.payload, availableParts: [], selectedParts: [] },
                errorLog: null
            };

        case 'FETCH_PARTS_SUCCESS':
            return {
                ...state,
                status: 'READY',
                deviceConfig: { ...state.deviceConfig, availableParts: action.payload }
            };

        case 'FETCH_PARTS_FAIL':
            return {
                ...state,
                status: 'ERROR',
                errorLog: { field: 'device', message: action.payload || '网络连接失败，无法获取设备部件列表' }
            };

        case 'TOGGLE_PART_BULK': // action for table row selection
            return { ...state, deviceConfig: { ...state.deviceConfig, selectedParts: action.payload }, errorLog: null };

        case 'SUBMIT_TASK':
            return { ...state, status: 'SUBMITTING', errorLog: null };

        case 'SUBMIT_SUCCESS':
            return { ...state, status: 'SUCCESS' };

        case 'SET_ERROR':
            return { ...state, status: 'READY', errorLog: action.payload };

        case 'RESET':
            return { ...initialState };

        default:
            return state;
    }
}

// Simulated API Call
const fetchDeviceParts = async (deviceType) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate network failure scenario
            if (deviceType === 'offline_sim') {
                reject(new Error('Network Offline'));
            } else if (deviceType === 'FRANKA-FR3') {
                resolve([{ id: 'cam-1', name: 'RGB主相机', type: '视觉传感器' }, { id: 'depth-1', name: '深度相机', type: '视觉传感器' }, { id: 'arm-l', name: '左机械臂', type: '执行器' }]);
            } else if (deviceType === 'UR5e') {
                resolve([{ id: 'cam-top', name: '顶置相机', type: '视觉传感器' }, { id: 'gripper', name: '末端夹爪', type: '执行器' }]);
            } else {
                resolve([]);
            }
        }, 800); // Artificial delay to show loading animation
    });
};

export default function CreateTaskPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [state, dispatch] = useReducer(taskReducer, initialState);

    // Effect to handle Device parts fetching
    useEffect(() => {
        if (state.status === 'LOADING_DEVICES' && state.deviceConfig.deviceType) {
            let isMounted = true;
            fetchDeviceParts(state.deviceConfig.deviceType)
                .then(parts => {
                    if (isMounted) dispatch({ type: 'FETCH_PARTS_SUCCESS', payload: parts });
                })
                .catch(err => {
                    if (isMounted) dispatch({ type: 'FETCH_PARTS_FAIL', payload: err.message });
                });
            return () => { isMounted = false; }; // Cleanup
        }
    }, [state.status, state.deviceConfig.deviceType]);

    const handleDeviceChange = (value) => {
        if (state.deviceConfig.selectedParts.length > 0) {
            import('antd').then(({ Modal }) => {
                Modal.confirm({
                    title: '更改设备类型警告',
                    icon: <AlertCircle color="#faad14" />,
                    content: '更改设备类型将清空当前已选择的部件配置，确认继续吗？',
                    okText: '确认清空',
                    cancelText: '取消',
                    onOk: () => dispatch({ type: 'SELECT_DEVICE_TYPE', payload: value })
                });
            });
        } else {
            dispatch({ type: 'SELECT_DEVICE_TYPE', payload: value });
        }
    };

    const handleNextStep = () => {
        // Guards for Step 0
        if (currentStep === 0) {
            const { levelOneId, levelTwoId, taskName, taskPurpose, sceneCategory, deviceType, collectMode, remoteControlMode } = state.projectInfo;
            if (!levelOneId || !levelTwoId || !taskName || !taskPurpose || !sceneCategory || !deviceType || !collectMode || !remoteControlMode) {
                dispatch({ type: 'SET_ERROR', payload: { field: 'base', message: '请完善带 * 的必填项！' } });
                return;
            }
            if (state.deviceConfig.selectedParts.length === 0) {
                dispatch({ type: 'SET_ERROR', payload: { field: 'device', message: '请至少选择一个设备部件！' } });
                return;
            }
            if (!state.taskMeta.dataGenMode) {
                dispatch({ type: 'SET_ERROR', payload: { field: 'dataGenMode', message: '请选择数据生成模式！' } });
                return;
            }
            setCurrentStep(1);
        }
    };

    const handleSubmit = () => {
        dispatch({ type: 'SUBMIT_TASK' });
        setTimeout(() => {
            dispatch({ type: 'SUBMIT_SUCCESS' });
            import('antd').then(({ message }) => {
                message.success('任务创建成功！');
                router.push('/collection/tasks');
            });
        }, 1200);
    };

    return (
        <MainLayout>
            <div style={{ background: '#fff', borderRadius: 8, padding: '24px', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                    <Button type="text" icon={<ArrowLeft size={18} />} onClick={() => router.back()} style={{ marginRight: 16 }} />
                    <h2 style={{ fontSize: '20px', fontWeight: 500, margin: 0 }}>添加任务</h2>
                </div>

                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <Steps
                        current={currentStep}
                        items={[{ title: '基础信息' }, { title: '任务配置' }]}
                        style={{ width: '60%', margin: '0 auto 40px' }}
                    />

                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, ease: 'easeOut' }}>

                                <Form layout="vertical" requiredMark={(label, info) => <><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>{label}</>}>
                                    {state.errorLog?.field === 'base' && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
                                            <Alert message={state.errorLog.message} type="error" showIcon icon={<AlertTriangle size={16} />} />
                                        </motion.div>
                                    )}
                                    <Row gutter={48}>
                                        <Col span={12}>
                                            <Form.Item label="一级项目" required>
                                                <Select placeholder="请选择一级项目" value={state.projectInfo.levelOneId} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { levelOneId: v } })} options={[{ value: 'P-01', label: '项目一' }]} />
                                            </Form.Item>
                                            <Form.Item label="任务名称" required>
                                                <Input placeholder="请输入任务名称" value={state.projectInfo.taskName} onChange={(e) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { taskName: e.target.value } })} />
                                            </Form.Item>
                                            <Form.Item label="任务用途" required>
                                                <Select placeholder="请选择任务用途" value={state.projectInfo.taskPurpose} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { taskPurpose: v } })} options={[{ value: 'purpose1', label: '用途1' }]} />
                                            </Form.Item>
                                            <Form.Item label="场景分类" required>
                                                <Select placeholder="请选择场景分类" value={state.projectInfo.sceneCategory} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { sceneCategory: v } })} options={[{ value: 'scene1', label: '场景1' }]} />
                                            </Form.Item>
                                            <Form.Item label="设备类型" required>
                                                <Select
                                                    placeholder="请选择设备类型"
                                                    value={state.projectInfo.deviceType}
                                                    onChange={handleDeviceChange}
                                                    options={[
                                                        { value: 'FRANKA-FR3', label: 'FRANKA Emika - FR3' },
                                                        { value: 'UR5e', label: 'Universal Robots - UR5e' },
                                                        { value: 'offline_sim', label: '[测试用] 断网异常' }
                                                    ]}
                                                />
                                            </Form.Item>
                                            <Form.Item label="任务书">
                                                <Select placeholder="请选择任务书" value={state.projectInfo.taskBook} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { taskBook: v } })} options={[{ value: 'book1', label: '任务书1' }]} />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item label="二级项目" required>
                                                <Select placeholder="请选择二级项目" value={state.projectInfo.levelTwoId} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { levelTwoId: v } })} options={[{ value: 'P-01-01', label: '二级项目一' }]} />
                                            </Form.Item>
                                            <Form.Item label={<span>英文名称 <AlertCircle size={14} color="#8c8c8c" style={{ verticalAlign: 'text-bottom', marginLeft: 4 }} /></span>}>
                                                <Input placeholder="请输入英文名称" value={state.projectInfo.englishName} onChange={(e) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { englishName: e.target.value } })} />
                                            </Form.Item>
                                            <Form.Item label="采集模式" required>
                                                <Select placeholder="请选择采集模式" value={state.projectInfo.collectMode} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { collectMode: v } })} options={[{ value: 'mode1', label: '模式1' }]} />
                                            </Form.Item>
                                            <Form.Item label="子场景分类">
                                                <Select placeholder="请选择子场景分类" value={state.projectInfo.subSceneCategory} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { subSceneCategory: v } })} options={[{ value: 'subscene1', label: '子场景1' }]} />
                                            </Form.Item>
                                            <Form.Item label="遥操类型" required>
                                                <Select placeholder="请选择遥操类型" value={state.projectInfo.remoteControlMode} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { remoteControlMode: v } })} options={[{ value: 'remote1', label: '遥操1' }]} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item label="设备部件" required style={{ marginTop: 8 }}>
                                        {state.errorLog?.field === 'device' && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
                                                <Alert message={state.errorLog.message} type="error" showIcon icon={<AlertTriangle size={16} />} />
                                            </motion.div>
                                        )}
                                        {state.status === 'IDLE' && !state.projectInfo.deviceType ? (
                                            <Table
                                                size="small"
                                                columns={[{ title: '部件名称', dataIndex: 'name' }, { title: '部件类型', dataIndex: 'type' }]}
                                                dataSource={[]}
                                                locale={{ emptyText: '请先在上方指定设备类型以加载联动部件' }}
                                                pagination={false}
                                                bordered
                                            />
                                        ) : state.status === 'LOADING_DEVICES' ? (
                                            <div style={{ textAlign: 'center', padding: '30px 0', border: '1px solid #f0f0f0' }}><Spin /></div>
                                        ) : state.status === 'ERROR' && state.errorLog?.field === 'device' ? (
                                            <Alert
                                                message={<span style={{ fontWeight: 600 }}>边缘节点握手失败</span>}
                                                description={state.errorLog.message}
                                                type="error"
                                                showIcon
                                                action={<Button size="small" type="primary" danger onClick={() => handleDeviceChange(state.projectInfo.deviceType)}>重试拉取</Button>}
                                                style={{ padding: 24, borderRadius: 12 }}
                                            />
                                        ) : (
                                            <Table
                                                size="small"
                                                rowSelection={{
                                                    type: 'checkbox',
                                                    selectedRowKeys: state.deviceConfig.selectedParts,
                                                    onChange: (keys) => dispatch({ type: 'TOGGLE_PART_BULK', payload: keys })
                                                }}
                                                rowKey="id"
                                                columns={[{ title: '部件名称', dataIndex: 'name' }, { title: '部件类型', dataIndex: 'type' }]}
                                                dataSource={state.deviceConfig.availableParts}
                                                pagination={false}
                                                bordered
                                            />
                                        )}
                                    </Form.Item>

                                    <Row gutter={48} style={{ marginTop: 24, marginBottom: 16 }}>
                                        <Col span={12}>
                                            <Row align="middle">
                                                <Col>
                                                    <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                                                    <span style={{ marginRight: 16 }}>数据生成模式</span>
                                                </Col>
                                                <Col>
                                                    <Form.Item style={{ marginBottom: 0 }}>
                                                        <Radio.Group
                                                            onChange={(e) => dispatch({ type: 'UPDATE_META', payload: { dataGenMode: e.target.value } })}
                                                            value={state.taskMeta.dataGenMode}
                                                        >
                                                            <Radio value="真机">真机</Radio>
                                                            <Radio value="仿真">仿真</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={12}>
                                            <Row align="middle">
                                                <Col>
                                                    <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                                                    <span style={{ marginRight: 16 }}>结束录制删除留白</span>
                                                </Col>
                                                <Col>
                                                    <Space align="center" style={{ height: 32 }}>
                                                        <div
                                                            style={{ width: 44, height: 22, borderRadius: 11, background: state.taskMeta.deleteAfterEnd ? '#1677ff' : '#bfbfbf', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                                                            onClick={() => dispatch({ type: 'UPDATE_META', payload: { deleteAfterEnd: !state.taskMeta.deleteAfterEnd } })}
                                                        >
                                                            <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 2, left: state.taskMeta.deleteAfterEnd ? 24 : 2, transition: '0.3s' }} />
                                                            <span style={{ position: 'absolute', right: state.taskMeta.deleteAfterEnd ? 'auto' : 6, left: state.taskMeta.deleteAfterEnd ? 6 : 'auto', color: '#fff', fontSize: 12, lineHeight: '22px' }}>{state.taskMeta.deleteAfterEnd ? '是' : '否'}</span>
                                                        </div>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Form.Item label="任务描述">
                                        <Input.TextArea
                                            rows={4}
                                            value={state.taskMeta.taskDesc}
                                            onChange={(e) => dispatch({ type: 'UPDATE_META', payload: { taskDesc: e.target.value } })}
                                            showCount
                                            maxLength={1000}
                                        />
                                    </Form.Item>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                                        <Button size="middle" onClick={() => router.back()} disabled={state.status === 'SUBMITTING'}>取消</Button>
                                        <Button size="middle" type="primary" onClick={handleNextStep} disabled={state.status === 'SUBMITTING'}>下一步</Button>
                                    </div>

                                </Form>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                                <div style={{ textAlign: 'center', padding: '100px 0', color: '#8c8c8c' }}>
                                    这里是任务配置的第二步内容
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                                    <Button size="middle" onClick={() => setCurrentStep(0)} disabled={state.status === 'SUBMITTING'}>取消</Button>
                                    <Button size="middle" type="primary" loading={state.status === 'SUBMITTING'} onClick={handleSubmit}>确定</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    );
}
