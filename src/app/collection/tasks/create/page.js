'use client';

import React, { useReducer, useEffect, useState } from 'react';
import { Button, Input, Select, Form, Row, Col, Table, Spin, Alert, Steps, Radio, Space, InputNumber, Card, Tooltip, Switch, Upload, Drawer, Typography, Divider } from 'antd';
import { AlertCircle, ArrowLeft, CheckCircle2, FilePlus2, Info, PlusCircle, UploadCloud, FileText, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';

const { Title, Paragraph, Text } = Typography;

// --- DATA & CONSTANTS ---
const TPL_TAG_COLOR = { '服务数据': '#0958d9', '工业数据': '#d46b08', '零售数据': '#389e0d' };
const TPL_TAG_BG    = { '服务数据': '#e8f0fe', '工业数据': '#fff7e6', '零售数据': '#f6ffed' };

const TEMPLATES = [
  {
    key: 'desk-clean', name: '桌面整理', icon: '🗂', tag: '服务数据',
    deviceType: 'galbot_2.2_RGB', remoteControlMode: 'Master-slaveArm', collectMode: 'WholeBody', sceneCategory: 'Household',
    desc: '书籍、收纳盒、垃圾清理等桌面物品整理任务',
    steps: [
      { et: '右手', skill: '识别', obj: '目标物品', goal: '确认位置' },
      { et: '右手', skill: '抓取', obj: '目标物品', goal: '稳定握持' },
      { et: '双手', skill: '移动', obj: '物品', goal: '目标摆放位置' },
      { et: '右手', skill: '放置', obj: '物品', goal: '指定区域' },
    ],
  },
  {
    key: 'clothes-fold', name: '衣物折叠', icon: '👕', tag: '服务数据',
    deviceType: 'galbot_2.2_RGB', remoteControlMode: 'VR(VR)', collectMode: 'WholeBody', sceneCategory: 'Household',
    desc: '叠牛仔裤等柔性物体折叠操作，步骤多、精度高',
    steps: [
      { et: '双手', skill: '抓取', obj: '衣物', goal: '展开平铺' },
      { et: '双手', skill: '对折', obj: '衣物', goal: '左右对齐' },
      { et: '双手', skill: '对折', obj: '衣物', goal: '上下对齐' },
      { et: '双手', skill: '放置', obj: '折叠衣物', goal: '堆叠区域' },
    ],
  },
  {
    key: 'sort', name: '物品分拣', icon: '📦', tag: '工业数据',
    deviceType: 'galbot_2.2_R', remoteControlMode: 'Master-slaveArm', collectMode: 'WholeBody', sceneCategory: 'Factory',
    desc: '分拣物品、电子产品，按类别放入对应区域',
    steps: [
      { et: '右手', skill: '识别', obj: '物品类别', goal: '分类判断' },
      { et: '右手', skill: '抓取', obj: '目标物品', goal: '稳定夹持' },
      { et: '右手', skill: '移动', obj: '物品', goal: '对应分拣区' },
      { et: '右手', skill: '放置', obj: '物品', goal: '指定容器/位置' },
    ],
  },
  {
    key: 'assembly', name: '工业组装', icon: '🔧', tag: '工业数据',
    deviceType: 'galbot_2.2_R', remoteControlMode: 'Master-slaveArm', collectMode: 'WholeBody', sceneCategory: 'Factory',
    desc: '组装管道支架等精密组装任务，需高精度对准',
    steps: [
      { et: '右手', skill: '抓取', obj: '零件A', goal: '取料区' },
      { et: '左手', skill: '抓取', obj: '零件B', goal: '取料区' },
      { et: '双手', skill: '对准', obj: '零件接口', goal: '精确插接' },
      { et: '双手', skill: '固定', obj: '组装件', goal: '锁紧到位' },
    ],
  },
  {
    key: 'retail', name: '零售商品操作', icon: '🛒', tag: '零售数据',
    deviceType: 'galbot_2.2_RGB', remoteControlMode: 'Master-slaveArm', collectMode: 'WholeBody', sceneCategory: 'Supermarket',
    desc: '零售薄饼、绿茶、茶裹王等商品的货架操作',
    steps: [
      { et: '右手', skill: '抓取', obj: '商品', goal: '货架/货箱' },
      { et: '右手', skill: '定向', obj: '商品', goal: '朝向标准面' },
      { et: '右手', skill: '放置', obj: '商品', goal: '货架指定位置' },
      { et: '左手', skill: '整齐', obj: '货架商品', goal: '端正排列' },
    ],
  },
  {
    key: 'clean', name: '清洁操作', icon: '🧹', tag: '服务数据',
    deviceType: 'galbot_2.2_RGB', remoteControlMode: 'VR(VR)', collectMode: 'WholeBody', sceneCategory: 'Office',
    desc: '清理台面垃圾等非结构化目标清洁任务',
    steps: [
      { et: '右手', skill: '识别', obj: '垃圾/脏物', goal: '确认目标' },
      { et: '右手', skill: '抓取', obj: '垃圾', goal: '稳定握持' },
      { et: '右手', skill: '移动', obj: '垃圾', goal: '垃圾桶上方' },
      { et: '右手', skill: '释放', obj: '垃圾', goal: '投入垃圾桶' },
    ],
  },
];

// --- STATE MACHINE DEFINITIONS ---
const initialState = {
    status: 'IDLE', // IDLE, LOADING_DEVICES, READY, SUBMITTING, SUCCESS, ERROR
    projectInfo: { levelOneId: null, levelTwoId: null, taskName: '', taskPurpose: null, sceneCategory: null, taskBookId: null, englishName: '', collectMode: null, subSceneCategory: null, remoteControlMode: null },
    deviceConfig: { deviceType: null, availableParts: [], selectedParts: [] },
    taskMeta: { dataGenMode: '真机', deleteAfterEnd: false, taskDesc: '', plannedCount: 100 },
    configData: { actionType: 'formatted', stepsData: [], uploadFile: null, isShelf: false, sceneInitState: '', enSceneInitState: '', generalization: '' },
    errorLog: null,
};

function taskReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_PROJECT_INFO': return { ...state, projectInfo: { ...state.projectInfo, ...action.payload }, errorLog: null };
        case 'UPDATE_META': return { ...state, taskMeta: { ...state.taskMeta, ...action.payload }, errorLog: null };
        case 'UPDATE_CONFIG': return { ...state, configData: { ...state.configData, ...action.payload }, errorLog: null };
        case 'SELECT_DEVICE_TYPE':
            if (state.deviceConfig.deviceType === action.payload) return state; 
            return {
                ...state, status: 'LOADING_DEVICES', projectInfo: { ...state.projectInfo, deviceType: action.payload },
                deviceConfig: { deviceType: action.payload, availableParts: [], selectedParts: [] }, errorLog: null
            };
        case 'FETCH_PARTS_SUCCESS': return { ...state, status: 'READY', deviceConfig: { ...state.deviceConfig, availableParts: action.payload, selectedParts: action.payload.map(p => p.id) } }; // Pre-select all parts for easier templating
        case 'FETCH_PARTS_FAIL': return { ...state, status: 'ERROR', errorLog: { field: 'device', message: action.payload || '网络连接失败，无法获取设备部件列表' } };
        case 'TOGGLE_PART_BULK': return { ...state, deviceConfig: { ...state.deviceConfig, selectedParts: action.payload }, errorLog: null };
        case 'APPLY_TEMPLATE':
            const t = action.payload;
            return {
                ...state,
                projectInfo: {
                    ...state.projectInfo,
                    taskName: `${t.name}_${new Date().getTime().toString().slice(-4)}`,
                    deviceType: t.deviceType,
                    remoteControlMode: t.remoteControlMode,
                    collectMode: t.collectMode,
                    sceneCategory: t.sceneCategory,
                },
                taskMeta: { ...state.taskMeta, plannedCount: 100 },
                status: t.deviceType ? 'LOADING_DEVICES' : 'IDLE',
                deviceConfig: { deviceType: t.deviceType, availableParts: [], selectedParts: [] },
                configData: { 
                    ...state.configData, 
                    stepsData: t.steps ? t.steps.map((s, i) => ({ id: Date.now() + i, step: i + 1, et: s.et, skill: s.skill, obj: s.obj, goal: s.goal })) : [] 
                },
                errorLog: null
            };
        case 'SUBMIT_TASK': return { ...state, status: 'SUBMITTING', errorLog: null };
        case 'SUBMIT_SUCCESS': return { ...state, status: 'SUCCESS' };
        case 'SET_ERROR': return { ...state, status: 'READY', errorLog: action.payload };
        case 'RESET': return { ...initialState };
        default: return state;
    }
}

