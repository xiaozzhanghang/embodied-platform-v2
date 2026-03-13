'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Typography, Tag, Card, Row, Col, Empty, Form, Select, Input } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, FieldTimeOutlined, SmileOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { DownOutlined, UpOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AnnotationAnswer() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([
    { key: '1', id: 'T-8821', project: '桌面物品 3D 包围盒标注', amount: '50 帧 (点云)', deadline: '今天 18:00', price: '￥2.50/帧' },
    { key: '2', id: 'T-8824', project: '关节力矩与动作状态对齐', amount: '12 段视频流', deadline: '明天 12:00', price: '￥15.00/段' },
  ]);

  const columns = [
    { title: '待答题包 ID', dataIndex: 'id', key: 'id', render: text => <Tag color="cyan">{text}</Tag> },
    { title: '所属项目', dataIndex: 'project', key: 'project', render: text => <span style={{ fontWeight: 600 }}>{text}</span> },
    { title: '工作量', dataIndex: 'amount', key: 'amount' },
    { title: '单价补贴', dataIndex: 'price', key: 'price', render: text => <span style={{ color: '#f59e0b', fontWeight: 600 }}>{text}</span> },
    { title: '提交期限', dataIndex: 'deadline', key: 'deadline', render: text => <span style={{ color: '#ef4444' }}><FieldTimeOutlined style={{ marginRight: 4 }}/>{text}</span> },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Button type="primary" icon={<PlayCircleOutlined />}>开始领题标注</Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>我的答题台 (Workspace)</Title>
            <p style={{ color: '#64748b', marginTop: 4 }}>您领取或被分配的待标注任务包列表。</p>
          </div>

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Card style={{ borderRadius: 12, border: 'none' }} styles={{ body: { padding: 20 } }}>
                <div style={{ color: '#64748b', fontSize: 13 }}>今日已完成 (帧/段)</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>142</div>
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ borderRadius: 12, border: 'none' }} styles={{ body: { padding: 20 } }}>
                <div style={{ color: '#64748b', fontSize: 13 }}>历史准确率 (Accuracy)</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a' }}>98.2%</div>
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ borderRadius: 12, border: 'none' }} styles={{ body: { padding: 20 } }}>
                <div style={{ color: '#64748b', fontSize: 13 }}>本月预计收益</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>￥ 4,250</div>
              </Card>
            </Col>
          </Row>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>待办题包 ({dataSource.length})</div>
          {dataSource.length > 0 && <Button type="default" danger icon={<DeleteOutlined />} onClick={() => setDataSource([])}>模拟清空队列</Button>}
        </div>

        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px 4px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="id" label="题包 ID" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入题包 ID" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="project" label="所属项目" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择所属项目" />
                </Form.Item>
              </Col>
              
              <Col span={8} style={{ textAlign: 'right', marginBottom: 16 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>检索</Button>
                  <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
        
        {dataSource.length > 0 ? (
           <Table rowSelection={{ type: 'checkbox', fixed: 'left' }} scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} />
        ) : (
           <div style={{ padding: '80px 0', background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1', textAlign: 'center', marginTop: 24 }}>
             <Empty 
               image={<SmileOutlined style={{ fontSize: 48, color: '#94a3b8' }} />}
               imageStyle={{ height: 60, marginBottom: 16 }}
               description={
                 <div>
                   <div style={{ color: '#0f172a', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>队列已清空，干得漂亮！</div>
                   <div style={{ color: '#64748b', fontSize: 14 }}>您当前没有任何待标注的任务。去广场看看有没有高收益的新项目吧。</div>
                 </div>
               }
             >
               <Button type="primary" size="large" style={{ marginTop: 16 }}>
                 前往任务广场
               </Button>
             </Empty>
           </div>
        )}
      </motion.div>
    </MainLayout>
  );
}
