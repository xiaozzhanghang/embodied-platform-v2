'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Input, Typography, Space, Button, Row, Col, Card, Tag } from 'antd';
import { SearchOutlined, UploadOutlined, BuildOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;

export default function SimulationAssets() {
  const assets = [
    { id: 1, name: '宇树 Go2 四足本体配置 (URDF约束)', type: '本体模型', format: '.urdf', size: '1.2 MB', color: '#3b82f6' },
    { id: 2, name: '标准现代厨房 (30平米)', type: '环境场景', format: '.usd', size: '240 MB', color: '#10b981' },
    { id: 3, name: 'Agility Digit 双足', type: '本体模型', format: '.mjcf', size: '3.4 MB', color: '#3b82f6' },
    { id: 4, name: '零售商超货架 (含随机生成器)', type: '环境场景', format: '.isaac', size: '850 MB', color: '#10b981' },
    { id: 5, name: '可形变毛巾 (10x10 网格)', type: '物理材质', format: '.obj', size: '0.4 MB', color: '#f59e0b' },
    { id: 6, name: '机械臂 2指/3指 末端执行器', type: '执行器', format: '.urdf', size: '1.8 MB', color: '#8b5cf6' },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a' }}>数字孪生仿真资产库</Title>
              <p style={{ color: '#64748b', marginTop: 4 }}>统管用于 Isaac Sim、Mujoco 等引擎的 URDF 模型、场景资产及物理参数配置文件。</p>
            </div>
            <Space size="middle">
             <Input prefix={<SearchOutlined />} placeholder="搜索模型资产..." style={{ width: 250 }} size="large" />
             <Button type="primary" size="large" icon={<UploadOutlined />}>导入新资产</Button>
           </Space>
          </div>

          <Row gutter={[24, 24]}>
            {assets.map(asset => (
              <Col span={8} key={asset.id}>
                <Card 
                  variant="borderless" 
                  hoverable 
                  style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}
                  styles={{ body: { padding: 0 } }}
                >
                  <div style={{ height: 160, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <BuildOutlined style={{ fontSize: 64, color: '#cbd5e1' }} />
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                       <Tag color={asset.color} style={{ margin: 0, borderRadius: 12, padding: '2px 8px', border: 'none' }}>{asset.type}</Tag>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <Title level={5} style={{ margin: '0 0 12px 0', fontSize: 16 }}>{asset.name}</Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Tag color="default" style={{ background: '#f1f5f9', border: 'none', color: '#64748b' }}>{asset.format}</Tag>
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{asset.size}</span>
                      </Space>
                      <Button type="text" icon={<SettingOutlined />} style={{ color: '#94a3b8' }} />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </motion.div>
    </MainLayout>
  );
}
