'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Typography, Tag, Progress } from 'antd';
import { DownloadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;

export default function DownloadCenter() {
  const dataSource = [
    { key: '1', task: '家用大模型_厨房场景数据集_v1.tar.gz', type: '已完结项目集', size: '142.5 GB', progress: 100, status: 'ready', exp: '7 天后过期' },
    { key: '2', task: 'Go2_行走盲区报表_20260310.xlsx', type: '系统报表', size: '12 MB', progress: 100, status: 'ready', exp: '永久' },
    { key: '3', task: '四足地形泛化数据包打包中...', type: '批量打包', size: '计算中...', progress: 45, status: 'zipping', exp: '--' },
  ];

  const columns = [
    { title: '导出记录 / 文件名', dataIndex: 'task', key: 'task', render: text => <span style={{ fontWeight: 600 }}>{text}</span> },
    { title: '业务类型', dataIndex: 'type', key: 'type', render: text => <Tag color="blue">{text}</Tag> },
    { title: '体积大小', dataIndex: 'size', key: 'size' },
    { 
      title: '服务器处理进度', 
      dataIndex: 'progress', 
      key: 'progress',
      render: (p, record) => (
        record.status === 'ready' 
          ? <Tag color="success">已就绪</Tag> 
          : <Progress percent={p} size="small" />
      )
    },
    { title: '下载时效', dataIndex: 'exp', key: 'exp', render: text => <span style={{ color: '#64748b' }}>{text}</span> },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'ready' ? (
             <Button type="primary" icon={<DownloadOutlined />} style={{ borderRadius: 6 }}>本地下载</Button>
          ) : (
             <Button type="text" danger icon={<CloseCircleOutlined />}>取消任务</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#0f172a' }}>下载与汇出中心</Title>
            <p style={{ color: '#64748b', marginTop: 4 }}>统管系统中大尺寸数据集导出、模型文件下载等异步阻塞型任务。</p>
          </div>
        <Table rowSelection={{ type: 'checkbox', fixed: 'left' }} scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} />
      </motion.div>
    </MainLayout>
  );
}
