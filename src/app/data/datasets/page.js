'use client';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import { motion } from 'framer-motion';
import { Card, Input, Button, Tree, Form, Select, Row, Col, Divider } from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  DownloadOutlined, 
  CameraOutlined, 
  DatabaseOutlined, 
  ShopOutlined, 
  AppstoreOutlined, 
  ContainerOutlined 
} from '@ant-design/icons';

const treeData = [
  {
    title: '办公',
    key: 'office',
    children: [
      {
        title: '台面',
        key: 'desktop',
        children: [
          { title: '分拣电子产品', key: 'sort-electronics' },
          { title: '桌面书籍整理', key: 'tidy-books' },
        ],
      },
    ],
  },
  {
    title: '工厂',
    key: 'factory',
  },
  {
    title: '家政',
    key: 'home',
  },
];

const mockCards = [
  { id: '3cb61ad840264e2e898ab4df089dc655', title: '分拣电子产品', tags: ['机房', '工厂', '物料管理'], size: '208.43 MB', date: '2025-11-03' },
  { id: '3cd31eac8f6c44b89ee3b57db6db1a8b', title: '分拣电子产品', tags: ['机房', '工厂', '物料管理'], size: '228.59 MB', date: '2025-10-29' },
  { id: '3cec5e96dcc0434ccfa8c7198b895db3', title: '分拣电子产品', tags: ['机房', '工厂', '物料管理'], size: '232.23 MB', date: '2025-10-29' },
  { id: '3cf7b5e7861944b2b46a66a50b8cd8dc', title: '分拣电子产品', tags: ['机房', '工厂', '物料管理'], size: '185.12 MB', date: '2025-10-28' },
  { id: '3d31773da3614d4eb09b87bc857102f2', title: '分拣电子产品', tags: ['机房', '工厂', '物料管理'], size: '190.54 MB', date: '2025-10-27' },
  { id: '3d6b2954742545a6a1cbb42716a3a5a2', title: '分拣电子产品', tags: ['机房', '工厂', '物料管理'], size: '198.22 MB', date: '2025-10-25' },
];

export default function DataSetManagement() {
  return (
    <MainLayout>
      <div style={{ display: 'flex', gap: '20px', padding: '24px', minHeight: 'calc(100vh - 56px)' }}>
        
        {/* Left Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          style={{ width: '260px', flexShrink: 0, background: '#fff', borderRadius: '12px', padding: '20px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', height: 'fit-content' }}
        >
          <Input 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
            placeholder="搜索场景/子场景..." 
            style={{ marginBottom: '16px', borderRadius: '6px' }} 
          />
          <Tree
            defaultExpandAll
            treeData={treeData}
            blockNode
            style={{ fontSize: '14px' }}
          />
        </motion.div>

        {/* Right Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Filter Card */}
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }} bodyStyle={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '20px' }}>筛选条件</div>
            <Form layout="vertical" style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: 0 }}>
              <Form.Item label={<span style={{ color: '#4b5563', fontSize: '13px' }}>任务名称/ID</span>} style={{ margin: 0, flex: 1 }}>
                <Input placeholder="请输入任务编号ID或者任务名称" size="large" style={{ borderRadius: '6px', fontSize: '14px' }} />
              </Form.Item>
              <Form.Item label={<span style={{ color: '#4b5563', fontSize: '13px' }}>厂商</span>} style={{ margin: 0, flex: 1 }}>
                <Select placeholder="请选择" size="large" style={{ width: '100%', borderRadius: '6px', fontSize: '14px' }} />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button type="primary" size="large" style={{ borderRadius: '6px', width: '80px', background: '#1677ff', fontSize: '14px' }}>筛选</Button>
                  <Button size="large" style={{ borderRadius: '6px', width: '80px', fontSize: '14px' }}>重置</Button>
                </div>
              </Form.Item>
            </Form>
          </Card>

          {/* List Card */}
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', flex: 1 }} bodyStyle={{ padding: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: '0 0 24px 0' }}>数据资产列表</div>
            
            <Row gutter={[20, 24]}>
              {mockCards.map((card, idx) => (
                <Col xl={8} lg={12} md={24} key={idx}>
                  <Card 
                    hoverable
                    bodyStyle={{ padding: '16px 20px 20px' }}
                    style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e8e8', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                    cover={
                      <div style={{ position: 'relative', height: '170px', background: 'linear-gradient(180deg, #334155, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>[ Robot Arm Action Frame ]</span>
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.5)', color: '#f8fafc', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                          {card.id}
                        </div>
                      </div>
                    }
                  >
                    <div style={{ fontWeight: 600, fontSize: '16px', color: '#0f172a', marginBottom: '14px' }}>
                      {card.title}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#e6f4ff', color: '#1677ff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        <ShopOutlined /> {card.tags[0]}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8f9fa', color: '#64748b', border: '1px solid #e2e8f0', padding: '1px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        <ContainerOutlined /> {card.tags[1]}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8f9fa', color: '#64748b', border: '1px solid #e2e8f0', padding: '1px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        <AppstoreOutlined /> {card.tags[2]}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CameraOutlined style={{ fontSize: '14px', color: '#94a3b8' }} /> RGB</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><DatabaseOutlined style={{ fontSize: '14px', color: '#94a3b8' }} /> {card.size}</span>
                      <span>{card.date}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Button type="primary" icon={<EyeOutlined />} style={{ flex: 1, height: '36px', borderRadius: '6px', background: '#1677ff', fontSize: '13px' }}>查看详情</Button>
                      <Button icon={<DownloadOutlined />} style={{ flex: 1, height: '36px', borderRadius: '6px', fontSize: '13px', color: '#334155' }}>下载</Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

          </Card>
        </motion.div>

      </div>
    </MainLayout>
  );
}
