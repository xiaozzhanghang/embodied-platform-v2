'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Breadcrumb, Card, Table, Tag, Button, Space, Typography, Badge } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function PackageDetailQA() {
  const { id } = useParams();
  const router = useRouter();

  // Mock records within the package
  const records = [
    { id: 'REC-001', time: '2026-03-01 10:23:01', duration: '12s', status: 'pending', type: 'RGB+Depth' },
    { id: 'REC-002', time: '2026-03-01 10:23:15', duration: '15s', status: 'pass', type: 'RGB+Depth' },
    { id: 'REC-003', time: '2026-03-01 10:23:32', duration: '10s', status: 'pass', type: 'RGB+Depth' },
    { id: 'REC-004', time: '2026-03-01 10:23:45', duration: '18s', status: 'reject', type: 'RGB+Depth', reason: '光照不足' },
    { id: 'REC-005', time: '2026-03-01 10:24:05', duration: '14s', status: 'pending', type: 'RGB+Depth' },
  ];

  const columns = [
    { title: '记录ID', dataIndex: 'id', key: 'id', render: text => <Text code>{text}</Text> },
    { title: '采集时间', dataIndex: 'time', key: 'time' },
    { title: '时长', dataIndex: 'duration', key: 'duration' },
    { title: '数据类型', dataIndex: 'type', key: 'type' },
    { 
      title: '质检状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const map = {
          pending: <Badge status="processing" text="待质检" />,
          pass: <Badge status="success" text="通过" />,
          reject: <Badge status="error" text="驳回" />,
        };
        return map[status];
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => router.push(`/collection/qa/${id}/${record.id}`)}
        >
          质检审核
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ padding: 24 }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item><Link href="/collection/qa">数据质检</Link></Breadcrumb.Item>
          <Breadcrumb.Item>包详情 ({id})</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size="middle">
            <Link href="/collection/qa">
              <Button icon={<ArrowLeftOutlined />} />
            </Link>
            <Title level={4} style={{ margin: 0 }}>分包质检详情: {id}</Title>
            <Tag color="purple">已暂停 (断点提交)</Tag>
          </Space>
          <Space>
            <Button type="primary" ghost icon={<CheckCircleOutlined />}>全部通过</Button>
          </Space>
        </div>

        <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Table 
            columns={columns} 
            dataSource={records} 
            rowKey="id" 
            pagination={false}
          />
        </Card>
      </motion.div>
    </MainLayout>
  );
}
