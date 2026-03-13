'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag, Progress, Popconfirm } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, AuditOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;

export default function AcceptanceManagement() {
  const dataSource = [
    { key: '1', id: 'ACP-2026-03-A', project: '通用家政清理 v1.0', total: 15400, passRate: 99.2, status: 'passed', date: '2026-03-10', client: '内部模型组' },
    { key: '2', id: 'ACP-2026-03-B', project: '工业线缆分拣', total: 5200, passRate: 85.4, status: 'rejected', date: '2026-03-09', client: '外部客户 B' },
    { key: '3', id: 'ACP-2026-03-C', project: '四足步态感知', total: 28000, passRate: 95.8, status: 'pending', date: '2026-03-11', client: '研究中心' },
  ];

  const columns = [
    { title: '验收报告编号', dataIndex: 'id', key: 'id', render: text => <span style={{ fontWeight: 600 }}>{text}</span> },
    { title: '关联合同/项目', dataIndex: 'project', key: 'project', render: text => <span style={{ color: '#0f172a' }}>{text}</span> },
    { title: '交付方/客户', dataIndex: 'client', key: 'client', render: text => <Tag color="default">{text}</Tag> },
    { title: '总验收样本量', dataIndex: 'total', key: 'total' },
    { 
      title: '综合合格率', 
      dataIndex: 'passRate', 
      key: 'passRate',
      render: rate => (
        <Space>
          <Progress percent={rate} size="small" showInfo={false} strokeColor={rate > 95 ? '#10b981' : rate > 90 ? '#f59e0b' : '#ef4444'} style={{ width: 80 }} />
          <span style={{ fontSize: 13, color: rate > 95 ? '#10b981' : '#ef4444' }}>{rate}%</span>
        </Space>
      )
    },
    { title: '发起时间', dataIndex: 'date', key: 'date', render: text => <span style={{ color: '#64748b' }}>{text}</span> },
    { 
      title: '交付状态', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        if (status === 'passed') return <Tag icon={<CheckCircleOutlined />} color="success">验收达标发版</Tag>;
        if (status === 'rejected') return <Tag icon={<CloseCircleOutlined />} color="error">未达标退回</Tag>;
        return <Tag icon={<AuditOutlined />} color="processing">等待资方验收</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" style={{ color: '#3b82f6', padding: 0 }} icon={<CloudDownloadOutlined />}>下载验收报告</Button>
          {record.status === 'pending' && (
            <Popconfirm title="确认甲方已签署验收合格单？" okText="确认结款" cancelText="取消">
              <Button type="text" style={{ color: '#10b981', padding: 0 }}>确认验收</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="v2-global-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <Title level={3} style={{ margin: 0, color: '#0f172a' }}>客户验收与交付</Title>
              <p style={{ color: '#64748b', marginTop: 4 }}>数据标注完成后的最终环节，向模型训练组或外部客户出具质检报告并进行系统级资产交付。</p>
            </div>
            <Space>
               <Input prefix={<SearchOutlined />} placeholder="搜索编号或项目名..." style={{ width: 250, borderRadius: 6 }} size="large" />
            </Space>
          </div>
        <Table rowSelection={{ type: 'checkbox', fixed: 'left' }} scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} />
      </motion.div>
    </MainLayout>
  );
}