const fetchDeviceParts = async (deviceType) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (deviceType === 'offline_sim') reject(new Error('Network Offline'));
            else if (deviceType === 'FRANKA-FR3') resolve([{ id: 'cam-1', name: 'RGB主相机', type: '视觉传感器' }, { id: 'depth-1', name: '深度相机', type: '视觉传感器' }, { id: 'arm-l', name: '左机械臂', type: '执行器' }]);
            else if (deviceType === 'UR5e') resolve([{ id: 'cam-top', name: '顶置相机', type: '视觉传感器' }, { id: 'gripper', name: '末端夹爪', type: '执行器' }]);
            else resolve([{ id: 'mock-1', name: '默认视觉模块', type: '传感器' }, { id: 'mock-arm', name: '默认执行本体', type: '执行器' }]); // Provide mock parts for templated devices
        }, 800); 
    });
};

export default function CreateTaskPage() {
    const router = useRouter();

    const [formStep, setFormStep] = useState('select'); // 'select' | 'configure'
    const [selectedTemplate, setSelectedTemplate] = useState(null); // 'blank' or template object
    const [creationSource, setCreationSource] = useState('manual'); // 'manual' | 'copy' | 'ai'
    const [previewVisible, setPreviewVisible] = useState(false);
    
    // Mock TaskBooks for selection
    const MOCK_TASKBOOKS = [
        { id: 'TB-001', name: '餐具摆放标准 V1.2', scenario: 'Household', content: '规范餐具摆放、垃圾清理等场景下的机器人采集数据质量...' },
        { id: 'TB-002', name: '工业搬运规范 V2.0', scenario: 'Factory', content: '定义 AGV 与机械臂协同搬运的标准流程...' },
        { id: 'TB-003', name: '衣物折叠指南 V1.0', scenario: 'Household', content: '针对衣物、毛巾等非结构化柔性物体的操作标准...' },
    ];
    
    // --- FORM STATE ---
    const [configStep, setConfigStep] = useState(0); // 0 = Base Info, 1 = Actions
    const [formState, dispatch] = useReducer(taskReducer, initialState);

    // Auto-fetch device parts when deviceType changes
    useEffect(() => {
        if (formStep === 'configure' && formState.status === 'LOADING_DEVICES' && formState.deviceConfig.deviceType) {
            let isMounted = true;
            fetchDeviceParts(formState.deviceConfig.deviceType)
                .then(parts => { if (isMounted) dispatch({ type: 'FETCH_PARTS_SUCCESS', payload: parts }); })
                .catch(err => { if (isMounted) dispatch({ type: 'FETCH_PARTS_FAIL', payload: err.message }); });
            return () => { isMounted = false; };
        }
    }, [formState.status, formState.deviceConfig.deviceType, formStep]);

    // --- HANDLE COPY (FROM LIST PAGE) ---
    useEffect(() => {
        const copyData = sessionStorage.getItem('copyTaskData');
        if (copyData) {
            sessionStorage.removeItem('copyTaskData');
            try {
                const task = JSON.parse(copyData);
                // fake template data
                const fakeTemplate = {
                    key: 'copied', name: task.name + '_copy',
                    deviceType: task.device, remoteControlMode: task.remote === 'Master-slave' ? 'Master-slaveArm' : task.remote,
                    collectMode: task.mode, sceneCategory: task.scene,
                    steps: [] 
                };
                setSelectedTemplate({ key: 'copied', name: '复制的任务' }); 
                setCreationSource('copy');
                dispatch({ type: 'APPLY_TEMPLATE', payload: fakeTemplate });
                setFormStep('configure');
                setConfigStep(0);
            } catch (e) {}
        }

        const chatDataStr = localStorage.getItem('chatTaskData');
        if (chatDataStr) {
            localStorage.removeItem('chatTaskData');
            try {
                const cd = JSON.parse(chatDataStr);
                setCreationSource('ai');
                if (cd.template) {
                     const predefinedTpl = TEMPLATES.find(t => t.key === cd.template);
                     if (predefinedTpl) {
                         setSelectedTemplate(predefinedTpl);
                         dispatch({ type: 'APPLY_TEMPLATE', payload: predefinedTpl });
                     } else {
                         // Fallback
                         setSelectedTemplate({ key: 'custom_chat', name: '对话建单模板' });
                         dispatch({ type: 'APPLY_TEMPLATE', payload: {
                             key: 'custom_chat', name: cd.template + ' 模板',
                             deviceType: cd.device, remoteControlMode: cd.remote,
                             collectMode: cd.mode, sceneCategory: cd.scene, steps: []
                         }});
                     }
                } else {
                     // Empty Template fallback
                     setSelectedTemplate({ key: 'blank', name: '空白表单创建' });
                }

                dispatch({ type: 'UPDATE_PROJECT_INFO', payload: {
                    taskName: cd.taskName || undefined,
                    deviceType: cd.device || undefined,
                    remoteControlMode: cd.remote || undefined,
                    collectMode: cd.mode || undefined,
                    sceneCategory: cd.scene || undefined,
                    purpose: cd.purpose || undefined,
                }});

                if (cd.count) {
                    dispatch({ type: 'UPDATE_CONFIG', payload: { planCount: cd.count } });
                }

                setFormStep('configure');
                setConfigStep(0);
            } catch(e) {}
        }
    }, []);

    // --- ACTIONS ---
    const handleProceedToForm = (isTemplate) => {
        if (isTemplate) {
            if (!selectedTemplate || selectedTemplate === 'blank') return;
            // Apply template pre-fills
            dispatch({ type: 'APPLY_TEMPLATE', payload: selectedTemplate });
        } else {
            // Apply blank form (reset)
            dispatch({ type: 'RESET' });
            setSelectedTemplate('blank');
        }
        setFormStep('configure');
        setConfigStep(0);
    };

    const handleDeviceChange = (value) => {
        if (formState.deviceConfig.selectedParts.length > 0) {
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

    const handleNextConfigStep = () => {
        if (configStep === 0) {
            const { levelOneId, levelTwoId, taskName, taskPurpose, sceneCategory, deviceType, collectMode, remoteControlMode } = formState.projectInfo;
            if (!levelOneId || !levelTwoId || !taskName || !taskPurpose || !sceneCategory || !deviceType || !collectMode || !remoteControlMode) {
                dispatch({ type: 'SET_ERROR', payload: { field: 'base', message: '请完善带 * 的必填项！' } });
                return;
            }
            if (formState.deviceConfig.selectedParts.length === 0) {
                dispatch({ type: 'SET_ERROR', payload: { field: 'device', message: '请至少选择一个设备部件！' } });
                return;
            }
            if (!formState.taskMeta.dataGenMode) {
                dispatch({ type: 'SET_ERROR', payload: { field: 'dataGenMode', message: '请选择数据生成模式！' } });
                return;
            }
            setConfigStep(1);
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
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button 
                            type="text" 
                            icon={<ArrowLeft size={18} />} 
                            onClick={() => router.push('/collection/tasks')} 
                            style={{ marginRight: 16 }} 
                        />
                        <h2 style={{ fontSize: '20px', fontWeight: 500, margin: 0 }}>
                            {formStep === 'select' ? '选择创建方式' : 
                                (creationSource === 'ai' ? '智能建单' : 
                                (selectedTemplate === 'blank' ? '空白任务创建' : `基于模版创建：${selectedTemplate?.name}`))
                            }
                        </h2>
                    </div>
                </div>

                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    
                    <AnimatePresence mode="wait">
                        {/* STAGE: SELECT CREATION MODE */}
                        {formStep === 'select' && (
                            <motion.div key="select" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>常用任务模版</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                                    {TEMPLATES.map(t => {
                                        const isSelected = selectedTemplate?.key === t.key;
                                        const tc = TPL_TAG_COLOR[t.tag] || '#8c8c8c';
                                        const tb = TPL_TAG_BG[t.tag] || '#f5f5f5';

                                        return (
                                            <div 
                                                key={t.key} 
                                                onClick={() => setSelectedTemplate(t)}
                                                style={{
                                                    background: '#fff', borderRadius: 10, 
                                                    boxShadow: isSelected ? '0 0 0 2px #1677ff, 0 4px 12px rgba(22,119,255,0.15)' : '0 1px 4px rgba(0,0,0,.06)',
                                                    border: isSelected ? '1.5px solid transparent' : '1.5px solid #e8e8e8', 
                                                    padding: '16px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                                                }}
                                            >
                                                {isSelected && <CheckCircle2 size={20} color="#1677ff" style={{ position: 'absolute', top: 12, right: 12 }} />}
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                                    <div style={{ width: 40, height: 40, background: tb, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{t.name}</div>
                                                        <span style={{ background: tb, color: tc, borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600, marginTop: 4, display: 'inline-block' }}>{t.tag}</span>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 12, height: 40 }}>{t.desc}</div>
                                                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#8c8c8c' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>设备:</span> <span style={{ color: '#333' }}>{t.deviceType}</span></div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>遥操:</span> <span style={{ color: '#333' }}>{t.remoteControlMode}</span></div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>模式:</span> <span style={{ color: '#333' }}>{t.collectMode}</span></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>或自定义创建</div>
                                <div 
                                    onClick={() => handleProceedToForm(false)}
                                    style={{
                                        background: '#fafafa', borderRadius: 10, border: '1.5px dashed #d9d9d9', 
                                        padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: 16, width: '32%'
                                    }}
                                    className="hover:border-[#1677ff] hover:bg-[#f0f5ff]"
                                >
                                     <div style={{ width: 40, height: 40, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FilePlus2 size={20} color="#8c8c8c" /></div>
                                     <div>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>空白表单创建</div>
                                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>从头自定义全部参数信息</div>
                                     </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40, borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
                                    <Button size="middle" onClick={() => router.back()}>取消</Button>
                                    <Button size="middle" type="primary" disabled={!selectedTemplate || selectedTemplate === 'blank'} onClick={() => handleProceedToForm(true)}>下一步</Button>
                                </div>
                            </motion.div>
                        )}


                        {/* STAGE: UNIFIED FORM (Blank or Pre-filled) */}
                        {formStep === 'configure' && (
                            <motion.div key="configure" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <Steps current={configStep} items={[{ title: '基础参数' }, { title: '动作预设' }]} style={{ width: '60%', margin: '0 auto 40px' }} />
                                
                                {configStep === 0 && (
                                    <motion.div key="cstep1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {selectedTemplate !== 'blank' && creationSource !== 'ai' && (
                                            <Alert 
                                                message={`你正在使用【${selectedTemplate?.name}】模版，部分参数已自动填充`} 
                                                type="info" showIcon 
                                                icon={<Info size={16} />}
                                                style={{ marginBottom: 24, background: '#e6f4ff', border: '1px solid #91caff' }} 
                                            />
                                        )}

                                        <Form layout="vertical" requiredMark={(label, info) => <><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>{label}</>}>
                                            {formState.errorLog?.field === 'base' && <Alert message={formState.errorLog.message} type="error" showIcon style={{ marginBottom: 24 }} />}
                                            
                                            <Card title="基础信息" size="small" style={{ marginBottom: 24 }} headStyle={{ background: '#fafafa' }}>
                                                <Row gutter={48}>
                                                    <Col span={12}>
                                                        <Form.Item label="一级项目" required><Select placeholder="请选择" value={formState.projectInfo.levelOneId} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { levelOneId: v } })} options={[{ value: 'P-01', label: '项目一' }]} /></Form.Item>
                                                        <Form.Item label="任务名称" required><Input placeholder="请输入" value={formState.projectInfo.taskName} onChange={(e) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { taskName: e.target.value } })} /></Form.Item>
                                                        <Form.Item label="任务用途" required><Select placeholder="请选择" value={formState.projectInfo.taskPurpose} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { taskPurpose: v } })} options={[{ value: 'purpose1', label: '用途1' }]} /></Form.Item>
                                                        <Form.Item label="关联任务书 (SOP)" required tooltip="任务书定义了本次采集的数据标准与验收规范">
                                                            <Space.Compact style={{ width: '100%' }}>
                                                                <Select 
                                                                    placeholder="请选择标准规范" 
                                                                    style={{ flex: 1 }}
                                                                    value={formState.projectInfo.taskBookId}
                                                                    onChange={val => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { taskBookId: val } })}
                                                                    options={MOCK_TASKBOOKS.map(tb => ({ label: tb.name, value: tb.id }))}
                                                                />
                                                                <Button 
                                                                    icon={<Eye size={16} />} 
                                                                    disabled={!formState.projectInfo.taskBookId}
                                                                    onClick={() => setPreviewVisible(true)}
                                                                />
                                                            </Space.Compact>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item label="二级项目" required><Select placeholder="请选择" value={formState.projectInfo.levelTwoId} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { levelTwoId: v } })} options={[{ value: 'P-01-01', label: '二级项目一' }]} /></Form.Item>
                                                        <Form.Item label="英文名称"><Input placeholder="请输入" value={formState.projectInfo.englishName} onChange={(e) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { englishName: e.target.value } })} /></Form.Item>
                                                        <Form.Item label="场景分类" required>
                                                            <Select placeholder="请选择" value={formState.projectInfo.sceneCategory} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { sceneCategory: v } })} 
                                                                options={[{ value: 'Household', label: '家庭(Household)' }, { value: 'Factory', label: '工厂(Factory)' }, { value: 'Supermarket', label: '超市(Supermarket)' }, { value: 'Office', label: '办公(Office)' }]} 
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="子场景分类"><Select placeholder="请选择" value={formState.projectInfo.subSceneCategory} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { subSceneCategory: v } })} options={[{ value: 'sub1', label: '子场景1' }]} /></Form.Item>
                                                    </Col>
                                                </Row>
                                            </Card>

                                            <Card title={<Space>采集配置 {selectedTemplate !== 'blank' && creationSource !== 'ai' && <span style={{ fontSize: 12, color: '#1677ff', fontWeight: 400 }}>(部分由模版填充)</span>}</Space>} size="small" headStyle={{ background: '#fafafa' }}>
                                                <Row gutter={48}>
                                                    <Col span={8}>
                                                        <Form.Item label={<span style={selectedTemplate !== 'blank' && creationSource !== 'ai' ? { color: '#1677ff' } : {}}>设备类型</span>} required>
                                                            <Select placeholder="请选择" value={formState.projectInfo.deviceType} onChange={handleDeviceChange} 
                                                                options={[
                                                                    { value: 'FRANKA-FR3', label: 'FRANKA Emika - FR3' }, 
                                                                    { value: 'UR5e', label: 'UR5e' }, 
                                                                    { value: 'galbot_2.2_RGB', label: 'galbot_2.2_RGB' }, 
                                                                    { value: 'galbot_2.2_R', label: 'galbot_2.2_R' }, 
                                                                    { value: 'offline_sim', label: '[测试用]断网' }
                                                                ]} 
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item label={<span style={selectedTemplate !== 'blank' && creationSource !== 'ai' ? { color: '#1677ff' } : {}}>核心采集模式</span>} required>
                                                            <Select placeholder="请选择" value={formState.projectInfo.collectMode} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { collectMode: v } })} options={[{ value: 'WholeBody', label: 'WholeBody' }, { value: 'SingleArm', label: 'SingleArm' }]} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item label={<span style={selectedTemplate !== 'blank' && creationSource !== 'ai' ? { color: '#1677ff' } : {}}>遥操主控方式</span>} required>
                                                            <Select placeholder="请选择" value={formState.projectInfo.remoteControlMode} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT_INFO', payload: { remoteControlMode: v } })} options={[{ value: 'Master-slaveArm', label: 'Master-slaveArm' }, { value: 'VR(VR)', label: 'VR(VR)' }]} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <Form.Item label="设备部件选定 (影响数据采集通道)" required style={{ marginTop: 8 }}>
                                                    {formState.errorLog?.field === 'device' && <Alert message={formState.errorLog.message} type="error" showIcon style={{ marginBottom: 16 }} />}
                                                    {formState.status === 'IDLE' && !formState.projectInfo.deviceType ? (
                                                        <Table size="small" columns={[{ title: '名称', dataIndex: 'name' }, { title: '类型', dataIndex: 'type' }]} dataSource={[]} locale={{ emptyText: '请先在上方指定设备类型以加载联动部件' }} bordered />
                                                    ) : formState.status === 'LOADING_DEVICES' ? (
                                                        <div style={{ textAlign: 'center', padding: '30px', border: '1px solid #f0f0f0' }}><Spin /></div>
                                                    ) : formState.status === 'ERROR' && formState.errorLog?.field === 'device' ? (
                                                        <Alert message="边缘节点握手失败" description={formState.errorLog.message} type="error" showIcon action={<Button size="small" type="primary" danger onClick={() => handleDeviceChange(formState.projectInfo.deviceType)}>重试拉取</Button>} />
                                                    ) : (
                                                        <Table size="small" rowSelection={{ type: 'checkbox', selectedRowKeys: formState.deviceConfig.selectedParts, onChange: (keys) => dispatch({ type: 'TOGGLE_PART_BULK', payload: keys }) }} rowKey="id" columns={[{ title: '名称', dataIndex: 'name' }, { title: '类型', dataIndex: 'type' }]} dataSource={formState.deviceConfig.availableParts} pagination={false} bordered />
                                                    )}
                                                </Form.Item>

                                                <Row gutter={48} style={{ marginTop: 24 }}>
                                                    <Col span={12}>
                                                        <Row align="middle">
                                                            <Col><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span><span style={{ marginRight: 16 }}>数据生成通道</span></Col>
                                                            <Col><Radio.Group onChange={(e) => dispatch({ type: 'UPDATE_META', payload: { dataGenMode: e.target.value } })} value={formState.taskMeta.dataGenMode}><Radio value="真机">真机</Radio><Radio value="仿真">仿真</Radio></Radio.Group></Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Card>

                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                                                <Button size="middle" onClick={() => setFormStep('select')} disabled={formState.status === 'SUBMITTING'}>返回模版选择</Button>
                                                <Button size="middle" type="primary" onClick={handleNextConfigStep} disabled={formState.status === 'SUBMITTING'}>下一步配置</Button>
                                            </div>
                                        </Form>
                                    </motion.div>
                                )}

                                {configStep === 1 && (
                                    <motion.div key="cstep2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Card size="small" style={{ marginBottom: 24, borderRadius: 8 }} headStyle={{ background: '#fafafa' }}>
                                            <Form layout="horizontal" labelAlign="right" labelCol={{ flex: '100px' }} wrapperCol={{ flex: 1 }}>
                                                
                                                {/* 第一行：动作步骤 & 任务模板 */}
                                                <Row gutter={48}>
                                                    <Col span={12}>
                                                        <Form.Item label={<><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>动作步骤</>} style={{ marginBottom: 16 }}>
                                                            <Radio.Group value={formState.configData.actionType} onChange={e => dispatch({ type: 'UPDATE_CONFIG', payload: { actionType: e.target.value } })}>
                                                                <Radio value="formatted" style={{ color: '#1677ff' }}>格式化步骤</Radio>
                                                                <Radio value="natural">自然语言描述步骤</Radio>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item label={<><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>任务模板</>} style={{ marginBottom: 16 }}>
                                                            <Select 
                                                                placeholder="请选择任务模板" 
                                                                value={selectedTemplate === 'blank' ? null : selectedTemplate?.key} 
                                                                disabled 
                                                                options={TEMPLATES.map(t => ({ value: t.key, label: t.name }))}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                {/* 第二行结构：如果选择的是格式化步骤，显示配置表格 */}
                                                {formState.configData.actionType === 'formatted' && (
                                                    <div style={{ marginBottom: 24 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                            <span style={{ fontWeight: 600, fontSize: 14 }}>格式化步骤配置</span>
                                                            <Button type="primary" icon={<PlusCircle size={14} style={{ marginRight: 4 }} />} onClick={() => {
                                                                const newData = [...formState.configData.stepsData];
                                                                newData.push({ id: Date.now(), step: newData.length + 1, et: '', skill: '', obj: '', goal: '' });
                                                                dispatch({ type: 'UPDATE_CONFIG', payload: { stepsData: newData } });
                                                            }} style={{ display: 'flex', alignItems: 'center' }}>
                                                                新增步骤
                                                            </Button>
                                                        </div>
                                                        <Table 
                                                            size="small" 
                                                            columns={[
                                                                { title: '步骤', dataIndex: 'step', width: 60, align: 'center', render: (text) => <span style={{ color: '#8c8c8c' }}>{text}</span> },
                                                                { title: '执行末端类型', dataIndex: 'et', render: (text, record, index) => <Input variant="borderless" value={text} placeholder="请输入" onChange={(e) => { const nd = [...formState.configData.stepsData]; nd[index].et = e.target.value; dispatch({ type: 'UPDATE_CONFIG', payload: { stepsData: nd } }); }} /> },
                                                                { title: '原子技能', dataIndex: 'skill', render: (text, record, index) => <Input variant="borderless" value={text} placeholder="请输入" onChange={(e) => { const nd = [...formState.configData.stepsData]; nd[index].skill = e.target.value; dispatch({ type: 'UPDATE_CONFIG', payload: { stepsData: nd } }); }} /> },
                                                                { title: '操作对象', dataIndex: 'obj', render: (text, record, index) => <Input variant="borderless" value={text} placeholder="请输入" onChange={(e) => { const nd = [...formState.configData.stepsData]; nd[index].obj = e.target.value; dispatch({ type: 'UPDATE_CONFIG', payload: { stepsData: nd } }); }} /> },
                                                                { title: '操作目标', dataIndex: 'goal', render: (text, record, index) => <Input variant="borderless" value={text} placeholder="请输入" onChange={(e) => { const nd = [...formState.configData.stepsData]; nd[index].goal = e.target.value; dispatch({ type: 'UPDATE_CONFIG', payload: { stepsData: nd } }); }} /> },
                                                            ]} 
                                                            dataSource={formState.configData.stepsData} 
                                                            pagination={false} 
                                                            bordered 
                                                            locale={{ emptyText: <span style={{ color: '#bfbfbf', margin: '20px 0', display: 'inline-block' }}>暂无数据</span> }}
                                                        />
                                                    </div>
                                                )}

                                                <Row gutter={48}>
                                                    <Col span={12}>
                                                        <Form.Item label={<><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>采集数量</>}>
                                                            <InputNumber style={{ width: '100%' }} placeholder="请输入采集数量" value={formState.taskMeta.plannedCount} onChange={(v) => dispatch({ type: 'UPDATE_META', payload: { plannedCount: v } })} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item label="上传文件" labelCol={{ flex: '100px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Button type="primary" style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
                                                                    <UploadCloud size={16} /> 上传文件
                                                                </Button>
                                                                <span style={{ color: '#bfbfbf', fontSize: 13 }}>请上传场景的layout文件</span>
                                                            </div>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <Row gutter={48}>
                                                    <Col span={24}>
                                                        <Form.Item label="是否为货架">
                                                            <Switch checkedChildren="是" unCheckedChildren="否" checked={formState.configData.isShelf} onChange={(v) => dispatch({ type: 'UPDATE_CONFIG', payload: { isShelf: v } })} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <Row gutter={48} style={{ marginTop: 8 }}>
                                                    <Col span={12}>
                                                        <Form.Item label="场景初始状态" labelAlign="right">
                                                            <Input.TextArea rows={4} maxLength={500} showCount placeholder="请描述场景初始状态" value={formState.configData.sceneInitState} onChange={(e) => dispatch({ type: 'UPDATE_CONFIG', payload: { sceneInitState: e.target.value } })} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item label="英文场景初始状态" labelAlign="right" labelCol={{ flex: '120px' }} wrapperCol={{ flex: 1 }}>
                                                            <Input.TextArea rows={4} maxLength={500} showCount placeholder="请描述英文场景初始状态" value={formState.configData.enSceneInitState} onChange={(e) => dispatch({ type: 'UPDATE_CONFIG', payload: { enSceneInitState: e.target.value } })} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <Row gutter={48}>
                                                    <Col span={12}>
                                                        <Form.Item label="泛化条件" labelAlign="right">
                                                            <Input.TextArea rows={4} maxLength={500} showCount placeholder="请描述泛化条件" value={formState.configData.generalization} onChange={(e) => dispatch({ type: 'UPDATE_CONFIG', payload: { generalization: e.target.value } })} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                
                                            </Form>
                                        </Card>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                                            <Button size="middle" onClick={() => setConfigStep(0)} disabled={formState.status === 'SUBMITTING'}>上一步</Button>
                                            <Button size="middle" type="primary" loading={formState.status === 'SUBMITTING'} onClick={handleSubmit}>提交创建</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
            {/* TaskBook Preview Drawer */}
            <Drawer
                title={
                    <Space>
                        <FileText size={18} />
                        <span>任务书规范预览</span>
                    </Space>
                }
                width={500}
                onClose={() => setPreviewVisible(false)}
                open={previewVisible}
            >
                {formState.projectInfo.taskBookId && (
                    <div>
                        <Title level={4}>
                            {MOCK_TASKBOOKS.find(tb => tb.id === formState.projectInfo.taskBookId)?.name}
                        </Title>
                        <Divider />
                        <Title level={5}>规范摘要</Title>
                        <Paragraph>
                            {MOCK_TASKBOOKS.find(tb => tb.id === formState.projectInfo.taskBookId)?.content}
                        </Paragraph>
                        <Alert 
                            message="详细规范请至“任务书管理”模块下载完整 PDF 文档。" 
                            type="info" 
                            showIcon 
                            style={{ marginTop: 20 }}
                        />
                    </div>
                )}
            </Drawer>
        </MainLayout>
    );
}
