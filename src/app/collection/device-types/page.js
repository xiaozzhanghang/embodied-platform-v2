'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Tabs, 
  Modal, 
  Form, 
  Select, 
  Typography, 
  Upload, 
  Tag, 
  Card,
  Row,
  Col,
  Tooltip,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  SyncOutlined, 
  PlusOutlined, 
  UploadOutlined,
  DownOutlined,
  UpOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { TextArea } = Input;
const { Text, Title } = Typography;

export default function DeviceTypes() {
  const [activeTab, setActiveTab] = useState('devices');
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [expandFilter, setExpandFilter] = useState(false);

  // Mock Data
  const deviceData = [
    { key: '1', name: 'galbot_2.2_RGB', enName: 'galbot_2.2', version: 'V2.2', desc: '预置 galbot V2.2 机器人配套 RGB 相机模块', urdf: 'galbot_v2.urdf', image: '无图片', regDate: '2025-12-20', status: 'enabled' },
    { key: '2', name: 'galbot_2.2_深度', enName: 'galbot_2.2.1', version: 'V2.2.1', desc: '预置 galbot V2.2 机器人配套深度相机模块', urdf: 'galbot_v2_depth.urdf', image: '无图片', regDate: '2025-12-19', status: 'enabled' },
    { key: '3', name: 'galbot_2.2_红外', enName: 'galbot_2.2_IR', version: 'V2.2', desc: '预置 galbot V2.2 机器人配套红外传感器模块', urdf: 'galbot_v2_ir.urdf', image: '无图片', regDate: '2025-12-19', status: 'disabled' },
  ];

  const partData = [
    { key: '1', name: '灵巧手_右', enName: 'LingQiaoShou_Right', version: 'G1.0', desc: '五指驱动灵巧采集手', urdf: 'hand_r.urdf', image: '无图片', regDate: '2025-12-20', stat: 'enabled' },
    { key: '2', name: '夹爪_右', enName: 'JiaZhao_Right', version: 'C2.1', desc: '工业级平行夹爪', urdf: 'gripper_r.urdf', image: '无图片', regDate: '2025-12-20', stat: 'enabled' },
  ];

  const deviceColumns = [
    { title: '机器人名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 180 },
    { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
    { title: '版本', dataIndex: 'version', key: 'version', width: 100 },
    { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 180, render: (t) => t ? <a style={{ color: '#1a73e8' }}>{t}</a> : '-' },
    { 
      title: '传感器描述', 
      dataIndex: 'desc', 
      key: 'desc', 
      ellipsis: true,
      render: (t) => <Tooltip title={t}><span style={{ color: '#666' }}>{t}</span></Tooltip>
    },
    { title: '注册时间', dataIndex: 'regDate', key: 'regDate', width: 150 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (s) => (
        <span className={`status-badge ${s === 'enabled' ? 'status-success' : 'status-default'}`}>
          {s === 'enabled' ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: () => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<StopOutlined />}>禁用</Button>
        </Space>
      ),
    },
  ];

  const partColumns = [
    { title: '部件名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 150 },
    { title: '英文名称', dataIndex: 'enName', key: 'enName', width: 150 },
    { title: 'URDF', dataIndex: 'urdf', key: 'urdf', width: 180, render: (t) => t ? <a style={{ color: '#1a73e8' }}>{t}</a> : '-' },
    { title: '注册时间', dataIndex: 'regDate', key: 'regDate', width: 150 },
    { 
      title: '状态', 
      dataIndex: 'stat', 
      key: 'stat', 
      width: 100,
      render: (s) => (
        <span className={`status-badge ${s === 'enabled' ? 'status-success' : 'status-default'}`}>
          {s === 'enabled' ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: () => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<StopOutlined />}>禁用</Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'devices', label: '机器人设备' },
    { key: 'parts', label: '机器人部件' },
  ];

  const handleAdd = () => {
    if (activeTab === 'devices') setIsDeviceModalOpen(true);
    else setIsPartModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="page-header">
        <Title level={4} className="page-header-title">设备类型管理</Title>
        <Text type="secondary" className="page-header-desc">统一管理机器人设备及其组成部件的类型定义与URDF配置</Text>
      </div>

      {/* Collapsible Filter Section */}
      <Card className="search-form" variant="borderless">
        <Form layout="horizontal">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="设备名称">
                <Input placeholder="请输入设备名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="版本号">
                <Input placeholder="请输入版本号" allowClear />
              </Form.Item>
            </Col>
            <AnimatePresence>
              {expandFilter && (
                <>
                  <Col span={8}>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <Form.Item label="状态">
                        <Select placeholder="请选择状态" allowClear>
                          <Select.Option value="enabled">启用</Select.Option>
                          <Select.Option value="disabled">禁用</Select.Option>
                        </Select>
                      </Form.Item>
                    </motion.div>
                  </Col>
                </>
              )}
            </AnimatePresence>
            <Col span={expandFilter ? 24 : 8} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                <Button icon={<SyncOutlined />}>重置</Button>
                <Button type="link" onClick={() => setExpandFilter(!expandFilter)} style={{ fontSize: 13 }}>
                  {expandFilter ? '收起' : '展开'} {expandFilter ? <UpOutlined /> : <DownOutlined />}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0 }}>
        {/* main table block */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px 0 24px' }}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              items={tabItems} 
              type="card"
              tabBarStyle={{ borderBottom: 'none', marginBottom: 0 }}
            />
          </div>

          <div className="toolbar" style={{ padding: '16px 24px' }}>
            <div className="toolbar-left">
              <span className="tbl-title">{activeTab === 'devices' ? '机器人设备列表' : '机器人部件列表'}</span>
            </div>
            <div className="toolbar-right">
              <Space size="middle">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加{activeTab === 'devices' ? '设备' : '部件'}</Button>
                <div className="icon-btn"><ReloadOutlined style={{ fontSize: 16 }} /></div>
                <div className="icon-btn"><ColumnHeightOutlined style={{ fontSize: 16 }} /></div>
                <div className="icon-btn"><SettingOutlined style={{ fontSize: 16 }} /></div>
              </Space>
            </div>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 50, textAlign: 'center' }}><input type="checkbox" /></th>
                  {activeTab === 'devices' ? (
                    <>
                      <th>机器人名称</th>
                      <th>英文名称</th>
                      <th>版本</th>
                      <th>URDF</th>
                      <th>传感器描述</th>
                      <th>注册时间</th>
                    </>
                  ) : (
                    <>
                      <th>部件名称</th>
                      <th>英文名称</th>
                      <th>版本</th>
                      <th>URDF</th>
                      <th>传感器描述</th>
                      <th>注册时间</th>
                      <th>状态</th>
                    </>
                  )}
                  <th style={{ minWidth: 200 }}>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {(activeTab === 'devices' ? deviceData : partData).map((item) => (
                  <tr key={item.key}>
                    <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                    {activeTab === 'devices' ? (
                      <>
                        <td>{item.name}</td>
                        <td style={{ color: '#666' }}>{item.enName}</td>
                        <td>{item.version}</td>
                        <td>{item.urdf ? <a style={{ color: '#1a73e8' }}>{item.urdf}</a> : '-'}</td>
                        <td style={{ color: '#a0aab5', maxWidth: 200, WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</td>
                        <td style={{ color: '#333' }}>{item.regDate}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.name}</td>
                        <td style={{ color: '#666' }}>{item.enName}</td>
                        <td>{item.version}</td>
                        <td>{item.urdf ? <a style={{ color: '#1a73e8' }}>{item.urdf}</a> : '-'}</td>
                        <td style={{ color: '#a0aab5', maxWidth: 200, WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</td>
                        <td style={{ color: '#333' }}>{item.regDate}</td>
                        <td>
                          <span className={`status-badge ${item.stat === 'enabled' ? 'status-success' : 'status-default'}`}>
                            {item.stat === 'enabled' ? '启用' : '禁用'}
                          </span>
                        </td>
                      </>
                    )}
                    <td>
                      <div className="act-btns" style={{ display: 'flex', gap: 16 }}>
                         <button className="act-btn" style={{ color: '#3b82f6' }}><EyeOutlined style={{ marginRight: 4 }} /> 查看</button>
                         <button className="act-btn" style={{ color: '#3b82f6' }}><EditOutlined style={{ marginRight: 4 }} /> 编辑</button>
                         <button className="act-btn del" style={{ color: '#ff4d4f' }}><StopOutlined style={{ marginRight: 4 }} /> 禁用</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager" style={{ padding: '12px 24px' }}>
            <span className="pager-info">共 <b>{activeTab === 'devices' ? deviceData.length : partData.length}</b> 条数据</span>
            <div className="pager-right">
              <select className="pager-size"><option>20 条/页</option></select>
              <button className="pager-btn" disabled>‹</button>
              <button className="pager-btn cur">1</button>
              <button className="pager-btn">›</button>
            </div>
          </div>
        </div>

        {/* Device Modal (Fig 1) */}
        <Modal 
          title="添加机器人设备" 
          open={isDeviceModalOpen} 
          onCancel={() => setIsDeviceModalOpen(false)} 
          width={900}
          footer={null}
          centered
          closeIcon={<span style={{ color: '#64748b', fontSize: 20 }}>×</span>}
        >
          <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ marginTop: 24 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 机器人名称</span>} colon={false} labelCol={{ span: 8 }}>
                  <Input placeholder="请输入机器人名称" suffix="0 / 50" style={{ borderRadius: 6 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}>英文名称 <Tooltip title="System ID"><InfoCircleOutlined style={{ color: '#64748b' }} /></Tooltip></span>} colon={false} labelCol={{ span: 8 }}>
                  <Input placeholder="请输入英文名称" suffix="0 / 50" style={{ borderRadius: 6 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 机器人版本</span>} colon={false} labelCol={{ span: 8 }}>
                  <Input placeholder="请输入机器人版本" suffix="0 / 50" style={{ borderRadius: 6 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}>部件</span>} colon={false} labelCol={{ span: 8 }}>
                  <Select 
                    placeholder="请选择部件" 
                    mode="multiple" 
                    style={{ width: '100%' }}
                    tagRender={({ label, closable, onClose }) => (
                      <Tag closable={closable} onClose={onClose} style={{ marginRight: 3, background: '#f1f5f9', border: 'none', borderRadius: 4 }}>
                        {label}
                      </Tag>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ display: 'flex', marginBottom: 24 }}>
              <div style={{ width: '16.666%', textAlign: 'right', paddingRight: 8, paddingTop: 8 }}>
                <Text style={{ fontWeight: 500, color: '#64748b' }}>已选部件</Text>
              </div>
              <div style={{ flex: 1 }}>
                <Table 
                  dataSource={[{ key: 1, name: '头部左相机', type: 'Body-HeadLeftCamera(本体-头...' }]}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName="modal-table-row"
                  columns={[
                    { title: '对齐点', dataIndex: 'align', key: 'align', width: 80, align: 'center', render: () => <div style={{ width: 14, height: 14, borderRadius: '50%', border: '4px solid #3b82f6', margin: '0 auto' }} /> },
                    { title: '部件名称', dataIndex: 'name', key: 'name' },
                    { title: '部件类型', dataIndex: 'type', key: 'type' },
                    { title: '操作', width: 80, align: 'center', render: () => <Button type="text" danger icon={<div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ff4d4f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>-</div>} /> }
                  ]}
                />
              </div>
            </div>

            <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 传感器描述</span>} colon={false}>
              <div style={{ position: 'relative' }}>
                <TextArea rows={4} placeholder="请输入传感器描述" style={{ borderRadius: 6 }} />
                <span style={{ position: 'absolute', right: 8, bottom: 4, color: '#94a3b8', fontSize: 12 }}>0 / 500</span>
              </div>
            </Form.Item>

            <Row style={{ marginBottom: 24 }}>
              <Col span={4} style={{ textAlign: 'right', paddingRight: 8 }}>
                <Text style={{ fontWeight: 500 }}>URDF</Text>
              </Col>
              <Col span={20}>
                <Space size="middle">
                  <Button type="primary" icon={<UploadOutlined />} style={{ borderRadius: 6, height: 36, background: '#3b82f6' }}>上传URDF文件</Button>
                  <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>可上传最多1份urdf格式的文件</Text>
                </Space>
              </Col>
            </Row>

            <Row>
              <Col span={4} style={{ textAlign: 'right', paddingRight: 8 }}>
                <Text style={{ fontWeight: 500 }}>设备图片</Text>
              </Col>
              <Col span={20}>
                <div>
                  <Upload listType="picture-card" showUploadList={false}>
                    <div style={{ color: '#94a3b8' }}>
                      <PlusOutlined style={{ fontSize: 24 }} />
                    </div>
                  </Upload>
                  <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 12 }}>
                    可上传最多5张单个不超过2MB且格式为jpg/jpeg/png/gif的图片
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Part Modal (Fig 2) */}
        <Modal 
          title="添加机器人部件" 
          open={isPartModalOpen} 
          onCancel={() => setIsPartModalOpen(false)} 
          width={1000}
          centered
          footer={[
            <Button key="cancel" onClick={() => setIsPartModalOpen(false)} style={{ borderRadius: 6 }}>取消</Button>,
            <Button key="ok" type="primary" onClick={() => setIsPartModalOpen(false)} style={{ borderRadius: 6, background: '#3b82f6' }}>确定</Button>
          ]}
          closeIcon={<span style={{ color: '#64748b', fontSize: 20 }}>×</span>}
        >
          <Form layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} style={{ marginTop: 24 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 部件名称</span>} colon={false} labelCol={{ span: 6 }}>
                  <Input placeholder="请输入部件名称" suffix="0 / 50" style={{ borderRadius: 6 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}>英文名称 <Tooltip title="System ID"><InfoCircleOutlined style={{ color: '#64748b' }} /></Tooltip></span>} colon={false} labelCol={{ span: 6 }}>
                  <Input placeholder="请输入英文名称" suffix="0 / 50" style={{ borderRadius: 6 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}><span style={{ color: '#ff4d4f' }}>*</span> 部件类型</span>} colon={false} labelCol={{ span: 6 }}>
                  <Select placeholder="请选择部件类型" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 500 }}>部件品牌</span>} colon={false} labelCol={{ span: 6 }}>
                  <Input placeholder="请输入部件品牌" suffix="0 / 50" style={{ borderRadius: 6 }} />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ display: 'flex', marginBottom: 24 }}>
              <div style={{ width: '12.5%', textAlign: 'right', paddingRight: 8, paddingTop: 8 }}>
                <Text style={{ fontWeight: 500, color: '#64748b' }}>Topic组件</Text>
              </div>
              <div style={{ flex: 1 }}>
                <Table 
                  dataSource={[{ key: 1, seq: 1 }]}
                  pagination={false}
                  size="small"
                  bordered
                  columns={[
                    { title: '序号', dataIndex: 'seq', key: 'seq', width: 50, align: 'center' },
                    { title: 'Topic名称', dataIndex: 'name', key: 'name', render: () => <Input placeholder="请输入Topic名称" variant="borderless" size="small" /> },
                    { title: '英文名称', dataIndex: 'ename', key: 'ename', render: () => <Input placeholder="请输入英文名称" variant="borderless" size="small" /> },
                    { title: 'Topic', dataIndex: 'topic', key: 'topic', render: () => <Input placeholder="请输入Topic" variant="borderless" size="small" /> },
                    { title: '标识', dataIndex: 'sign', key: 'sign', render: () => <Input placeholder="请输入标识" variant="borderless" size="small" /> },
                    { title: '分辨率', dataIndex: 'res', key: 'res', width: 140, render: () => (
                      <Space size={4}>
                        <Input placeholder="宽" size="small" style={{ width: 45, padding: '0 4px', textAlign: 'center' }} />
                        <span>*</span>
                        <Input placeholder="高" size="small" style={{ width: 45, padding: '0 4px', textAlign: 'center' }} />
                      </Space>
                    ) },
                    { title: '操作', width: 100, align: 'center', render: () => (
                      <Space>
                         <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ff4d4f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>-</div>
                         <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</div>
                      </Space>
                    ) }
                  ]}
                />
              </div>
            </div>

            <Form.Item label={<span style={{ fontWeight: 500 }}>传感器描述</span>} colon={false}>
              <div style={{ position: 'relative' }}>
                <TextArea rows={3} placeholder="请输入传感器描述" style={{ borderRadius: 6 }} />
                <span style={{ position: 'absolute', right: 8, bottom: 4, color: '#94a3b8', fontSize: 12 }}>0 / 500</span>
              </div>
            </Form.Item>

            <Row style={{ marginBottom: 24 }}>
              <Col span={3} style={{ textAlign: 'right', paddingRight: 8 }}>
                <Text style={{ fontWeight: 500 }}>URDF</Text>
              </Col>
              <Col span={21}>
                <Space size="middle">
                  <Button type="primary" icon={<UploadOutlined />} style={{ borderRadius: 6, background: '#3b82f6' }}>上传URDF文件</Button>
                  <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>可上传最多1份urdf格式的文件</Text>
                </Space>
              </Col>
            </Row>

            <Row>
              <Col span={3} style={{ textAlign: 'right', paddingRight: 8 }}>
                <Text style={{ fontWeight: 500 }}>设备图片</Text>
              </Col>
              <Col span={21}>
                <div>
                  <Upload listType="picture-card" showUploadList={false}>
                    <div style={{ color: '#94a3b8' }}>
                      <PlusOutlined style={{ fontSize: 24 }} />
                    </div>
                  </Upload>
                  <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 12 }}>
                    可上传最多5张单个不超过2MB且格式为jpg/jpeg/png/gif的图片
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>

      </motion.div>
    </MainLayout>
  );
}
