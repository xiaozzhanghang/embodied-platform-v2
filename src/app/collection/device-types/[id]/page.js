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
  Tag, 
  Divider, 
  Table,
  Image
} from 'antd';
import { 
  ArrowLeftOutlined, 

  DownloadOutlined,
  FileTextOutlined,
  PictureOutlined,
  AppstoreOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';

import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

// Mock data matching the list page
const mockDeviceData = {
  '1': { 
    key: '1', name: 'galbot_2.2_RGB', enName: 'galbot_2.2', version: 'V2.2', 
    desc: '预置 galbot V2.2 机器人配套 RGB 相机模块，支持高清图像采集与实时传输，适用于视觉引导抓取、目标检测等场景。', 
    urdf: 'galbot_v2.urdf', regDate: '2025-12-20', status: 'enabled',
    parts: [
      { key: 'p1', align: '头部', name: '头部左相机', type: 'Body-HeadLeftCamera(本体-头部左侧相机)', brand: 'Intel RealSense' },
      { key: 'p2', align: '头部', name: '头部右相机', type: 'Body-HeadRightCamera(本体-头部右侧相机)', brand: 'Intel RealSense' },
      { key: 'p3', align: '左臂', name: '灵巧手_左', type: 'EndEffector-DexHand(末端-灵巧手)', brand: 'Custom' },
      { key: 'p4', align: '右臂', name: '灵巧手_右', type: 'EndEffector-DexHand(末端-灵巧手)', brand: 'Custom' },
    ],
    creator: '张晓章',
    updatedAt: '2026-01-15',
  },
  '2': { 
    key: '2', name: 'galbot_2.2_深度', enName: 'galbot_2.2.1', version: 'V2.2.1', 
    desc: '预置 galbot V2.2 机器人配套深度相机模块，支持点云生成与3D场景重建。', 
    urdf: 'galbot_v2_depth.urdf', regDate: '2025-12-19', status: 'enabled',
    parts: [
      { key: 'p1', align: '头部', name: '深度相机_主', type: 'Body-DepthCamera(本体-深度相机)', brand: 'Intel RealSense D435' },
    ],
    creator: '李明',
    updatedAt: '2026-01-10',
  },
  '3': { 
    key: '3', name: 'galbot_2.2_红外', enName: 'galbot_2.2_IR', version: 'V2.2', 
    desc: '预置 galbot V2.2 机器人配套红外传感器模块，适用于夜间或低光照条件下的目标检测与避障。', 
    urdf: 'galbot_v2_ir.urdf', regDate: '2025-12-19', status: 'disabled',
    parts: [
      { key: 'p1', align: '头部', name: '红外传感器', type: 'Body-IRSensor(本体-红外传感器)', brand: 'FLIR' },
    ],
    creator: '王磊',
    updatedAt: '2025-12-28',
  },
};

export default function DeviceTypeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const device = mockDeviceData[id] || mockDeviceData['1'];

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
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 160 },
  ];

  // Helper for displaying a field
  const FieldItem = ({ label, value, children }) => (
    <div style={{ marginBottom: 0 }}>
      <Text style={{ color: '#64748b', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>{label}</Text>
      {children || <Text style={{ fontSize: 13, color: '#1e293b' }}>{value || '-'}</Text>}
    </div>
  );

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 12 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={() => router.push('/collection/device-types')}
              style={{ color: '#64748b' }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              设备类型管理 / <Text style={{ color: '#1e293b', fontSize: 13 }}>设备详情</Text>
            </Text>
          </Space>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>{device.name}</Title>
            <Space size={12}>
              <Text type="secondary" style={{ fontSize: 13 }}>英文标识: {device.enName}</Text>
              <Divider type="vertical" />
              <Text type="secondary" style={{ fontSize: 13 }}>版本: {device.version}</Text>
              <Divider type="vertical" />
              <span className={`status-badge ${device.status === 'enabled' ? 'status-success' : 'status-default'}`}>
                {device.status === 'enabled' ? '启用' : '禁用'}
              </span>
            </Space>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        {/* Section 1: Basic Info - Layout matching create/edit pages */}
        <Card 
          title="基本信息"
          variant="borderless"
          className="card"
          style={{ marginBottom: 20 }}
        >
          <Row gutter={20}>
            <Col span={8}>
              <FieldItem label="机器人名称" value={device.name} />
            </Col>
            <Col span={8}>
              <FieldItem label="英文名称" value={device.enName} />
            </Col>
            <Col span={8}>
              <FieldItem label="机器人版本" value={device.version} />
            </Col>
          </Row>
          <div style={{ height: 20 }} />
          <Row gutter={20}>
            <Col span={8}>
              <FieldItem label="状态">
                <span className={`status-badge ${device.status === 'enabled' ? 'status-success' : 'status-default'}`}>
                  {device.status === 'enabled' ? '启用' : '禁用'}
                </span>
              </FieldItem>
            </Col>
            <Col span={8}>
              <FieldItem label="创建人" value={device.creator} />
            </Col>
            <Col span={8}>
              <FieldItem label="注册时间" value={device.regDate} />
            </Col>
          </Row>
          <div style={{ height: 20 }} />
          <Row gutter={20}>
            <Col span={24}>
              <FieldItem label="传感器描述">
                <Paragraph style={{ 
                  color: '#334155', fontSize: 13, lineHeight: 1.8, margin: 0, 
                  padding: '12px 16px', background: '#f8fafc', borderRadius: 8, 
                  border: '1px solid #f1f5f9' 
                }}>
                  {device.desc}
                </Paragraph>
              </FieldItem>
            </Col>
          </Row>
        </Card>

        {/* Section 2: Parts Table */}
        <Card 
          title={
            <Space>
              <span style={{ fontWeight: 600 }}>已绑定部件</span>
              <Tag style={{ borderRadius: 10, fontSize: 11, background: '#eff6ff', color: '#3b82f6', border: 'none' }}>
                {device.parts?.length || 0} 个
              </Tag>
            </Space>
          }
          variant="borderless"
          className="card"
          style={{ marginBottom: 20 }}
        >
          <Table
            dataSource={device.parts || []}
            columns={partColumns}
            pagination={false}
            size="small"
            style={{ borderRadius: 8, overflow: 'hidden' }}
            rowClassName={(_, index) => index % 2 === 0 ? '' : 'alt-row'}
          />
        </Card>

        {/* Section 3: Files & Images */}
        <Card 
          title="文件与图片"
          variant="borderless"
          className="card"
          style={{ marginBottom: 20 }}
        >
          <Row gutter={32}>
            <Col span={12}>
              <FieldItem label="URDF 文件">
                {device.urdf ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '14px 16px', 
                    background: '#f8fafc', 
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    marginTop: 4,
                  }}>
                    <Space>
                      <div style={{ 
                        width: 36, height: 36, borderRadius: 8, 
                        background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                        <FileTextOutlined style={{ color: '#3b82f6', fontSize: 16 }} />
                      </div>
                      <div>
                        <Text style={{ fontSize: 13, fontWeight: 500, display: 'block' }}>{device.urdf}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>URDF 模型描述文件</Text>
                      </div>
                    </Space>
                    <Button type="text" icon={<DownloadOutlined />} style={{ color: '#3b82f6' }}>下载</Button>
                  </div>
                ) : (
                  <Text type="secondary" style={{ fontSize: 13 }}>暂无 URDF 文件</Text>
                )}
              </FieldItem>
            </Col>
            <Col span={12}>
              <FieldItem label="设备图片">
                <div style={{ 
                  height: 160, 
                  background: '#f8fafc', 
                  borderRadius: 8, 
                  border: '1px dashed #cbd5e1',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 8,
                  marginTop: 4,
                }}>
                  <PictureOutlined style={{ fontSize: 32, color: '#94a3b8' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>暂无设备图片</Text>
                </div>
              </FieldItem>
            </Col>
          </Row>
        </Card>

        {/* Meta Info */}
        <Card 
          variant="borderless"
          className="card"
          styles={{ body: { padding: '16px 24px' } }}
        >
          <Row gutter={20}>
            <Col span={8}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>创建人</Text>
                <Text style={{ fontSize: 12 }}>{device.creator}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>注册时间</Text>
                <Text style={{ fontSize: 12 }}>{device.regDate}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>最后更新</Text>
                <Text style={{ fontSize: 12 }}>{device.updatedAt}</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </MainLayout>
  );
}
