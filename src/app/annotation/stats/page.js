'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, Row, Col, Typography, Select, List, Avatar } from 'antd';
import { Area, Column } from '@ant-design/plots';
import { TrophyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;
const { Option } = Select;

export default function ProjectStats() {
  const trendData = [
    { date: '03-01', value: 1200 }, { date: '03-02', value: 1500 }, { date: '03-03', value: 2400 },
    { date: '03-04', value: 1900 }, { date: '03-05', value: 3100 }, { date: '03-06', value: 2800 },
    { date: '03-07', value: 4200 }, { date: '03-08', value: 4500 }, { date: '03-09', value: 3800 },
    { date: '03-10', value: 5100 },
  ];

  const accuracyData = [
    { type: '团队 A', value: 98.2 }, { type: '外包 B', value: 92.5 }, 
    { type: '实习生组', value: 87.4 }, { type: '专家审核', value: 99.8 }
  ];

  const areaConfig = {
    data: trendData, xField: 'date', yField: 'value',
    color: '#3b82f6',
    areaStyle: () => { return { fill: 'l(270) 0:#ffffff 0.5:#bae6fd 1:#3b82f6' }; },
    smooth: true,
  };

  const columnConfig = {
    data: accuracyData, xField: 'type', yField: 'value',
    color: '#10b981',
    label: { position: 'middle', style: { fill: '#FFFFFF', opacity: 0.6 } },
  };

  const ranking = [
    { name: 'Alice Smith', score: 14500, accuracy: '99.1%' },
    { name: '张三', score: 12400, accuracy: '98.5%' },
    { name: 'Zoe Wang', score: 9800, accuracy: '95.2%' },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a' }}>全局标注质效仪表盘</Title>
            </div>
            <Select defaultValue="7days" style={{ width: 150 }} size="large">
              <Option value="7days">最近 7 天</Option>
              <Option value="30days">最近 30 天</Option>
            </Select>
          </div>

          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col span={16}>
              <Card title="每日产能交付趋势 (帧/条)" variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} styles={{ body: { height: 320 } }}>
                <Area {...areaConfig} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title={<span><TrophyOutlined style={{ color: '#f59e0b', marginRight: 8 }}/>工匠排行榜</span>} variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} styles={{ body: { padding: '0 24px 24px' } }}>
                <List
                  itemLayout="horizontal"
                  dataSource={ranking}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : '#cd7f32' }}>{index + 1}</Avatar>}
                        title={<span style={{ fontWeight: 600 }}>{item.name}</span>}
                        description={`准确率: ${item.accuracy}`}
                      />
                      <div style={{ fontWeight: 700, color: '#3b82f6' }}>{item.score}</div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
               <Card title="各团队综合准确率对比" variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} styles={{ body: { height: 300 } }}>
                 <Column {...columnConfig} />
               </Card>
            </Col>
          </Row>
      </motion.div>
    </MainLayout>
  );
}
