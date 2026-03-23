'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { motion } from 'framer-motion';
import { ReloadOutlined, SettingOutlined, DownOutlined, UpOutlined, SearchOutlined } from '@ant-design/icons';
import { Tooltip, Card, Form, Row, Col, Input, Select, Button, DatePicker, Space, Modal, Tabs } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChatCreateDrawer from '@/components/ChatCreateDrawer';

const { RangePicker } = DatePicker;

export default function TaskManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [expand, setExpand] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [form] = Form.useForm();

  const tasks = [
    {
      id: '12853',
      proj: 'InternalCommercial(内部-商业)',
      taskbook: 'tianqi001 采集任务书',
      name: '货架物品采集',
      enName: 'Shelf_Item_Collection',
      isShelf: '是',
      rowCol: 'A-1-2',
      device: 'galbot_2.2_RGB',
      purpose: 'OfficialCollection',
      scene: 'Supermarket',
      mode: 'WholeBody',
      remote: 'Master-slaveArm',
      rangeAnn: 45,
      pointAnn: 120,
      boxAnn: 88,
      instances: 5,
      planned: 100,
      collected: 85,
      status: 'done',
      collector: 'C-082',
      creator: '天奇管理员',
      createTime: '2026-03-10 10:00:00',
      updateTime: '2026-03-12 14:30:00'
    },
    {
      id: '12837',
      proj: 'SimulatedCollection(模拟采集)',
      taskbook: 'tianqi002 常用物品采集',
      name: '桌面操作任务',
      enName: 'Table_Op_Task',
      isShelf: '否',
      rowCol: '-',
      device: 'galbot_2.2_RGB',
      purpose: 'Operational',
      scene: 'Household',
      mode: 'WholeBody',
      remote: 'VR(VR)',
      rangeAnn: 12,
      pointAnn: 56,
      boxAnn: 34,
      instances: 2,
      planned: 50,
      collected: 12,
      status: 'running',
      collector: 'C-045',
      creator: '天奇管理员',
      createTime: '2026-03-11 09:15:00',
      updateTime: '2026-03-12 11:20:00'
    }
  ];

  const sMap = {
    done: { l: '已完成', c: 'tag-done' },
    running: { l: '进行中', c: 'tag-running' },
    error: { l: '异常', c: 'tag-error' },
    pending: { l: '未开始', c: 'tag-pending' }
  };

  const SortIcon = () => (
    <span style={{ fontSize: 10, color: '#bfbfbf', marginLeft: 4, display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', lineHeight: 1  } }>
      <UpOutlined style={{ marginBottom: -2 }} />
      <DownOutlined />
    </span>
  );

  const filteredTasks = tasks.filter(t => activeTab === 'all' || t.status === activeTab);

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: 0, background: '#F1F2F5', minHeight: 'calc(100vh - 56px)'  } }>
        
        {/* Advanced Filter Card */}
        <Card variant="borderless" style={{ borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '24px 24px 8px' } } }>
          <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1  } }>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="level1" label="一级项目" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择一级项目" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="level2" label="二级项目" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择二级项目" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="taskbook" label="任务书" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择任务书" />
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item name="taskName" label="任务名称" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入任务名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="taskId" label="任务ID" style={{ marginBottom: 16  } }>
                  <Input placeholder="请输入任务ID" />
                </Form.Item>
              </Col>
              
              {/* Expandable fields */}
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="creator" label="创建人" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择创建人" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="scene" label="场景分类" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择场景分类" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="purpose" label="任务用途" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择任务用途" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="mode" label="采集模式" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择采集模式" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="remoteType" label="遥操类型" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择遥操类型" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="deviceType" label="设备类型" style={{ marginBottom: 16  } }>
                  <Select placeholder="请选择设备类型" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="bbox" label="范围标注" style={{ marginBottom: 16  } }>
                  <Select placeholder="是否创建范围标注任务" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="point" label="点标注" style={{ marginBottom: 16  } }>
                  <Select placeholder="是否创建点标注任务" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none'  } }>
                <Form.Item name="date" label="创建时间" style={{ marginBottom: 16  } }>
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              
              <Col span={8} style={{ textAlign: 'right', marginBottom: 16, marginLeft: expand ? 0 : 0  } }>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>
                    重置
                  </Button>
                  <span 
                    style={{ fontSize: 14, color: '#1677ff', cursor: 'pointer', marginLeft: 8 }} 
                    onClick={() => setExpand(!expand)}
                  >
                    {expand ? <>收起 <UpOutlined style={{ fontSize: 12 }} /></> : <>展开 <DownOutlined style={{ fontSize: 12 }} /></>}
                  </span>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* main card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden'  } }>
          <div style={{ padding: '16px 24px 0 24px' }}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              type="card"
              tabBarStyle={{ borderBottom: 'none', marginBottom: 0 }}
              items={[
                { key: 'all', label: '📋 全部' },
                { key: 'running', label: '⚡️ 进行中' },
                { key: 'pending', label: '🕐 排队中' },
                { key: 'done', label: '✅ 已完成' },
                { key: 'error', label: '⚠️ 异常' }
              ]}
            />
          </div>

          <div className="toolbar" style={{ padding: '16px 24px'  } }>
            <div className="toolbar-left"><span className="tbl-title">任务列表</span></div>
            <div className="toolbar-right">
              <Link href="/collection/tasks/create">
                <button className="btn btn-primary btn-sm">＋ 模板创建</button>
              </Link>
              <button 
                className="btn btn-default btn-sm" 
                style={{ color: '#1677ff', borderColor: '#91caff', background: '#f0f7ff', fontWeight: 600 }} 
                onClick={() => setIsChatOpen(true)}
              >
                ✨ AI 助手建单
              </button>
              <button className="btn btn-default btn-sm" style={{ color: '#666' }}>☰ 批量添加标注</button>
              <Tooltip title="刷新">
                <div className="icon-btn"><ReloadOutlined /></div>
              </Tooltip>
              <Tooltip title="视图">
                <div className="icon-btn">⊞</div>
              </Tooltip>
              <Tooltip title="列设置">
                <div className="icon-btn"><SettingOutlined /></div>
              </Tooltip>
            </div>
          </div>
          
          <div className="tbl-wrap" style={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto'  } }>
            <table className="tbl" style={{ tableLayout: 'fixed', width: '2800px'  } }>
              <thead>
                <tr>
                  <th style={{ width: 45, textAlign: 'center', position: 'sticky', left: 0, zIndex: 10, background: '#fafafa', paddingLeft: 12, paddingRight: 0  } }><input type="checkbox" /></th>
                  <th style={{ width: 100, position: 'sticky', left: 45, zIndex: 10, background: '#fafafa', paddingLeft: 0  } }>任务ID <SortIcon /></th>
                  <th style={{ width: 180, position: 'sticky', left: 145, zIndex: 10, background: '#fafafa'  } }>任务名称</th>
                  <th style={{ width: 180  } }>项目</th>
                  <th style={{ width: 180  } }>任务书</th>
                  <th style={{ width: 180  } }>英文名称</th>
                  <th style={{ width: 100  } }>是否货架任务</th>
                  <th style={{ width: 100  } }>行列号</th>
                  <th style={{ width: 150  } }>设备类型</th>
                  <th style={{ width: 150  } }>任务用途</th>
                  <th style={{ width: 150  } }>场景分类</th>
                  <th style={{ width: 120  } }>采集模式</th>
                  <th style={{ width: 150  } }>遥操类型</th>
                  <th style={{ width: 100  } }>任务详情</th>
                  <th style={{ width: 100  } }>范围标注 <SortIcon /></th>
                  <th style={{ width: 100  } }>点标注 <SortIcon /></th>
                  <th style={{ width: 100  } }>框标注 <SortIcon /></th>
                  <th style={{ width: 120  } }>实例任务数量</th>
                  <th style={{ width: 130  } }>计划采集数量 <SortIcon /></th>
                  <th style={{ width: 100  } }>已采集数量</th>
                  <th style={{ width: 100  } }>任务状态</th>
                  <th style={{ width: 100  } }>采集员</th>
                  <th style={{ width: 100  } }>创建人</th>
                  <th style={{ width: 180  } }>创建时间 <SortIcon /></th>
                  <th style={{ width: 180  } }>更新时间 <SortIcon /></th>
                  <th style={{ width: 120, position: 'sticky', right: 220, zIndex: 10, background: '#fafafa'  } }>采集进度</th>
                  <th style={{ width: 220, position: 'sticky', right: 0, zIndex: 10, background: '#fafafa'  } }>操作</th>
                </tr>
              </thead>
              <tbody className="fade-rows">
                {filteredTasks.map((t, idx) => {
                  const s = sMap[t.status];
                  return (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', position: 'sticky', left: 0, background: '#fff', paddingLeft: 12, paddingRight: 0  } }><input type="checkbox" /></td>
                      <td style={{ position: 'sticky', left: 45, background: '#fff', fontWeight: 500, paddingLeft: 0  } }>{t.id}</td>
                      <td style={{ position: 'sticky', left: 145, background: '#fff'  } }>
                        <Link href={`/collection/tasks/${t.id}`}>
                          <span className="tbl-link">{t.name}</span>
                        </Link>
                      </td>
                      <td title={t.proj} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'  } }>{t.proj}</td>
                      <td>{t.taskbook}</td>
                      <td style={{ color: '#888'  } }>{t.enName}</td>
                      <td>{t.isShelf}</td>
                      <td>{t.rowCol}</td>
                      <td>{t.device}</td>
                      <td>{t.purpose}</td>
                      <td>{t.scene}</td>
                      <td>{t.mode}</td>
                      <td>{t.remote}</td>
                      <td>
                        <a 
                          className="tbl-link" 
                          style={{ fontSize: 12 }} 
                          onClick={() => {
                            setSelectedTask(t);
                            setDetailVisible(true);
                          }}
                        >
                          查看详情
                        </a>
                      </td>
                      <td>{t.rangeAnn}</td>
                      <td>{t.pointAnn}</td>
                      <td>{t.boxAnn}</td>
                      <td>{t.instances}</td>
                      <td>{t.planned}</td>
                      <td>{t.collected}</td>
                      <td><span className={`badge-tag ${s.c}`}>{s.l}</span></td>
                      <td>{t.collector}</td>
                      <td>{t.creator}</td>
                      <td style={{ fontSize: 12, color: '#666'  } }>{t.createTime}</td>
                      <td style={{ fontSize: 12, color: '#666'  } }>{t.updateTime}</td>
                      <td style={{ position: 'sticky', right: 220, background: '#fff', fontWeight: 600  } }>
                        {t.collected}/{t.planned}
                      </td>
                      <td style={{ position: 'sticky', right: 0, background: '#fff'  } }>
                        <div className="act-btns">
                          <Link href={`/collection/tasks/${t.id}`}>
                            <button className="act-btn">查看</button>
                          </Link>
                          <span className="act-sep">|</span>
                          <button className="act-btn">编辑</button>
                          <span className="act-sep">|</span>
                          <button className="act-btn" onClick={() => {
                            sessionStorage.setItem('copyTaskData', JSON.stringify(t));
                            router.push('/collection/tasks/create');
                          }}>复制</button>
                          <span className="act-sep">|</span>
                          <button className="act-btn del">删除</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pager" style={{ padding: '12px 24px'  } }>
            <span className="pager-info">共 <b>156</b> 条数据</span>
            <div className="pager-right">
              <select className="pager-size"><option>20 条/页</option></select>
              <button className="pager-btn" disabled>‹</button>
              <button className="pager-btn cur">1</button>
              <button className="pager-btn">2</button>
              <button className="pager-btn">3</button>
              <button className="pager-btn">›</button>
            </div>
          </div>
        </div>

      </motion.div>

      <Modal
        title="任务动作详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
        width={600}
      >
        <div style={{ padding: '0 10px'  } }>
          <p><b>任务名称:</b> {selectedTask?.name}</p>
          <p><b>英文名称:</b> {selectedTask?.enName}</p>
          <div style={{ marginTop: 20  } }>
            <div style={{ borderLeft: '3px solid #1677ff', paddingLeft: 10, fontWeight: 600, marginBottom: 15  } }>动作步骤</div>
            <div style={{ background: '#f8fafc', padding: 15, borderRadius: 8  } }>
              <div style={{ marginBottom: 10  } }>1. 移动至货架 A-1 前方 0.5m</div>
              <div style={{ marginBottom: 10  } }>2. 识别目标物体 "Supermarket_Items_01"</div>
              <div style={{ marginBottom: 10  } }>3. 机械臂执行抓取动作</div>
              <div style={{ marginBottom: 10  } }>4. 放置于指定收集篮</div>
            </div>
          </div>
        </div>
      </Modal>

      <ChatCreateDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        onFillForm={(data) => {
          localStorage.setItem('chatTaskData', JSON.stringify(data));
          window.open('/collection/tasks/create', '_blank');
        }}
      />
    </MainLayout>
  );
}
