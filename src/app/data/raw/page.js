'use client';
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Table, Button, Space, Input, Typography, Tag, Select, DatePicker, Form, Row, Col, Card } from 'antd';
import { motion } from 'framer-motion';
import { 
  SearchOutlined, 
  DownloadOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  DownOutlined,
  UpOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function RawDataManagement() {
  const [expand, setExpand] = React.useState(false);
  const [form] = Form.useForm();
  const dataSource = [
    { key: '1', bag: 'go2_kitchen_001.mcap', robot: '宇树 Go2', size: '14.2 GB', type: '多模态流', date: '2026-03-10 14:22:00', status: 'parsed' },
    { key: '2', bag: 'digit_warehouse_04.mcap', robot: 'Agility Digit', size: '38.5 GB', type: '纯视觉+力控', date: '2026-03-09 09:15:00', status: 'unparsed' },
    { key: '3', bag: 'b1_outdoor_terrain.bag', robot: 'Unitree B1', size: '21.0 GB', type: 'ROS 遗留包', date: '2026-03-08 16:40:00', status: 'parsing' },
    { key: '4', bag: 'arm_assembly_22.mcap', robot: 'UR5e 机械臂', size: '4.8 GB', type: '定点动作流', date: '2026-03-08 11:20:00', status: 'parsed' },
  ];

  const columns = [
    { 
      title: '原始数据文件 (Mcap / Bag)', 
      dataIndex: 'bag', 
      key: 'bag', 
      render: text => (
        <Space>
           <DatabaseOutlined style={{ color: '#94a3b8' }} />
           <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        </Space>
      ) 
    },
    { title: '采集设备', dataIndex: 'robot', key: 'robot', render: text => <span style={{ color: '#475569' }}>{text}</span> },
    { title: '存储体积', dataIndex: 'size', key: 'size', render: text => <Tag color="default">{text}</Tag> },
    { title: '数据流类型', dataIndex: 'type', key: 'type', render: text => <span style={{ color: '#475569' }}>{text}</span> },
    { title: '入库时间', dataIndex: 'date', key: 'date', render: text => <span style={{ color: '#64748b', fontSize: 13 }}>{text}</span> },
    { 
      title: '解析状态', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        const conf = {
          parsed: { color: 'success', text: '已解包转换' },
          unparsed: { color: 'default', text: '未处理存档' },
          parsing: { color: 'processing', text: '格式转换中...' }
        };
        return <Tag color={conf[status].color} style={{ borderRadius: 12, padding: '0 10px' }}>{conf[status].text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<PlayCircleOutlined />} style={{ color: record.status === 'parsed' ? '#94a3b8' : '#3b82f6', padding: 0 }} disabled={record.status === 'parsed'}>解析为数据集</Button>
          <Button type="text" icon={<DownloadOutlined />} style={{ color: '#0f172a', padding: 0 }}>下载原片</Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: 0 }}>
        
        {/* filter-card */}
        <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '24px 24px 8px' }}>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="filename" label="原文件名称" style={{ marginBottom: 16 }}>
                  <Input placeholder="请输入文件名" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="type" label="模态类型" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择模态">
                     <Option value="all">所有模态</Option>
                     <Option value="img">图像</Option>
                     <Option value="vid">视频/帧</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="status" label="解析状态" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态" />
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item name="date" label="入库时间" style={{ marginBottom: 16 }}>
                  <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={expand ? 16 : 8} style={{ textAlign: 'right', marginBottom: 16 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>检索存档</Button>
                  <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>重置</Button>
                  <span style={{ fontSize: 14, color: '#1677ff', cursor: 'pointer', marginLeft: 8 }} onClick={() => setExpand(!expand)}>
                    {expand ? <>收起 <UpOutlined style={{ fontSize: 12 }} /></> : <>展开 <DownOutlined style={{ fontSize: 12 }} /></>}
                  </span>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* main card content */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="tabs-bar" style={{ padding: '0 24px' }}>
            <div className="tabs-pill">
              <button className="tab-pill active">📋 全部文件</button>
              <button className="tab-pill">已解析</button>
              <button className="tab-pill">未解析</button>
            </div>
          </div>

          <div className="toolbar" style={{ padding: '16px 24px' }}>
            <div className="toolbar-left">
              <span className="tbl-title">原始数据列表</span>
            </div>
            <div className="toolbar-right">
              <Button type="primary" size="small">外部数据源接入</Button>
              <div className="icon-btn"><ReloadOutlined /></div>
              <div className="icon-btn"><SettingOutlined /></div>
            </div>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 50, textAlign: 'center' }}><input type="checkbox" /></th>
                  <th>原始数据文件 (Mcap / Bag)</th>
                  <th>采集设备</th>
                  <th>存储体积</th>
                  <th>数据流类型</th>
                  <th>入库时间</th>
                  <th>解析状态</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {dataSource.map((t, idx) => {
                  const conf = {
                    parsed: { color: 'success', text: '已解包转换' },
                    unparsed: { color: 'default', text: '未处理存档' },
                    parsing: { color: 'processing', text: '格式转换中...' }
                  };
                  return (
                    <tr key={t.key}>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td className="tbl-link">
                        <Space>
                           <DatabaseOutlined style={{ color: '#94a3b8' }} />
                           {t.bag}
                        </Space>
                      </td>
                      <td>{t.robot}</td>
                      <td><Tag color="default">{t.size}</Tag></td>
                      <td>{t.type}</td>
                      <td style={{ fontSize: 12, color: '#666' }}>{t.date}</td>
                      <td>
                        <Tag color={conf[t.status].color} style={{ borderRadius: 12, padding: '0 10px' }}>{conf[t.status].text}</Tag>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="act-btns" style={{ justifyContent: 'flex-end' }}>
                          <button className="act-btn" style={{ color: t.status === 'parsed' ? '#94a3b8' : '#3b82f6' }} disabled={t.status === 'parsed'}>解析</button>
                          <span className="act-sep">|</span>
                          <button className="act-btn">下载</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pager" style={{ padding: '12px 24px' }}>
            <span className="pager-info">共 <b>{dataSource.length}</b> 条数据</span>
            <div className="pager-right">
              <select className="pager-size"><option>20 条/页</option></select>
              <button className="pager-btn" disabled>‹</button>
              <button className="pager-btn cur">1</button>
              <button className="pager-btn">›</button>
            </div>
          </div>
        </div>
      </motion.div>
      <style>{`
        .custom-table-row:hover > td { background-color: #f8fafc !important; }
      `}</style>
    </MainLayout>
  );
}
