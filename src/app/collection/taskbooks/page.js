'use client';
import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, Tag, Space, Button, Card, Input, Form, Row, Col, Drawer, Modal, Typography, Divider, Badge, message, Select, List, Empty, Avatar, Tooltip } from 'antd';
import { 
    SearchOutlined, 
    ReloadOutlined, 
    EyeOutlined, 
    FileTextOutlined, 
    DownloadOutlined, 
    PlusOutlined, 
    DeleteOutlined,
    RobotOutlined,
    SendOutlined,
    CheckCircleOutlined,
    BulbOutlined,
    CloudUploadOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const INITIAL_DATA = [
    {
        id: 'TB-2024001',
        name: '餐饮采集标准规范 V1.2',
        scenario: '家庭厨房 / 餐厅',
        version: '1.2.0',
        status: 'published',
        creator: '张三',
        updateTime: '2024-03-20',
        content: {
            purpose: '规范餐具摆放、垃圾清理等场景下的机器人采集数据质量',
            standards: [
                '录制频率不低于 30fps',
                '光照需保持平衡，避免过度曝光',
                '动作需包含完整的拾取与放置过程',
                '机械臂路径需规避非目标物干扰'
            ],
            quality: '成功率需达到 95% 以上，且无明显抖动'
        }
    },
    {
        id: 'TB-2024002',
        name: '工业物流搬运规范 V2.0',
        scenario: '智慧工厂 / 仓库',
        version: '2.0.1',
        status: 'published',
        creator: '李四',
        updateTime: '2024-03-18',
        content: {
            purpose: '定义 AGV 与机械臂协同搬运的标准流程',
            standards: [
                '强制记录力觉传感器数据 (Wrench)',
                '二维码识别延迟需小于 50ms',
                '避障安全距离需设定为 20cm'
            ],
            quality: '定位偏差需在 ±2mm 以内'
        }
    },
    {
        id: 'TB-2024003',
        name: '柔性物体操作指南-折叠类',
        scenario: '家庭 / 洗衣店',
        version: '1.0.5',
        status: 'published',
        creator: '王五',
        updateTime: '2024-03-22',
        content: {
            purpose: '针对衣物、毛巾等非结构化柔性物体的操作标准',
            standards: [
                '需开启双目视觉深度对准',
                '支持折叠点动态识别',
                '需记录布料材质反馈'
            ],
            quality: '平整度评分需 > 4.5/5.0'
        }
    }
];

export default function TaskBooksPage() {
    const [searchForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const [taskBooks, setTaskBooks] = useState(INITIAL_DATA);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const [aiVisible, setAiVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // AI Chat State
    const [chatMessages, setChatMessages] = useState([
        { role: 'ai', content: '您好！我是您的任务书专家。您可以直接告诉我采集场景的需求，或者粘贴现有的 SOP 文本，我将为您自动提取并生成标准任务书。', time: '15:40' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Filter Logic
    const handleSearch = () => {
        const values = searchForm.getFieldsValue();
        const filtered = INITIAL_DATA.filter(item => {
            const matchName = !values.name || item.name.toLowerCase().includes(values.name.toLowerCase());
            const matchScenario = !values.scenario || item.scenario.includes(values.scenario);
            return matchName && matchScenario;
        });
        setTaskBooks(filtered);
    };

    const handleReset = () => {
        searchForm.resetFields();
        setTaskBooks(INITIAL_DATA);
    };

    // Create Logic
    const showCreateDrawer = () => {
        createForm.resetFields();
        setExtractedData(null);
        setCreateVisible(true);
    };

    const handleCreateSubmit = async () => {
        try {
            const values = await createForm.validateFields();
            setSubmitting(true);
            
            setTimeout(() => {
                const newBook = {
                    id: `TB-${Date.now().toString().slice(-7)}`,
                    name: values.name,
                    scenario: values.scenario,
                    version: values.version || '1.0.0',
                    status: 'published',
                    creator: '管理员',
                    updateTime: new Date().toISOString().split('T')[0],
                    content: {
                        purpose: values.purpose,
                        standards: values.standards || [],
                        quality: values.quality
                    }
                };
                
                setTaskBooks([newBook, ...taskBooks]);
                setSubmitting(false);
                setCreateVisible(false);
                message.success('任务书发布成功！');
            }, 800);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    // AI Chat Logic
    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        
        const newMsg = { role: 'user', content: inputValue, time: new Date().toTimeString().slice(0, 5) };
        setChatMessages([...chatMessages, newMsg]);
        setInputValue('');
        setIsAILoading(true);

        // Simulate AI Thinking
        setTimeout(() => {
            const aiMsg = { 
                role: 'ai', 
                content: '好的，我已经根据您的描述提取了初步的规范草案。这份规范针对“超市补货”场景，定义了货架识别和抓取精度要求。您是否需要将其应用到任务书创建页面？',
                time: new Date().toTimeString().slice(0, 5),
                isResult: true
            };
            setChatMessages(prev => [...prev, aiMsg]);
            setExtractedData({
                name: '超市货架补货采集规范 V1.0',
                scenario: '零售超市',
                version: '1.0.0',
                purpose: '规范机器人在超市环境下的货架识别、商品对位及精准补货动作的采集标准。',
                standards: [
                    'RGB-D 深度误差控制在 5mm 内',
                    '需记录完整的商品抓取接触力反馈曲线',
                    '每个货架层的采集时长不少于 60s'
                ],
                quality: '补货成功率 > 98%，商品摆放角度误差 < 5°'
            });
            setIsAILoading(false);
        }, 1500);
    };

    const applyExtractedData = () => {
        if (!extractedData) return;
        createForm.setFieldsValue(extractedData);
        setAiVisible(false);
        setCreateVisible(true);
        message.info('AI 提取的数据已自动填充至表单');
    };

    const columns = [
        {
            title: '任务书 ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text copyable>{text}</Text>,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text}</b>,
        },
        {
            title: '适用场景',
            dataIndex: 'scenario',
            key: 'scenario',
        },
        {
            title: '版本号',
            dataIndex: 'version',
            key: 'version',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: () => <Badge status="success" text="已发布" />
        },
        {
            title: '更新日期',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="link" 
                        icon={<EyeOutlined />} 
                        onClick={() => {
                            setSelectedBook(record);
                            setPreviewVisible(true);
                        }}
                    >
                        详情
                    </Button>
                    <Button type="link" icon={<DownloadOutlined />}>下载</Button>
                </Space>
            ),
        },
    ];

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Search Header */}
                <Card variant="borderless" style={{ marginBottom: 16, borderRadius: 12 }}>
                    <Form form={searchForm} layout="inline">
                        <Row gutter={16} style={{ width: '100%' }}>
                            <Col span={6}>
                                <Form.Item name="name" style={{ width: '100%' }}>
                                    <Input prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />} placeholder="任务书名称" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="scenario" style={{ width: '100%' }}>
                                    <Select placeholder="适用场景" allowClear>
                                        <Option value="家庭厨房">家庭厨房</Option>
                                        <Option value="智慧工厂">智慧工厂</Option>
                                        <Option value="零售超市">零售超市</Option>
                                        <Option value="办公园区">办公园区</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Space>
                                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>搜索</Button>
                                    <Button onClick={handleReset} icon={<ReloadOutlined />}>重置</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Table Card */}
                <Card 
                   variant="borderless" 
                   title={
                    <Space>
                        <FileTextOutlined style={{ color: '#1677ff' }} />
                        <span>任务书管理</span>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>指导数据采集的标准作业程序 (SOP)</Text>
                    </Space>
                   }
                   extra={
                    <Space>
                        <Tooltip title="通过 AI 助手快速提取现有文档中的标准规范">
                            <Button 
                                icon={<RobotOutlined />} 
                                onClick={() => setAiVisible(true)}
                                style={{ background: '#f5faff', borderColor: '#30a4ff', color: '#1677ff' }}
                            >
                                AI 智能建书
                            </Button>
                        </Tooltip>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateDrawer}>
                            手动新建
                        </Button>
                    </Space>
                   }
                   style={{ borderRadius: 12 }}
                >
                    <Table 
                        dataSource={taskBooks} 
                        columns={columns} 
                        rowKey="id"
                        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 份任务书` }}
                    />
                </Card>

                {/* Preview Drawer */}
                <Drawer
                    title={
                        <Space>
                            <FileTextOutlined />
                            <span>标准规范详情预览</span>
                        </Space>
                    }
                    width={640}
                    onClose={() => setPreviewVisible(false)}
                    open={previewVisible}
                >
                    {selectedBook && (
                        <div style={{ padding: '0 12px' }}>
                            <Title level={4}>{selectedBook.name}</Title>
                            <Space split={<Divider type="vertical" />} style={{ marginBottom: 24 }}>
                                <Text type="secondary">版本: {selectedBook.version}</Text>
                                <Text type="secondary">更新: {selectedBook.updateTime}</Text>
                                <Text type="secondary">适用: {selectedBook.scenario}</Text>
                            </Space>

                            <Title level={5} style={{ marginTop: 24 }}>1. 任务目的</Title>
                            <Paragraph>{selectedBook.content.purpose}</Paragraph>

                            <Title level={5} style={{ marginTop: 24 }}>2. 采集技术规范</Title>
                            <ul style={{ paddingLeft: 20 }}>
                                {selectedBook.content.standards.map((s, i) => (
                                    <li key={i} style={{ marginBottom: 8 }}>{s}</li>
                                ))}
                            </ul>

                            <Title level={5} style={{ marginTop: 24 }}>3. 质量验收标准</Title>
                            <Card 
                                styles={{ body: { padding: 16 } }} 
                                style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}
                            >
                                <Text strong style={{ color: '#389e0d' }}>验收红线：</Text>
                                <Text>{selectedBook.content.quality}</Text>
                            </Card>

                            <Divider style={{ marginTop: 40 }} />
                            <div style={{ textAlign: 'right' }}>
                                <Button type="primary" icon={<DownloadOutlined />}>下载完整规范文档</Button>
                            </div>
                        </div>
                    )}
                </Drawer>

                {/* Manual Create Modal */}
                <Modal
                    title="新建数据采集任务书"
                    width={800}
                    onCancel={() => setCreateVisible(false)}
                    open={createVisible}
                    onOk={handleCreateSubmit}
                    confirmLoading={submitting}
                    okText="提交并发布"
                    cancelText="取消"
                    centered
                >
                    <Form form={createForm} layout="vertical" hideRequiredMark style={{ marginTop: 24 }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item
                                    name="name"
                                    label="任务书名称"
                                    rules={[{ required: true, message: '请输入任务书名称' }]}
                                >
                                    <Input placeholder="例如：餐饮采集标准规范 V1.2" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="version"
                                    label="版本号"
                                    initialValue="1.0.0"
                                >
                                    <Input placeholder="1.0.0" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="scenario"
                                    label="适用场景"
                                    rules={[{ required: true, message: '请选择适用场景' }]}
                                >
                                    <Select placeholder="请选择适用场景">
                                        <Option value="家庭厨房">家庭厨房</Option>
                                        <Option value="餐厅办公">餐厅办公</Option>
                                        <Option value="智能工厂">智能工厂</Option>
                                        <Option value="零售超市">零售超市</Option>
                                        <Option value="通用服务">通用服务</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider orientation="left">核心规范定义</Divider>
                        <Form.Item
                            name="purpose"
                            label="1. 任务目的"
                            rules={[{ required: true, message: '请输入任务目的' }]}
                        >
                            <Input.TextArea rows={4} placeholder="描述该采集任务的核心业务目标与价值..." />
                        </Form.Item>

                        <Form.List name="standards">
                            {(fields, { add, remove }) => (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <Text strong>2. 采集技术规范条目</Text>
                                        <Button type="link" onClick={() => add()} icon={<PlusOutlined />}>添加条目</Button>
                                    </div>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: 8 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name]}
                                                    rules={[{ required: true, message: '请输入规范条目内容' }]}
                                                    style={{ width: 700 }}
                                                >
                                                    <Input placeholder="例如：录制频率不低于 30fps" />
                                                </Form.Item>
                                                <DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                                            </Space>
                                        ))}
                                        {fields.length === 0 && (
                                            <Empty description={<Text type="secondary">暂无技术规范条目</Text>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        )}
                                    </div>
                                </>
                            )}
                        </Form.List>

                        <Form.Item
                            name="quality"
                            label="3. 质量验收标准 (红线)"
                            rules={[{ required: true, message: '请输入验收标准' }]}
                            style={{ marginTop: 24 }}
                        >
                            <Input.TextArea rows={3} placeholder="定义数据是否合格的判定准则..." />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* AI Assistant Drawer */}
                <Drawer
                    title={
                        <Space>
                            <RobotOutlined style={{ color: '#1677ff' }} />
                            <span>AI 智能建书助手</span>
                            <Badge count="PRO" style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                        </Space>
                    }
                    width={480}
                    onClose={() => setAiVisible(false)}
                    open={aiVisible}
                    styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
                    maskClosable={false}
                >
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f9f9f9' }}>
                        {chatMessages.map((msg, index) => (
                            <div key={index} style={{ marginBottom: 20, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                                <div style={{ marginBottom: 4 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{msg.time}</Text>
                                </div>
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                    alignItems: 'flex-start'
                                }}>
                                    <Avatar 
                                        icon={msg.role === 'user' ? null : <RobotOutlined />} 
                                        style={{ backgroundColor: msg.role === 'user' ? '#1677ff' : '#00b96b' }}
                                    >
                                        {msg.role === 'user' ? 'U' : null}
                                    </Avatar>
                                    <div style={{ 
                                        maxWidth: '80%',
                                        margin: msg.role === 'user' ? '0 12px 0 0' : '0 0 0 12px',
                                        padding: '12px 16px',
                                        background: msg.role === 'user' ? '#1677ff' : '#fff',
                                        color: msg.role === 'user' ? '#fff' : 'rgba(0,0,0,0.88)',
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        textAlign: 'left'
                                    }}>
                                        {msg.content}
                                        
                                        {msg.isResult && (
                                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                                                <Button 
                                                    type="primary" 
                                                    block 
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={applyExtractedData}
                                                >
                                                    应用至任务书表单
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isAILoading && (
                            <div style={{ paddingLeft: 52 }}>
                                <Text type="secondary">AI 正在分析并提取规范...</Text>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    
                    <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
                        <div style={{ marginBottom: 12 }}>
                            <Space wrap>
                                <Tag icon={<BulbOutlined />} color="processing" onClick={() => setInputValue('帮我起草一份超市货架补货的标准规范')}>超市补货</Tag>
                                <Tag icon={<CloudUploadOutlined />} color="orange" onClick={() => setInputValue('这是我之前的 SOP 文档，请提取关键条目：[粘贴文档内容]')}>从 SOP 提取</Tag>
                            </Space>
                        </div>
                        <Input.TextArea
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="描述采集场景的需求，或粘贴 SOP 内容..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            onPressEnter={(e) => {
                                if (e.shiftKey) return;
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            suffix={
                                <Button 
                                    type="primary" 
                                    shape="circle" 
                                    icon={<SendOutlined />} 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim()}
                                />
                            }
                        />
                    </div>
                </Drawer>
            </motion.div>
        </MainLayout>
    );
}
