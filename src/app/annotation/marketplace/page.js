'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, Button, Space, Input, Typography, Tag, Row, Col, Avatar } from 'antd';
import { SearchOutlined, DollarOutlined, UploadOutlined, FilterOutlined, TeamOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

export default function Marketplace() {
  const tasks = [
    { id: 1, title: '桌面物品 3D 包围盒精细标注', type: '3D 点云', tags: ['众包开放', '技能要求: 高'], price: '￥2.50 / 帧', pool: '20,000 帧', deadline: '7 天', company: 'GalaxyBot 官方' },
    { id: 2, title: '家庭场景 RGB-D 语义分割', type: '2D 语义', tags: ['官方指派', '紧急'], price: '￥0.80 / 帧', pool: '150,000 帧', deadline: '3 天', company: '外部需求客户' },
    { id: 3, title: '机器人抓取失败反馈归因', type: '文本分类', tags: ['新手友好', '无需资质'], price: '￥0.15 / 条', pool: '5,000 条', deadline: '持久', company: '模型预训练组' },
    { id: 4, title: '机械臂轨迹贝塞尔曲线拟合调节', type: '路径校准', tags: ['专家级', '需审核'], price: '￥15.00 / 段', pool: '800 段', deadline: '14 天', company: '强化学习中心' },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>数据标注任务广场</Title>
              <p style={{ color: '#64748b', marginTop: 4 }}>发现并申领符合您资质的高收益数据标注及审核任务包。</p>
            </div>
            <Space>
               <Input prefix={<SearchOutlined />} placeholder="搜索题包关键字..." style={{ width: 300 }} size="large" />
            </Space>
          </div>

          <Row gutter={[24, 24]}>
            {tasks.map(task => (
              <Col span={12} key={task.id}>
                <Card 
                  bordered={false} 
                  hoverable 
                  style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                  styles={{ body: { padding: 24 } }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <Title level={4} style={{ margin: '0 0 8px 0', fontSize: 18 }}>{task.title}</Title>
                      <Space>
                        <Tag color="blue">{task.type}</Tag>
                        {task.tags.map(t => <Tag key={t} color={t.includes('高') || t.includes('专家') ? 'purple' : t.includes('急') ? 'red' : 'default'} style={{ border: 'none' }}>{t}</Tag>)}
                      </Space>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <DollarOutlined /> {task.price}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>剩余池: {task.pool}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '12px 16px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', gap: 16, color: '#475569', fontSize: 13 }}>
                       <span><FilterOutlined style={{ marginRight: 6 }}/>发布方: {task.company}</span>
                       <span><TeamOutlined style={{ marginRight: 6 }}/>要求期限: {task.deadline}</span>
                    </div>
                    <Button type="primary">立即申请</Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
      </motion.div>
    </MainLayout>
  );
}
