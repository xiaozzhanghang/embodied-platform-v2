'use client';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button, Select, Modal, Form, Input, Space, Row, Col, Avatar, Card } from 'antd';
import { motion } from 'framer-motion';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const TPL_TAG_COLOR = { '服务数据': '#0958d9', '工业数据': '#d46b08', '零售数据': '#389e0d' };
const TPL_TAG_BG    = { '服务数据': '#e8f0fe', '工业数据': '#fff7e6', '零售数据': '#f6ffed' };

const TEMPLATES = [
  {
    key: 'desk-clean', name: '桌面整理', icon: '🗂', tag: '服务数据', uses: 28,
    device: 'galbot_2.2_RGB', remote: 'Master-slave', mode: 'WholeBody',
    desc: '书籍、收纳盒、垃圾清理等桌面物品整理任务',
    steps: [
      { et: '右手', skill: '识别', obj: '目标物品', goal: '确认位置' },
      { et: '右手', skill: '抓取', obj: '目标物品', goal: '稳定握持' },
      { et: '双手', skill: '移动', obj: '物品', goal: '目标摆放位置' },
      { et: '右手', skill: '放置', obj: '物品', goal: '指定区域' },
    ],
  },
  {
    key: 'clothes-fold', name: '衣物折叠', icon: '👕', tag: '服务数据', uses: 12,
    device: 'galbot_2.2_RGB', remote: 'VR(VR)', mode: 'WholeBody',
    desc: '叠牛仔裤等柔性物体折叠操作，步骤多、精度高',
    steps: [
      { et: '双手', skill: '抓取', obj: '衣物', goal: '展开平铺' },
      { et: '双手', skill: '对折', obj: '衣物', goal: '左右对齐' },
      { et: '双手', skill: '对折', obj: '衣物', goal: '上下对齐' },
      { et: '双手', skill: '放置', obj: '折叠衣物', goal: '堆叠区域' },
    ],
  },
  {
    key: 'sort', name: '物品分拣', icon: '📦', tag: '工业数据', uses: 35,
    device: 'galbot_2.2_R', remote: 'Master-slave', mode: 'WholeBody',
    desc: '分拣物品、电子产品，按类别放入对应区域',
    steps: [
      { et: '右手', skill: '识别', obj: '物品类别', goal: '分类判断' },
      { et: '右手', skill: '抓取', obj: '目标物品', goal: '稳定夹持' },
      { et: '右手', skill: '移动', obj: '物品', goal: '对应分拣区' },
      { et: '右手', skill: '放置', obj: '物品', goal: '指定容器/位置' },
    ],
  },
  {
    key: 'assembly', name: '工业组装', icon: '🔧', tag: '工业数据', uses: 8,
    device: 'galbot_2.2_R', remote: 'Master-slave', mode: 'WholeBody',
    desc: '组装管道支架等精密组装任务，需高精度对准',
    steps: [
      { et: '右手', skill: '抓取', obj: '零件A', goal: '取料区' },
      { et: '左手', skill: '抓取', obj: '零件B', goal: '取料区' },
      { et: '双手', skill: '对准', obj: '零件接口', goal: '精确插接' },
      { et: '双手', skill: '固定', obj: '组装件', goal: '锁紧到位' },
    ],
  },
  {
    key: 'retail', name: '零售商品操作', icon: '🛒', tag: '零售数据', uses: 22,
    device: 'galbot_2.2_RGB', remote: 'Master-slave', mode: 'WholeBody',
    desc: '零售薄饼、绿茶、茶裹王等商品的货架操作',
    steps: [
      { et: '右手', skill: '抓取', obj: '商品', goal: '货架/货箱' },
      { et: '右手', skill: '定向', obj: '商品', goal: '朝向标准面' },
      { et: '右手', skill: '放置', obj: '商品', goal: '货架指定位置' },
      { et: '左手', skill: '整齐', obj: '货架商品', goal: '端正排列' },
    ],
  },
  {
    key: 'clean', name: '清洁操作', icon: '🧹', tag: '服务数据', uses: 9,
    device: 'galbot_2.2_RGB', remote: 'VR(VR)', mode: 'WholeBody',
    desc: '清理台面垃圾等非结构化目标清洁任务',
    steps: [
      { et: '右手', skill: '识别', obj: '垃圾/脏物', goal: '确认目标' },
      { et: '右手', skill: '抓取', obj: '垃圾', goal: '稳定握持' },
      { et: '右手', skill: '移动', obj: '垃圾', goal: '垃圾桶上方' },
      { et: '右手', skill: '释放', obj: '垃圾', goal: '投入垃圾桶' },
    ],
  },
];

