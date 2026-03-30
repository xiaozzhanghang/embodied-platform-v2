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
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  DownloadOutlined,
  FileTextOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

// Mock data
const mockDeviceData = {
  '1': { 
    key: '1', name: 'R001GBDDAAAE0810', enName: 'R001GBDDAAA...', 
    deviceId: 'DEV-B-100', deviceType: 'galbot_2.2_RGB',
    remark: '一号采集车搭载设备，用于日常数据采集任务。',
    urdf: 'galbot_v2.urdf', regDate: '2026-02-25 16:13:55', 
    activeDate: '2026-03-20 09:22:10', status: 'enabled',
    creator: '张晓章',
    updatedAt: '2026-03-15',
  },
  '2': { 
    key: '2', name: 'R001GBDDAAAE0811', enName: 'R001GBDDAAB...', 
    deviceId: 'DEV-B-101', deviceType: 'galbot_2.2_深度',
    remark: '二号设备，深度视觉采集专用。',
    urdf: 'galbot_v2_depth.urdf', regDate: '2026-02-25 16:13:55', 
    activeDate: '2026-03-18 14:05:30', status: 'enabled',
    creator: '李明',
    updatedAt: '2026-03-10',
  },
  '3': { 
    key: '3', name: 'R001GBDDAAAE0812', enName: 'R001GBDDAAC...', 
    deviceId: 'DEV-B-102', deviceType: 'galbot_2.2_红外',
    remark: '',
    urdf: '', regDate: '2026-02-25 16:13:55', 
    activeDate: '2026-02-28 10:00:00', status: 'disabled',
    creator: '王磊',
    updatedAt: '2026-02-28',
  },
};

export default function DeviceInstanceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const device = mockDeviceData[id] || mockDeviceData['1'];

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
              onClick={() => router.push('/collection/device-list')}
              style={{ color: '#64748b' }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              设备列表 / <Text style={{ color: '#1e293b', fontSize: 13 }}>设备详情</Text>
            </Text>
          </Space>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>{device.name}</Title>
            <Space size={12}>
              <Text type="secondary" style={{ fontSize: 13 }}>设备编号: {device.deviceId}</Text>
              <Divider type="vertical" />
              <Text type="secondary" style={{ fontSize: 13 }}>设备类型: {device.deviceType}</Text>
              <Divider type="vertical" />
              <span className={`status-badge ${device.status === 'enabled' ? 'status-success' : 'status-default'}`}>
                {device.status === 'enabled' ? '启用' : '禁用'}
              </span>
            </Space>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        {/* Section 1: Basic Info */}
        <Card 
          title="基本信息"
          variant="borderless"
          className="card"
          style={{ marginBottom: 20 }}
        >
          <Row gutter={20}>
            <Col span={8}>
              <FieldItem label="设备名称" value={device.name} />
            </Col>
            <Col span={8}>
              <FieldItem label="英文名称" value={device.enName} />
            </Col>
            <Col span={8}>
              <FieldItem label="设备编号" value={device.deviceId} />
            </Col>
          </Row>
          <div style={{ height: 20 }} />
          <Row gutter={20}>
            <Col span={8}>
              <FieldItem label="设备类型" value={device.deviceType} />
            </Col>
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
          </Row>
          <div style={{ height: 20 }} />
          <Row gutter={20}>
            <Col span={8}>
              <FieldItem label="注册时间" value={device.regDate} />
            </Col>
            <Col span={8}>
              <FieldItem label="最近活跃" value={device.activeDate} />
            </Col>
          </Row>
          {device.remark && (
            <>
              <div style={{ height: 20 }} />
              <Row gutter={20}>
                <Col span={24}>
                  <FieldItem label="备注">
                    <Paragraph style={{ 
                      color: '#334155', fontSize: 13, lineHeight: 1.8, margin: 0, 
                      padding: '12px 16px', background: '#f8fafc', borderRadius: 8, 
                      border: '1px solid #f1f5f9' 
                    }}>
                      {device.remark}
                    </Paragraph>
                  </FieldItem>
                </Col>
              </Row>
            </>
          )}
        </Card>

        {/* Section 2: Files & Images */}
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
                  <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>暂无 URDF 文件</Text>
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
