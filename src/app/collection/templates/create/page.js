'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Form, Input, Select, Button, Card, Space, Row, Col, Typography, Divider, Table, Alert, message } from 'antd';
import { 
  PlusOutlined, 
  LeftOutlined, 
  SaveOutlined, 
  DeleteOutlined, 
  HolderOutlined,
  BulbOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function CreateTemplatePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [steps, setSteps] = useState([
    { key: '1', et: '右手', skill: '识别', obj: '目标物品', goal: '确认位置' }
  ]);

  const handleAddStep = () => {
    const newKey = (steps.length + 1).toString();
    setSteps([...steps, { key: newKey, et: '右手', skill: '抓取', obj: '', goal: '' }]);
  };

  const handleDeleteStep = (key) => {
    if (steps.length <= 1) {
      message.warning('模板至少需要包含一个步骤');
      return;
    }
    setSteps(steps.filter(s => s.key !== key));
  };

  const onFinish = (values) => {
    console.log('Success:', { ...values, steps });
    message.success('模板创建成功！');
    router.push('/collection/templates');
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (_, __, index) => <Text type="secondary">{index + 1}</Text>,
    },
    {
      title: '执行末端',
      dataIndex: 'et',
      width: 150,
      render: (text, record) => (
        <Select 
          defaultValue={text} 
          style={{ width: '100%' }}
          onChange={(val) => {
            const newSteps = [...steps];
            const idx = newSteps.findIndex(s => s.key === record.key);
            newSteps[idx].et = val;
            setSteps(newSteps);
          }}
          options={[
            { value: '右手', label: '右手(RightHand)' },
            { value: '左手', label: '左手(LeftHand)' },
            { value: '双手', label: '双手(DualArms)' },
            { value: '导航', label: '导航(Navigation)' },
          ]}
        />
      ),
    },
    {
      title: '动作技能',
      dataIndex: 'skill',
      width: 150,
      render: (text, record) => (
        <Select 
          defaultValue={text} 
          style={{ width: '100%' }}
          onChange={(val) => {
            const newSteps = [...steps];
            const idx = newSteps.findIndex(s => s.key === record.key);
            newSteps[idx].skill = val;
            setSteps(newSteps);
          }}
          options={[
            { value: '识别', label: '识别(Perceive)' },
            { value: '抓取', label: '抓取(Grasp)' },
            { value: '放置', label: '放置(Place)' },
            { value: '移动', label: '移动(Move)' },
            { value: '点击', label: '点击(Click)' },
            { value: '旋转', label: '旋转(Rotate)' },
          ]}
        />
      ),
    },
    {
      title: '操作对象',
      dataIndex: 'obj',
      render: (text, record) => (
        <Input 
          defaultValue={text} 
          placeholder="例如：饮料瓶" 
          onChange={(e) => {
            const newSteps = [...steps];
            const idx = newSteps.findIndex(s => s.key === record.key);
            newSteps[idx].obj = e.target.value;
            setSteps(newSteps);
          }}
        />
      ),
    },
    {
      title: '预期目标',
      dataIndex: 'goal',
      render: (text, record) => (
        <Input 
          defaultValue={text} 
          placeholder="例如：放入垃圾桶" 
          onChange={(e) => {
            const newSteps = [...steps];
            const idx = newSteps.findIndex(s => s.key === record.key);
            newSteps[idx].goal = e.target.value;
            setSteps(newSteps);
          }}
        />
      ),
    },
    {
      title: '操作',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleDeleteStep(record.key)} 
        />
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}
      >
        {/* Header Area */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Space size="large">
            <Button 
              icon={<LeftOutlined />} 
              type="text" 
              onClick={() => router.back()}
              style={{ fontSize: 16 }}
            >
              返回列表
            </Button>
            <Divider type="vertical" style={{ height: 24 }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>新建任务模板</Title>
              <Text type="secondary">定义标准化的具身智能采集作业流程规范</Text>
            </div>
          </Space>
          <Space>
            <Button onClick={() => router.back()}>取消</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>保存模板</Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            tag: '服务数据',
            device: 'galbot_2.2_RGB',
            remote: 'Master-slave',
            mode: 'WholeBody'
          }}
        >
          <Row gutter={24}>
            {/* Left Column: Basic Info */}
            <Col span={16}>
              <Card title="基础信息与逻辑" variant="borderless" style={{ marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Row gutter={16}>
                  <Col span={18}>
                    <Form.Item 
                      label="模板名称" 
                      name="name" 
                      rules={[{ required: true, message: '请输入模板名称' }]}
                    >
                      <Input placeholder="例如：家居环境桌面整理规范" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="标识图标" name="icon">
                      <Input placeholder="Emoji/图标" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="模板描述" name="desc">
                  <TextArea 
                    placeholder="简要说明此模板适用的具体场景和作业目标..." 
                    rows={4} 
                    maxLength={200} 
                    showCount 
                  />
                </Form.Item>

                <Divider style={{ margin: '24px 0 16px' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 15 }}>动作步骤定义 (Dynamic Steps)</Text>
                  <Button 
                    type="dashed" 
                    icon={<PlusOutlined />} 
                    onClick={handleAddStep}
                  >
                    新增步骤
                  </Button>
                </div>

                <Table
                  dataSource={steps}
                  columns={columns}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName="editable-row"
                />

                <div style={{ marginTop: 16 }}>
                  <Alert
                    message="动作步骤规范"
                    description="请按照真实的机器人操作逻辑进行拆解。通常包含：识别目标 -> 路径规划 -> 到达 -> 执行动作（抓取/放置/按压）-> 确认结果。"
                    type="info"
                    showIcon
                    icon={<BulbOutlined />}
                  />
                </div>
              </Card>
            </Col>

            {/* Right Column: Configs */}
            <Col span={8}>
              <Card title="作业参数配置" variant="borderless" style={{ marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Form.Item label="所属场景标签" name="tag">
                  <Select options={[
                    { value: '服务数据', label: '服务数据' },
                    { value: '工业数据', label: '工业数据' },
                    { value: '零售数据', label: '零售数据' },
                  ]} />
                </Form.Item>

                <Form.Item label="推荐设备型号" name="device">
                  <Select options={[
                    { value: 'galbot_2.2_RGB', label: 'Galbot 2.2 RGB' },
                    { value: 'galbot_2.2_R', label: 'Galbot 2.2 R' },
                    { value: 'standard_humanoid', label: '通用人型 A1' },
                  ]} />
                </Form.Item>

                <Form.Item label="遥操作方式" name="remote">
                  <Select options={[
                    { value: 'Master-slave', label: '主从示教 (Master-slave)' },
                    { value: 'VR(VR)', label: 'VR 视觉遥操 (VR)' },
                    { value: 'Gamepad', label: '手柄遥操 (Gamepad)' },
                  ]} />
                </Form.Item>

                <Form.Item label="采集模式" name="mode">
                  <Select options={[
                    { value: 'WholeBody', label: '全身协同 (WholeBody)' },
                    { value: 'ArmOnly', label: '仅机械臂 (ArmOnly)' },
                  ]} />
                </Form.Item>

                <div style={{ 
                  background: '#fff7e6', 
                  border: '1px solid #ffe58f', 
                  padding: 12, 
                  borderRadius: 8,
                  marginTop: 20
                }}>
                  <div style={{ color: '#d46b08', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ExclamationCircleOutlined /> 温馨提示
                  </div>
                  <Paragraph style={{ color: '#8c8c8c', fontSize: 12, margin: '8px 0 0' }}>
                    模板保存后，在任务建单阶段可快速导入以上配置，确保不同采集员产出的数据格式保持高度一致。
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </motion.div>
    </MainLayout>
  );
}
