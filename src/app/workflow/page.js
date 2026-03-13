'use client';

import React, { useReducer, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Input, Select, Checkbox, Button, Alert, Tag, Space, notification } from 'antd';
import { 
    RobotOutlined, 
    AppstoreAddOutlined, 
    ApiOutlined, 
    WarningOutlined, 
    CheckCircleOutlined,
    LoadingOutlined,
    ArrowRightOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';

const { Content } = Layout;

// --- 1. State Machine Definitions ---

const initialState = {
    status: 'IDLE', // IDLE, LOADING_DEVICES, READY, ERROR_FETCH, SUBMITTING, SUCCESS
    form: {
        taskName: '',
        projectId: null,
        deviceType: null,
        selectedParts: [],
        agreementChecked: false
    },
    availableParts: [],
    errorLog: null, // For API errors
    validationErrors: {} // For form field errors
};

function formReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                form: { ...state.form, [action.payload.field]: action.payload.value },
                validationErrors: { ...state.validationErrors, [action.payload.field]: null } // Clear error on change
            };
        case 'SELECT_DEVICE':
            return {
                ...state,
                status: 'LOADING_DEVICES',
                form: { ...state.form, deviceType: action.payload, selectedParts: [] },
                availableParts: [],
                errorLog: null
            };
        case 'FETCH_PARTS_SUCCESS':
            return {
                ...state,
                status: 'READY',
                availableParts: action.payload
            };
        case 'FETCH_PARTS_FAIL':
            return {
                ...state,
                status: 'ERROR_FETCH',
                errorLog: action.payload
            };
        case 'TOGGLE_PART':
            const isSelected = state.form.selectedParts.includes(action.payload);
            const newParts = isSelected 
                ? state.form.selectedParts.filter(id => id !== action.payload)
                : [...state.form.selectedParts, action.payload];
            return {
                ...state,
                form: { ...state.form, selectedParts: newParts },
                validationErrors: { ...state.validationErrors, selectedParts: null }
            };
        case 'TOGGLE_AGREEMENT':
            return {
                ...state,
                form: { ...state.form, agreementChecked: action.payload },
                validationErrors: { ...state.validationErrors, agreementChecked: null }
            };
        case 'SET_VALIDATION_ERRORS':
            return {
                ...state,
                validationErrors: action.payload
            };
        case 'SUBMIT':
            return { ...state, status: 'SUBMITTING' };
        case 'SUBMIT_SUCCESS':
            return { ...state, status: 'SUCCESS' };
        case 'RETRY_FETCH':
            return { ...state, status: 'LOADING_DEVICES', errorLog: null };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
}

// --- 2. Mock APIs ---

const mockFetchParts = (deviceType) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Harden: Simulate chaos testing (special trigger to test network failure)
            if (deviceType === 'trigger-network-error') {
                reject(new Error("Connection timed out. Simulation of weak network layer."));
            } else if (deviceType === 'quadruped-a') {
                resolve([
                    { id: 'part-1', name: '前置 RGBD 深度相机', type: 'Camera' },
                    { id: 'part-2', name: '顶部 360° 激光雷达', type: 'Sensor' },
                    { id: 'part-3', name: '四足关节力矩传感器', type: 'ActuatorData' },
                    { id: 'part-4', name: '五指灵巧手 (左)', type: 'EndEffector' }
                ]);
            } else {
                resolve([
                    { id: 'part-5', name: '头部双目视觉相机', type: 'Camera' },
                    { id: 'part-6', name: '双臂 7-DOF 原生数据', type: 'ActuatorData' },
                    { id: 'part-7', name: '二指电控夹爪', type: 'EndEffector' }
                ]);
            }
        }, 1200); // 1.2s delay to show loading state animations
    });
};

const mockSubmitTask = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, taskId: 'TASK-2026-9001' });
        }, 1500); // 1.5s simulated submit
    });
};


// --- 3. Component (Frontend Design & Animation & Hardening) ---