export default function TaskTemplates() {
  const router = useRouter();
  const [tagFilter, setTagFilter] = useState('');
  const [viewTpl, setViewTpl] = useState(null);

  const filtered = TEMPLATES.filter(t => !tagFilter || t.tag === tagFilter);

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: 0 }}>

        {/* 顶部工具栏 */}
        <div style={{
          background: '#fff', borderRadius: 8, padding: '12px 18px', marginBottom: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,.06)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>任务模版库</div>
            <span style={{
              background: '#e8f0fe', color: '#1a73e8', borderRadius: 10,
              padding: '1px 10px', fontSize: 12, fontWeight: 600
            }}>{filtered.length} 个模版</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              placeholder="全部场景"
              allowClear
              value={tagFilter || undefined}
              onChange={(v) => setTagFilter(v || '')}
              style={{ width: 120 }}
              options={[
                { value: '服务数据', label: '服务数据' },
                { value: '工业数据', label: '工业数据' },
                { value: '零售数据', label: '零售数据' },
              ]}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="small" 
              onClick={() => router.push('/collection/templates/create')}
            >
              新建模版
            </Button>
          </div>
        </div>

        {/* 模版卡片网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: '12px 0' }}>
          {filtered.map((t) => {
            const tc = TPL_TAG_COLOR[t.tag] || '#8c8c8c';
            const tb = TPL_TAG_BG[t.tag] || '#f5f5f5';
            return (
              <Card 
                key={t.key}
                hoverable
                style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0' }}
                bodyStyle={{ padding: '24px 24px 20px' }}
                actions={[
                  <a key="use" onClick={() => {
                    sessionStorage.setItem('useTemplateKey', t.key);
                    router.push('/collection/tasks/create');
                  }}>在任务中心使用</a>,
                  <a key="edit">编辑</a>,
                  <a key="delete">删除</a>
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar 
                      size={48} 
                      style={{ background: tb, color: tc, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {t.icon}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 500 }}>{t.name}</span>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ height: 44, color: '#8c8c8c', fontSize: 13, marginTop: 12, lineHeight: '22px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {t.desc}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                        <span style={{ fontSize: 12, color: '#1677ff', background: '#e6f4ff', padding: '2px 8px', borderRadius: 4 }}>{t.tag}</span>
                        <span style={{ fontSize: 12, color: '#8c8c8c', background: '#fafafa', padding: '2px 8px', borderRadius: 4, border: '1px solid #f0f0f0' }}>{t.device}</span>
                      </div>
                    </div>
                  }
                />
              </Card>
            );
          })}
        </div>

        {/* 查看/编辑模版 Modal */}
        <Modal
          title={`模版详情: ${viewTpl?.name || ''}`}
          open={!!viewTpl}
          onCancel={() => setViewTpl(null)}
          footer={[<Button key="close" onClick={() => setViewTpl(null)}>关闭</Button>]}
          width={600}
        >
          {viewTpl && (
            <div style={{ padding: '12px 0' }}>
              <Row gutter={[16, 12]}>
                <Col span={12}><span style={{ color: '#8c8c8c', fontSize: 12 }}>设备类型</span><br /><span style={{ fontWeight: 500 }}>{viewTpl.device}</span></Col>
                <Col span={12}><span style={{ color: '#8c8c8c', fontSize: 12 }}>遥操方式</span><br /><span style={{ fontWeight: 500 }}>{viewTpl.remote}</span></Col>
                <Col span={12}><span style={{ color: '#8c8c8c', fontSize: 12 }}>采集模式</span><br /><span style={{ fontWeight: 500 }}>{viewTpl.mode}</span></Col>
                <Col span={12}><span style={{ color: '#8c8c8c', fontSize: 12 }}>场景标签</span><br /><span style={{ fontWeight: 500 }}>{viewTpl.tag}</span></Col>
              </Row>
              <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>动作步骤</div>
                {viewTpl.steps.map((s, i) => (
                  <div key={i} style={{
                    background: '#f8fafc', padding: '10px 14px', borderRadius: 8,
                    marginBottom: 8, borderLeft: '3px solid #3b82f6',
                    display: 'flex', alignItems: 'center', gap: 10
                  }}>
                    <span style={{
                      width: 22, height: 22, background: '#e8f0fe', color: '#1a73e8',
                      borderRadius: '50%', fontSize: 11, fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 13 }}><strong>{s.et}</strong> · {s.skill} {s.obj} → {s.goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>

      </motion.div>
    </MainLayout>
  );
}
