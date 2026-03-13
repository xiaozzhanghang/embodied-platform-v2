'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Breadcrumb, Typography, Card, Tag, Button, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

export default function TaskTagsManagement() {
  const [activeCategory, setActiveCategory] = useState('项目');

  const categories = [
    '项目', '任务用途', '场景分类', '采集模式', '动作模板', '遥控类型', '执行末端类型', '相机类型', '相机位置类型', '组件类型'
  ];

  const categoryTags = {
    '项目': [
      { name: 'InternalCommercial(内部-商业)', count: 5 },
      { name: 'ExternalXupaosi(外部-芯跑思)', count: 2 },
      { name: 'InternalIndustrial(内部-工业需求)', count: 1 },
      { name: 'Backflow(回传问题)', count: 1 },
      { name: 'SimulatedCollection(模拟采集)', count: 1 },
    ],
    // Add other categories data here as needed or keep simple for prototype
  };

  const tags = categoryTags[activeCategory] || [];

  return (
    <MainLayout>
      <div style={{ padding: '0 24px 24px', background: '#F1F2F5', minHeight: 'calc(100vh - 64px)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}
        >
          {/* Sidebar */}
          <div style={{ width: 280, flexShrink: 0 }}>
            <Card 
              bodyStyle={{ padding: 12 }} 
              style={{ borderRadius: 12, border: '1px solid #f1f5f9', background: '#fff' }}
            >
              {categories.map(cat => (
                <div 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ 
                    padding: '12px 16px',
                    marginBottom: 8,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeCategory === cat ? '#eff6ff' : 'transparent',
                    border: `1px solid ${activeCategory === cat ? '#3b82f6' : '#f1f5f9'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}
                >
                  <Text strong style={{ color: activeCategory === cat ? '#1d4ed8' : '#1e293b', fontSize: 14 }}>{cat}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{cat}</Text>
                </div>
              ))}
            </Card>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <Card 
              style={{ borderRadius: 12, border: '1px solid #f1f5f9', background: '#fff', minHeight: 600 }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={5} style={{ margin: 0 }}>自定义标签</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>{tags.length}/500</Text>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {tags.map((tag, idx) => (
                  <Tag 
                    key={idx} 
                    closable 
                    onClose={() => {}}
                    style={{ 
                      height: 32, 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0 12px', 
                      borderRadius: 6,
                      background: '#ef4444',
                      borderColor: '#ef4444',
                      color: '#fff',
                      fontSize: 13,
                      margin: 0
                    }}
                  >
                    {tag.name} ({tag.count})
                  </Tag>
                ))}
                
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  style={{ 
                    height: 32, 
                    borderRadius: 6,
                    color: '#64748b'
                  }}
                >
                  添加标签
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .ant-tag .anticon-close {
          color: rgba(255,255,255,0.85) !important;
        }
        .ant-tag .anticon-close:hover {
          color: #fff !important;
        }
      `}</style>
    </MainLayout>
  );
}
