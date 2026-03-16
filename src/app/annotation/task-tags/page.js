'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Breadcrumb, Typography, Card, Tag, Button, Input, Space, Modal, List, message } from 'antd';
import { PlusOutlined, TagOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

export default function TaskTagsManagement() {
  const [activeCategory, setActiveCategory] = useState('项目');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [newSubTagName, setNewSubTagName] = useState('');

  // Move category tags into state to reflect sub-tag counts dynamically
  const [categoryTags, setCategoryTags] = useState({
    '项目': [
      { id: 'proj-1', name: 'InternalCommercial(内部-商业)', count: 5 },
      { id: 'proj-2', name: 'ExternalXupaosi(外部-芯跑思)', count: 2 },
      { id: 'proj-3', name: 'InternalIndustrial(内部-工业需求)', count: 1 },
      { id: 'proj-4', name: 'Backflow(回传问题)', count: 1 },
      { id: 'proj-5', name: 'SimulatedCollection(模拟采集)', count: 1 },
    ],
  });

  // State for sub-tags data
  const [subTagsData, setSubTagsData] = useState({
    'InternalCommercial(内部-商业)': [
      '商业-零售', '商业-餐饮', '商业-酒店', '商业-办公', '商业-展厅'
    ],
    'ExternalXupaosi(外部-芯跑思)': [
      '芯跑思-测试A', '芯跑思-测试B'
    ],
    'InternalIndustrial(内部-工业需求)': ['工业-工厂'],
    'Backflow(回传问题)': ['标注错误'],
    'SimulatedCollection(模拟采集)': ['Unity仿真'],
    'default': ['子标签-01', '子标签-02', '子标签-03']
  });

  const categories = [
    '项目', '任务用途', '场景分类', '采集模式', '动作模板', '遥控类型', '执行末端类型', '相机类型', '相机位置类型', '组件类型'
  ];

  const currentTags = categoryTags[activeCategory] || [];

  const handleTagCountClick = (tag) => {
    setSelectedTag(tag);
    setIsDetailModalOpen(true);
  };

  const handleAddSubTag = () => {
    if (!newSubTagName.trim()) {
      message.warning('请输入标签名称');
      return;
    }

    const tagName = selectedTag.name;
    const currentSubTags = subTagsData[tagName] || [];
    
    if (currentSubTags.includes(newSubTagName.trim())) {
      message.error('该子标签已存在');
      return;
    }

    // Update sub-tags data
    setSubTagsData(prev => ({
      ...prev,
      [tagName]: [...currentSubTags, newSubTagName.trim()]
    }));

    // Update parent tag count in categoryTags
    setCategoryTags(prev => {
      const updatedCategories = { ...prev };
      updatedCategories[activeCategory] = updatedCategories[activeCategory].map(tag => {
        if (tag.name === tagName) {
          return { ...tag, count: tag.count + 1 };
        }
        return tag;
      });
      return updatedCategories;
    });

    setNewSubTagName('');
    message.success('子标签添加成功');
  };

  const handleDeleteSubTag = (subTagToDelete) => {
    const tagName = selectedTag.name;
    const currentSubTags = subTagsData[tagName] || [];
    
    setSubTagsData(prev => ({
      ...prev,
      [tagName]: currentSubTags.filter(st => st !== subTagToDelete)
    }));

    setCategoryTags(prev => {
      const updatedCategories = { ...prev };
      updatedCategories[activeCategory] = updatedCategories[activeCategory].map(tag => {
        if (tag.name === tagName) {
          return { ...tag, count: Math.max(0, tag.count - 1) };
        }
        return tag;
      });
      return updatedCategories;
    });
    
    message.info('子标签已删除');
  };

  return (
    <MainLayout>
      <div style={{ padding: '0 24px 24px', background: '#F1F2F5', minHeight: 'calc(100vh - 64px)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ display: 'flex', gap: 20, alignItems: 'stretch', paddingTop: 20 }}
        >
          {/* Sidebar */}
          <div style={{ width: 280, flexShrink: 0 }}>
            <Card 
              bodyStyle={{ padding: 12 }} 
              style={{ borderRadius: 12, border: '1px solid #f1f5f9', background: '#fff', height: '100%' }}
            >
              <div style={{ padding: '4px 16px 12px' }}>
                <Text strong style={{ fontSize: 13, color: '#64748b' }}>标签分类</Text>
              </div>
              {categories.map(cat => (
                <div 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ 
                    padding: '12px 16px',
                    marginBottom: 4,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeCategory === cat ? '#eff6ff' : 'transparent',
                    border: `1px solid ${activeCategory === cat ? '#3b82f6' : 'transparent'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Text strong style={{ color: activeCategory === cat ? '#1d4ed8' : '#1e293b', fontSize: 14 }}>{cat}</Text>
                  <Text type="secondary" style={{ fontSize: 11, opacity: 0.7 }}>TAG CATEGORY: {cat.toUpperCase()}</Text>
                </div>
              ))}
            </Card>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <Card 
              style={{ borderRadius: 12, border: '1px solid #f1f5f9', background: '#fff', height: '100%' }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TagOutlined style={{ color: '#3b82f6' }} />
                  自定义标签
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>{currentTags.length}/500</Text>
                  {/* "Add Tag Group" button removed per user request */}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {currentTags.map((tag, idx) => (
                  <Tag 
                    key={tag.id || idx} 
                    closable 
                    onClose={() => {}}
                    style={{ 
                      height: 36, 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0 4px 0 12px', 
                      borderRadius: 8,
                      background: '#ef4444',
                      borderColor: '#ef4412', // Slightly dark red for border
                      color: '#fff',
                      fontSize: 14,
                      margin: 0,
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
                      cursor: 'default'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{tag.name}</span>
                      <div 
                        onClick={() => handleTagCountClick(tag)}
                        style={{ 
                          background: 'rgba(255,255,255,0.2)', 
                          padding: '0 8px', 
                          borderRadius: 4, 
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      >
                        ({tag.count})
                      </div>
                    </div>
                  </Tag>
                ))}
                
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  style={{ 
                    height: 36, 
                    borderRadius: 8,
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  添加标签
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <InfoCircleOutlined style={{ color: '#3b82f6' }} />
            <span>标签详情: {selectedTag?.name}</span>
          </div>
        }
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>关闭</Button>
        ]}
        width={500}
        centered
        bodyStyle={{ padding: '12px 24px 24px' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            该标签组下包含以下 {subTagsData[selectedTag?.name]?.length || 0} 个子标签：
          </Text>
        </div>

        {/* Inline Addition within Modal */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <Input 
            placeholder="输入新标签" 
            value={newSubTagName}
            onChange={e => setNewSubTagName(e.target.value)}
            onPressEnter={handleAddSubTag}
          />
          <Button type="primary" onClick={handleAddSubTag}>添加</Button>
        </div>

        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          <List
            dataSource={subTagsData[selectedTag?.name] || []}
            renderItem={(item) => (
              <List.Item 
                style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}
                actions={[
                  <Button 
                    type="link" 
                    danger 
                    size="small" 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDeleteSubTag(item)}
                  />
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
                  <Text style={{ fontSize: 14 }}>{item}</Text>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>

      <style jsx global>{`
        .ant-tag .anticon-close {
          color: rgba(255,255,255,0.85) !important;
          margin-left: 8px !important;
        }
        .ant-tag .anticon-close:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
      `}</style>
    </MainLayout>
  );
}