export default function WorkflowCreate() {
    const [state, dispatch] = useReducer(formReducer, initialState);
    
    // Derived state
    const isReady = state.status === 'READY' || state.status === 'IDLE';
    const isSubmitting = state.status === 'SUBMITTING';
    
    // 动画配置 (Animate skill) - easing curves optimized for delight
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    // Effect: Handle Device Selection 级联加载
    useEffect(() => {
        let isMounted = true;
        if (state.status === 'LOADING_DEVICES' && state.form.deviceType) {
            mockFetchParts(state.form.deviceType)
                .then(parts => {
                    if (isMounted) dispatch({ type: 'FETCH_PARTS_SUCCESS', payload: parts });
                })
                .catch(err => {
                    if (isMounted) dispatch({ type: 'FETCH_PARTS_FAIL', payload: err.message });
                });
        }
        return () => { isMounted = false; };
    }, [state.status, state.form.deviceType]);

    // Validation Guard (Harden skill)
    const handleNextStep = () => {
        const errors = {};
        
        // Validation Checks
        if (!state.form.taskName.trim()) {
            errors.taskName = "任务名称不能为空 (Task name is required)";
        } else if (state.form.taskName.length > 50) {
            errors.taskName = "名称过长，不可超过50个字符 (Max 50 characters)";
        }
        
        if (!state.form.projectId) errors.projectId = "请选择归属项目 (Select a project)";
        if (!state.form.deviceType) errors.deviceType = "必须选择采集设备型号 (Device type is required)";
        
        if (state.form.deviceType && state.availableParts.length > 0 && state.form.selectedParts.length === 0) {
            errors.selectedParts = "请至少选中一个需要采集的设备部件 (Select at least one part)";
        }

        if (!state.form.agreementChecked) {
            errors.agreementChecked = "必须同意采集安全合规协议才能继续 (Agreement required)";
        }

        if (Object.keys(errors).length > 0) {
            // Animate error feedback
            dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
            notification.error({
                message: '校验失败 (Validation Failed)',
                description: '请检查标红的必填项并修正。',
                placement: 'topRight'
            });
            return;
        }

        // Pass validation -> Submit
        dispatch({ type: 'SUBMIT' });
        mockSubmitTask(state.form).then(() => {
            dispatch({ type: 'SUBMIT_SUCCESS' });
        });
    };

    // UI Renderers
    if (state.status === 'SUCCESS') {
        return (
            <MainLayout>
                <div style={{ height: 'calc(100vh - 56px - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        transition={{ type: 'spring', damping: 20 }}
                        style={{ background: '#fff', padding: '60px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: 600 }}
                    >
                        <div style={{ fontSize: 72, color: '#10b981', marginBottom: 24 }}>
                            <CheckCircleOutlined />
                        </div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.5px' }}>
                            任务配置成功
                        </h1>
                        <p style={{ color: '#64748b', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
                            您的数据采集任务已生成，并加入了排期队列。<br/> 
                            机器人终端将在网络空闲时自动同步该配置。
                        </p>
                        <Button 
                            type="primary" 
                            size="large" 
                            style={{ height: 48, padding: '0 32px', borderRadius: 24, background: '#0f172a', fontWeight: 600 }}
                            onClick={() => dispatch({ type: 'RESET_FORM' })}
                        >
                            配置新任务 / Create New
                        </Button>
                    </motion.div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Frontend Design: Industrial/Refined dual-column layout */}
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px - 48px)', background: '#f1f5f9' }}>
                
                {/* Left Panel: Context & Instructions */}
                <div style={{ width: '400px', background: '#0f172a', color: '#fff', padding: '60px 40px', display: 'flex', flexDirection: 'column' }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <div style={{ width: 48, height: 48, background: '#1e293b', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                            <AppstoreAddOutlined style={{ fontSize: 24, color: '#38bdf8' }} />
                        </div>
                        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-1px', color: '#f8fafc' }}>
                            创建采集任务
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                            定义新的机器人数据采集工作流。任务下发后，系统将按照此配置挂载对应设备的传感器数据轨道，并为后续的模型训练建立元数据基准。
                        </p>
                    </motion.div>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: 32 }}>
                        <p style={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <SafetyCertificateOutlined /> 企业级数据隔离开启
                        </p>
                    </div>
                </div>

                {/* Right Panel: Interactive State Machine Form */}
                <div style={{ flex: 1, padding: '60px', overflowY: 'auto' }}>
                    <motion.div 
                        variants={containerVariants} 
                        initial="hidden" 
                        animate="visible"
                        style={{ maxWidth: 760, margin: '0 auto' }}
                    >
                        
                        {/* Section 1: Basic Information */}
                        <motion.section variants={fadeUpVariants} style={{ background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.02)', marginBottom: 24 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', fontSize: 14 }}>1</span> 
                                基础元数据
                            </h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 8 }}>任务名称 / Task Name *</label>
                                    <Input 
                                        size="large" 
                                        placeholder="例如: 厨房夹取矿泉水_测试01" 
                                        status={state.validationErrors.taskName ? 'error' : ''}
                                        value={state.form.taskName}
                                        onChange={e => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'taskName', value: e.target.value }})}
                                        style={{ borderRadius: 8, borderColor: state.validationErrors.taskName ? '#ef4444' : '#cbd5e1' }}
                                    />
                                    <AnimatePresence>
                                        {state.validationErrors.taskName && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>
                                                {state.validationErrors.taskName}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 8 }}>归属项目 / Project *</label>
                                    <Select 
                                        size="large" 
                                        placeholder="请选择" 
                                        style={{ width: '100%' }}
                                        status={state.validationErrors.projectId ? 'error' : ''}
                                        value={state.form.projectId}
                                        onChange={v => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'projectId', value: v }})}
                                        options={[
                                            { value: 'proj-1', label: '通用家政服务大模型' },
                                            { value: 'proj-2', label: '工业流水线分拣V4' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 2: Device Cascade Selection */}
                        <motion.section variants={fadeUpVariants} style={{ background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.02)', marginBottom: 24 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', fontSize: 14 }}>2</span> 
                                设备与部件级联配置
                            </h2>

                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 8 }}>选择采集设备 / Select Device *</label>
                            <Select 
                                size="large" 
                                placeholder="选择一个机器人型号..." 
                                style={{ width: '100%', marginBottom: 24 }}
                                status={state.validationErrors.deviceType ? 'error' : ''}
                                value={state.form.deviceType}
                                onChange={v => dispatch({ type: 'SELECT_DEVICE', payload: v })}
                                options={[
                                    { value: 'quadruped-a', label: '宇树 Go2 (四足机器人)' },
                                    { value: 'biped-arm', label: 'Agility Digit (双足带臂)' },
                                    { value: 'trigger-network-error', label: '[Chaos Test] 触发网络级联异常' }
                                ]}
                            />

                            <AnimatePresence mode="wait">
                                {state.status === 'IDLE' && !state.form.deviceType && (
                                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                                        <RobotOutlined style={{ fontSize: 32, color: '#94a3b8', marginBottom: 12 }} />
                                        <p style={{ color: '#64748b', margin: 0 }}>请先选择设备，系统将动态加载对应的可用部件。</p>
                                    </motion.div>
                                )}

                                {state.status === 'LOADING_DEVICES' && (
                                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: '#f8fafc', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                                        <LoadingOutlined style={{ fontSize: 28, color: '#38bdf8', marginBottom: 16 }} />
                                        <p style={{ color: '#475569', margin: 0, fontWeight: 500 }}>正在远程握手并拉取设备挂载配置...</p>
                                    </motion.div>
                                )}

                                {state.status === 'ERROR_FETCH' && (
                                    <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                        <Alert
                                            message="设备部件同步失败"
                                            description={state.errorLog}
                                            type="error"
                                            showIcon
                                            icon={<WarningOutlined />}
                                            action={
                                                <Button size="small" type="primary" danger onClick={() => dispatch({ type: 'RETRY_FETCH' })}>
                                                    重试 (Retry)
                                                </Button>
                                            }
                                        />
                                    </motion.div>
                                )}

                                {state.status === 'READY' && state.availableParts.length > 0 && (
                                    <motion.div key="parts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f8fafc', borderRadius: 12, padding: 24, border: state.validationErrors.selectedParts ? '1px solid #ef4444' : '1px solid transparent' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <span style={{ fontWeight: 600, color: '#0f172a' }}>请勾选采集涵盖的传感器/执行器</span>
                                            <Tag color="geekblue">{state.availableParts.length} 可用</Tag>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            {state.availableParts.map((part, index) => {
                                                const isSelected = state.form.selectedParts.includes(part.id);
                                                return (
                                                    <motion.div 
                                                        key={part.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => dispatch({ type: 'TOGGLE_PART', payload: part.id })}
                                                        style={{
                                                            background: isSelected ? '#EFF6FF' : '#fff',
                                                            border: isSelected ? '2px solid #3B82F6' : '1px solid #e2e8f0',
                                                            padding: '16px',
                                                            borderRadius: '12px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 12,
                                                            transition: 'background 0.2s, border 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: isSelected ? 'none' : '1px solid #cbd5e1', background: isSelected ? '#3B82F6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {isSelected && <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{part.name}</div>
                                                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{part.type}</div>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                        {state.validationErrors.selectedParts && (
                                            <div style={{ color: '#ef4444', fontSize: 12, marginTop: 12 }}>{state.validationErrors.selectedParts}</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>

                        {/* Form Footer & Submit (Harden: Agreement & Guard) */}
                        <motion.div variants={fadeUpVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
                            <div style={{ background: state.validationErrors.agreementChecked ? '#fef2f2' : 'transparent', padding: '12px 16px', borderRadius: 8, border: state.validationErrors.agreementChecked ? '1px solid #fecaca' : '1px solid transparent', transition: 'all 0.3s' }}>
                                <Checkbox 
                                    checked={state.form.agreementChecked}
                                    onChange={(e) => dispatch({ type: 'TOGGLE_AGREEMENT', payload: e.target.checked })}
                                    style={{ color: '#334155', fontWeight: 500 }}
                                >
                                    我已阅读并同意 <a href="#policy" style={{ color: '#3b82f6' }}>《数据采集安全与隐私合规协议V2.1》</a>
                                </Checkbox>
                                {state.validationErrors.agreementChecked && (
                                    <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 24 }}>{state.validationErrors.agreementChecked}</div>
                                )}
                            </div>

                            <Button 
                                type="primary" 
                                size="large" 
                                loading={isSubmitting}
                                onClick={handleNextStep}
                                style={{ 
                                    height: 54, 
                                    padding: '0 40px', 
                                    borderRadius: 27, 
                                    fontSize: 16, 
                                    fontWeight: 600,
                                    background: isSubmitting ? '#94a3b8' : '#0f172a',
                                    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)'
                                }}
                            >
                                {isSubmitting ? '正在登记路由...' : '提交配置 (Deploy Task)'} <ArrowRightOutlined />
                            </Button>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
