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
  Tag, 
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

// Same mock data as view page
const mockDeviceData = {
  '1': { 
    key: '1', name: 'galbot_2.2_RGB', enName: 'galbot_2.2', version: 'V2.2', 
    desc: '预置 galbot V2.2 机器人配套 RGB 相机模块，支持高清图像采集与实时传输，适用于视觉引导抓取、目标检测等场景。', 
    urdf: 'galbot_v2.urdf', regDate: '2025-12-20', status: 'enabled',
    parts: [
      { key: 'p1', align: '头部', name: '头部左相机', type: 'Body-HeadLeftCamera(本体-头部左侧相机)' },
      { key: 'p2', align: '头部', name: '头部右相机', type: 'Body-HeadRightCamera(本体-头部右侧相机)' },
      { key: 'p3', align: '左臂', name: '灵巧手_左', type: 'EndEffector-DexHand(末端-灵巧手)' },
      { key: 'p4', align: '右臂', name: '灵巧手_右', type: 'EndEffector-DexHand(末端-灵巧手)' },
    ],
  },
  '2': { 
    key: '2', name: 'galbot_2.2_深度', enName: 'galbot_2.2.1', version: 'V2.2.1', 
    desc: '预置 galbot V2.2 机器人配套深度相机模块，支持点云生成与3D场景重建。', 
    urdf: 'galbot_v2_depth.urdf', regDate: '2025-12-19', status: 'enabled',
    parts: [
      { key: 'p1', align: '头部', name: '深度相机_主', type: 'Body-DepthCamera(本体-深度相机)' },
    ],
  },
  '3': { 
    key: '3', name: 'galbot_2.2_红外', enName: 'galbot_2.2_IR', version: 'V2.2', 
    desc: '预置 galbot V2.2 机器人配套红外传感器模块，适用于夜间或低光照条件下的目标检测与避障。', 
    urdf: 'galbot_v2_ir.urdf', regDate: '2025-12-19', status: 'disabled',
    parts: [
      { key: 'p1', align: '头部', name: '红外传感器', type: 'Body-IRSensor(本体-红外传感器)' },
    ],
  },
};

export default function DeviceTypeEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const device = mockDeviceData[id] || mockDeviceData['1'];

  const [parts, setParts] = useState(device.parts || []);

  const handleRemovePart = (key) => {
    setParts(parts.filter(p => p.key !== key));
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Save:', { ...values, parts });
      message.success('设备信息保存成功！');
      router.push(`/collection/device-types/${id}`);
    }).catch(() => {
      message.error('请填写必填项');
    });
  };

  const handleReset = () => {
    form.resetFields();
    setParts(device.parts || []);
    message.info('表单已重置');
  };

  const partColumns = [
    { 
      title: '对齐点', 
      dataIndex: 'align', 
      key: 'align', 
      width: 100, 
      align: 'center',
      render: (t) => (
        <Tag style={{ background: '#f0f5ff', borderColor: '#adc6ff', color: '#2f54eb', borderRadius: 4 }}>{t}</Tag>
      )
    },
    { title: '部件名称', dataIndex: 'name', key: 'name', width: 180 },
    { title: '部件类型', dataIndex: 'type', key: 'type' },
    { 
      title: '操作', 
      key: 'action', 
      width: 80, 
      align: 'center',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          size="small"
          onClick={() => handleRemovePart(record.key)}
        />
      )
    },
  ];

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={() => router.push(`/collection/device-types/${id}`)}
              style={{ color: '#64748b' }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              设备类型管理 / {device.name} / <Text style={{ color: '#1e293b', fontSize: 13 }}>编辑</Text>
            </Text>
          </Space>
          <Title level={4} style={{ margin: '0 0 4px 0' }}>编辑设备: {device.name}</Title>
          <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
            修改设备信息后点击底部「保存修改」按钮提交更改。
          </Paragraph>
        </div>
      </motion.div>

      {/* Edit Form */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <Form 
          form={form} 
          layout="vertical"
          initialValues={{
            name: device.name,
            enName: device.enName,
            version: device.version,
            desc: device.desc,
            status: device.status,
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
                  label="机器人名称"
                  rules={[{ required: true, message: '请输入机器人名称' }]}
                >
                  <Input placeholder="请输入机器人名称" maxLength={50} showCount />
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
                  name="version" 
                  label="机器人版本"
                  rules={[{ required: true, message: '请输入机器人版本' }]}
                >
                  <Input placeholder="请输入机器人版本" maxLength={50} showCount />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
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
                <Form.Item 
                  name="desc" 
                  label="传感器描述"
                  rules={[{ required: true, message: '请输入传感器描述' }]}
                >
                  <TextArea rows={4} placeholder="请输入传感器描述" maxLength={500} showCount />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Section 2: Parts */}
          <Card 
            title="部件配置"
            variant="borderless"
            className="card"
            style={{ marginBottom: 20 }}
            extra={
              <Select 
                placeholder="选择并添加部件" 
                style={{ width: 220 }} 
                value={null}
                onChange={(val) => {
                  const newKey = `p${Date.now()}`;
                  const partMap = {
                    'head_cam_left': { key: newKey, align: '头部', name: '头部左相机', type: 'Body-HeadLeftCamera(本体-头部左侧相机)' },
                    'head_cam_right': { key: newKey, align: '头部', name: '头部右相机', type: 'Body-HeadRightCamera(本体-头部右侧相机)' },
                    'hand_left': { key: newKey, align: '左臂', name: '灵巧手_左', type: 'EndEffector-DexHand(末端-灵巧手)' },
                    'hand_right': { key: newKey, align: '右臂', name: '灵巧手_右', type: 'EndEffector-DexHand(末端-灵巧手)' },
                    'gripper': { key: newKey, align: '右臂', name: '夹爪_右', type: 'EndEffector-Gripper(末端-夹爪)' },
                  };
                  if (partMap[val]) setParts([...parts, partMap[val]]);
                }}
              >
                <Select.Option value="head_cam_left">头部左相机</Select.Option>
                <Select.Option value="head_cam_right">头部右相机</Select.Option>
                <Select.Option value="hand_left">灵巧手_左</Select.Option>
                <Select.Option value="hand_right">灵巧手_右</Select.Option>
                <Select.Option value="gripper">夹爪_右</Select.Option>
              </Select>
            }
          >
            <Table
              dataSource={parts}
              columns={partColumns}
              pagination={false}
              size="small"
              locale={{ emptyText: '暂无部件，请在右上方选择添加' }}
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
