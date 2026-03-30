'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { 
  Typography, 
  Button, 
  Space, 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Select, 
  Table, 
  Tooltip, 
  Upload, 
  message,
  Affix
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  UploadOutlined, 
  PlusOutlined, 
  InfoCircleOutlined, 
  DeleteOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function CreatePartPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [topics, setTopics] = useState([
    { key: '1', seq: 1, name: '', ename: '', topic: '', sign: '', resW: '', resH: '' }
  ]);

  const handleAddTopic = () => {
    const newSeq = topics.length + 1;
    setTopics([...topics, { key: `${Date.now()}`, seq: newSeq, name: '', ename: '', topic: '', sign: '', resW: '', resH: '' }]);
  };

  const handleRemoveTopic = (key) => {
    if (topics.length <= 1) {
      message.warning('至少保留一个 Topic 组件');
      return;
    }
    setTopics(topics.filter(t => t.key !== key));
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Create Part:', { ...values, topics });
      message.success('部件创建成功！');
      router.push('/collection/device-types');
    }).catch(() => {
      message.error('请填写必填项');
    });
  };

  const handleReset = () => {
    form.resetFields();
    setTopics([{ key: '1', seq: 1, name: '', ename: '', topic: '', sign: '', resW: '', resH: '' }]);
    message.info('表单已重置');
  };

  const topicColumns = [
    { 
      title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center',
      render: (_, __, index) => <Text type="secondary">{index + 1}</Text>
    },
    { 
      title: 'Topic名称', dataIndex: 'name', key: 'name', 
      render: () => <Input placeholder="请输入Topic名称" size="small" variant="borderless" /> 
    },
    { 
      title: '英文名称', dataIndex: 'ename', key: 'ename', 
      render: () => <Input placeholder="请输入英文名称" size="small" variant="borderless" /> 
    },
    { 
      title: 'Topic', dataIndex: 'topic', key: 'topic', 
      render: () => <Input placeholder="请输入Topic" size="small" variant="borderless" /> 
    },
    { 
      title: '标识', dataIndex: 'sign', key: 'sign', 
      render: () => <Input placeholder="请输入标识" size="small" variant="borderless" /> 
    },
    { 
      title: '分辨率', dataIndex: 'res', key: 'res', width: 160, 
      render: () => (
        <Space size={4}>
          <Input placeholder="宽" size="small" style={{ width: 50, padding: '0 4px', textAlign: 'center' }} />
          <span>×</span>
          <Input placeholder="高" size="small" style={{ width: 50, padding: '0 4px', textAlign: 'center' }} />
        </Space>
      )
    },
    { 
      title: '操作', key: 'action', width: 100, align: 'center',
      render: (_, record) => (
        <Space>
          <div 
            style={{ width: 22, height: 22, borderRadius: '50%', background: '#ff4d4f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }} 
            onClick={() => handleRemoveTopic(record.key)}
          >−</div>
          <div 
            style={{ width: 22, height: 22, borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }} 
            onClick={handleAddTopic}
          >+</div>
        </Space>
      )
    },
  ];

  return (
    <MainLayout>
      {/* Page Header - Ant Design Pro style */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={() => router.push('/collection/device-types')}
              style={{ color: '#64748b' }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              设备类型管理 / <Text style={{ color: '#1e293b', fontSize: 13 }}>添加机器人部件</Text>
            </Text>
          </Space>
          <Title level={4} style={{ margin: '0 0 4px 0' }}>添加机器人部件</Title>
          <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
            填写以下信息创建新的机器人部件类型，带 <Text type="danger">*</Text> 的为必填项。
          </Paragraph>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <Form 
          form={form} 
          layout="vertical"
        >
          {/* Section 1: Basic Info */}
          <Card 
            title="基本信息"
            variant="borderless"
            className="card"
            style={{ marginBottom: 20 }}
          >
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item 
                  name="name" 
                  label="部件名称"
                  rules={[{ required: true, message: '请输入部件名称' }]}
                >
                  <Input placeholder="请输入部件名称" maxLength={50} showCount />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="enName" 
                  label={<span>英文名称 <Tooltip title="System ID"><InfoCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} /></Tooltip></span>}
                >
                  <Input placeholder="请输入英文名称" maxLength={50} showCount />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="type" 
                  label="部件类型"
                  rules={[{ required: true, message: '请选择部件类型' }]}
                >
                  <Select placeholder="请选择部件类型">
                    <Select.Option value="camera_rgb">RGB 相机</Select.Option>
                    <Select.Option value="camera_depth">深度相机</Select.Option>
                    <Select.Option value="camera_ir">红外传感器</Select.Option>
                    <Select.Option value="dex_hand">灵巧手</Select.Option>
                    <Select.Option value="gripper">工业夹爪</Select.Option>
                    <Select.Option value="force_sensor">力矩传感器</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={8}>
                <Form.Item 
                  name="brand" 
                  label="部件品牌"
                >
                  <Input placeholder="请输入部件品牌" maxLength={50} showCount />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={24}>
                <Form.Item 
                  name="desc" 
                  label="传感器描述"
                >
                  <TextArea rows={4} placeholder="请输入传感器描述" maxLength={500} showCount />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Section 2: Topic Components */}
          <Card 
            title="Topic 组件配置"
            variant="borderless"
            className="card"
            style={{ marginBottom: 20 }}
          >
            <Table
              dataSource={topics}
              columns={topicColumns}
              pagination={false}
              size="small"
              bordered
            />
          </Card>

          {/* Section 3: Files & Images */}
          <Card 
            title="文件与图片"
            variant="borderless"
            className="card"
            style={{ marginBottom: 80 }}
          >
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item label="URDF 文件">
                  <Upload showUploadList={false}>
                    <Button icon={<UploadOutlined />}>上传 URDF 文件</Button>
                  </Upload>
                  <div style={{ marginTop: 6 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>可上传最多1份 .urdf 格式的文件</Text>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备图片">
                  <Upload listType="picture-card" showUploadList={false}>
                    <div style={{ color: '#94a3b8' }}>
                      <PlusOutlined style={{ fontSize: 24 }} />
                      <div style={{ marginTop: 8, fontSize: 12 }}>上传图片</div>
                    </div>
                  </Upload>
                  <div style={{ marginTop: 6 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      可上传最多5张，单个不超过2MB，格式 jpg/jpeg/png/gif
                    </Text>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </motion.div>

      {/* Fixed Footer Toolbar */}
      <Affix offsetBottom={0}>
        <div style={{
          background: '#fff',
          padding: '12px 24px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
          marginLeft: -24,
          marginRight: -24,
        }}>
          <Button icon={<UndoOutlined />} onClick={handleReset} style={{ minWidth: 88 }}>重置</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ minWidth: 120 }}>提交</Button>
        </div>
      </Affix>
    </MainLayout>
  );
}
