'use client';
import React from 'react';
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
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock data
const mockDeviceData = {
  '1': { 
    key: '1', name: 'R001GBDDAAAE0810', enName: 'R001GBDDAAA...', 
    deviceId: 'DEV-B-100', deviceType: 'galbot_2.2_RGB',
    remark: '一号采集车搭载设备，用于日常数据采集任务。',
    urdf: 'galbot_v2.urdf', status: 'enabled',
  },
  '2': { 
    key: '2', name: 'R001GBDDAAAE0811', enName: 'R001GBDDAAB...', 
    deviceId: 'DEV-B-101', deviceType: 'galbot_2.2_深度',
    remark: '二号设备，深度视觉采集专用。',
    urdf: 'galbot_v2_depth.urdf', status: 'enabled',
  },
  '3': { 
    key: '3', name: 'R001GBDDAAAE0812', enName: 'R001GBDDAAC...', 
    deviceId: 'DEV-B-102', deviceType: 'galbot_2.2_红外',
    remark: '',
    urdf: '', status: 'disabled',
  },
};

export default function EditDeviceInstancePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const device = mockDeviceData[id] || mockDeviceData['1'];

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Save device:', values);
      message.success('设备信息保存成功！');
      router.push(`/collection/device-list/${id}`);
    }).catch(() => {
      message.error('请填写必填项');
    });
  };

  const handleReset = () => {
    form.resetFields();
    message.info('表单已重置');
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={() => router.push(`/collection/device-list/${id}`)}
              style={{ color: '#64748b' }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              设备列表 / {device.name} / <Text style={{ color: '#1e293b', fontSize: 13 }}>编辑</Text>
            </Text>
          </Space>
          <Title level={4} style={{ margin: '0 0 4px 0' }}>编辑设备: {device.name}</Title>
          <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
            修改设备信息后点击底部「保存修改」按钮提交更改。
          </Paragraph>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <Form 
          form={form} 
          layout="vertical"
          initialValues={{
            name: device.name,
            enName: device.enName,
            deviceId: device.deviceId,
            deviceType: device.deviceType,
            status: device.status,
            remark: device.remark,
          }}
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
                  label="设备名称"
                  rules={[{ required: true, message: '请输入设备名称' }]}
                >
                  <Input placeholder="请输入设备名称" maxLength={50} showCount />
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
                  name="deviceId" 
                  label="设备编号"
                  rules={[{ required: true, message: '请输入设备编号' }]}
                >
                  <Input placeholder="请输入设备编号" maxLength={50} showCount />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={8}>
                <Form.Item 
                  name="deviceType" 
                  label="设备类型"
                  rules={[{ required: true, message: '请选择设备类型' }]}
                >
                  <Select placeholder="请选择设备类型">
                    <Select.Option value="galbot_2.2_RGB">galbot_2.2_RGB</Select.Option>
                    <Select.Option value="galbot_2.2_深度">galbot_2.2_深度</Select.Option>
                    <Select.Option value="galbot_2.2_红外">galbot_2.2_红外</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="status" 
                  label="状态"
                >
                  <Select>
                    <Select.Option value="enabled">启用</Select.Option>
                    <Select.Option value="disabled">禁用</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={24}>
                <Form.Item name="remark" label="备注">
                  <TextArea rows={3} placeholder="请输入备注信息" maxLength={500} showCount />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Section 2: Files & Images */}
          <Card 
            title="文件与图片"
            variant="borderless"
            className="card"
            style={{ marginBottom: 80 }}
          >
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item label="URDF 文件">
                  {device.urdf && (
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: 8, 
                      padding: '8px 12px', background: '#f8fafc', borderRadius: 6, 
                      border: '1px solid #e2e8f0', marginBottom: 12 
                    }}>
                      <Text style={{ fontSize: 12, flex: 1 }}>{device.urdf}</Text>
                      <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                    </div>
                  )}
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
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ minWidth: 120 }}>保存修改</Button>
        </div>
      </Affix>
    </MainLayout>
  );
}
