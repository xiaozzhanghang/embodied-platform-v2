'use client';

import React, { useState } from 'react';
import { Layout, Row, Col, Space, Typography, Tag, Button, Select, Tooltip, InputNumber, Slider, Divider, Collapse } from 'antd';
import {
    CloseOutlined,
    FullscreenOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    FastBackwardOutlined,
    FastForwardOutlined,
    SettingOutlined,
    SyncOutlined,
    CaretRightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Header, Content, Sider, Footer } = Layout;
const { Text } = Typography;
const { Panel } = Collapse;

// Mock Video Component to simulate the camera feeds
const VideoFeed = ({ title, fps = 30, res = "640 * 360", duration = "6.333333", color = "#1e293b", isLarge = false }) => (
    <div style={{
        background: color,
        height: '100%',
        width: '100%',
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #334155'
    }}>
        {/* Top Bar inside Video */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <Space>
                <div style={{ width: 4, height: 14, background: '#3b82f6', borderRadius: 2 }} />
                <Text style={{ color: '#fff', fontSize: 13 }}>{title}</Text>
            </Space>
            <FullscreenOutlined style={{ color: '#fff', cursor: 'pointer' }} />
        </div>

        {/* Mock Content */}
        <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 50%, #1e293b 50%, #1e293b 75%, #0f172a 75%, #0f172a 100%)`,
            backgroundSize: `${isLarge ? '40px 40px' : '20px 20px'}`
        }}>
            <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: isLarge ? 24 : 16, fontWeight: 500 }}>视频流占位</Text>
        </div>

        {/* Bottom Right Info */}
        <div style={{ position: 'absolute', bottom: 12, right: 12, textAlign: 'right', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            <Text style={{ color: '#fff', fontSize: 11, display: 'block' }}>Fps: {fps}</Text>
            <Text style={{ color: '#fff', fontSize: 11, display: 'block' }}>Resolution: {res}</Text>
            <Text style={{ color: '#fff', fontSize: 11, display: 'block' }}>Duration: {duration}</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 11, display: 'block', cursor: 'pointer' }}>Download</Text>
        </div>
    </div>
);

// Timeline Component (Simplified Mock based on screenshot)
const Timeline = () => {
    return (
        <div style={{ flex: 1, padding: '0 24px' }}>
            {/* The main purple bar */}
            <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4, position: 'relative', marginTop: 8 }}>
                {/* Simulated loaded portion */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', background: '#6366f1', borderRadius: '4px 0 0 4px' }} />
                {/* Warning dots */}
                <div style={{ position: 'absolute', left: '25%', top: 20, width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <div style={{ position: 'absolute', left: '75%', top: 20, width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            </div>

            <div style={{ marginTop: 24, paddingLeft: 8, color: '#94a3b8', fontSize: 12 }}>存在错误:</div>
        </div>
    );
}

export default function AnnotationReviewPage() {
    const [isPlaying, setIsPlaying] = useState(false);

    // We bypass the MainLayout here because this tool is completely full-screen like a desktop app
    return (
        <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            {/* GLOBAL TOOL HEADER */}
            <div style={{ height: 48, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between' }}>
                <Space size="middle" style={{ flex: 1, overflow: 'hidden' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>111 (共 <Text strong style={{ color: '#ef4444' }}>2</Text> 条)</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>解析状态: <Text strong style={{ color: '#10b981' }}>(解析完成)</Text></Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>质检状态: <Text strong style={{ color: '#10b981' }}>(优秀)</Text></Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>标注状态: <Text strong style={{ color: '#10b981' }}>(标注完成)</Text></Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>审核状态: <Text strong style={{ color: '#10b981' }}>(审核通过)</Text></Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>任务ID: <Text strong>12837</Text></Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>数据序号: <Text strong>878911</Text></Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>文件目录: collect-data/12837.../8855...14c0</Text>
                </Space>
                <Button type="text" icon={<CloseOutlined />} />
            </div>

            {/* SHORTCUTS BAR */}
            <div style={{ height: 32, background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                <Space size="large" style={{ fontSize: 12, color: '#64748b' }}>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text strong>Esc:</Text> 返回列表</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text strong>Space:</Text> 播放/暂停</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text strong>Z:</Text> 上一帧</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text strong>X:</Text> 下一帧</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text strong>A:</Text> 上一数据</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text strong>D:</Text> 下一数据</Text>
                </Space>
            </div>

            {/* MAIN WORKSPACE */}
            <Layout style={{ flex: 1, overflow: 'hidden', padding: 12, gap: 12 }}>

                {/* VIDEOS AND 3D VIEW (LEFT AND CENTER) */}
                <Content style={{ display: 'flex', gap: 12, minWidth: 0 }}>

                    {/* LEFT COLUMN: Small Videos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '38%' }}>
                        <div style={{ flex: 1 }}>
                            <VideoFeed title="camera_hand_left_color" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <VideoFeed title="camera_hand_right_color" />
                        </div>
                    </div>

                    {/* CENTER COLUMN: Large Video & 3D Viewer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                        <div style={{ flex: 3 }}>
                            <VideoFeed title="camera_head_left_color" res="640 * 480" isLarge />
                        </div>
                        <div style={{ flex: 1 }}>
                            {/* 3D Joints Mock */}
                            <div style={{
                                background: '#000',
                                height: '100%',
                                width: '100%',
                                position: 'relative',
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: '1px solid #10b981' // Green stroke indicates active/selected or status
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                                    <Space>
                                        <div style={{ width: 4, height: 14, background: '#3b82f6', borderRadius: 2 }} />
                                        <Text style={{ color: '#fff', fontSize: 13 }}>joints.json</Text>
                                    </Space>
                                    <FullscreenOutlined style={{ color: '#fff', cursor: 'pointer' }} />
                                </div>
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* SVG Mock for 3D grid and skeleton base */}
                                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#grid)" style={{ transform: 'perspective(500px) rotateX(60deg) scale(2)', transformOrigin: 'center 80%' }} />
                                        {/* Mock stick figure center */}
                                        <circle cx="50%" cy="50%" r="6" fill="#fff" />
                                        <line x1="50%" y1="50%" x2="50%" y2="70%" stroke="#fff" strokeWidth="4" />
                                        <line x1="50%" y1="55%" x2="45%" y2="65%" stroke="#fff" strokeWidth="3" />
                                        <line x1="50%" y1="55%" x2="55%" y2="65%" stroke="#fff" strokeWidth="3" />
                                    </svg>
                                </div>
                                <div style={{ position: 'absolute', top: 36, left: 12, background: '#0ea5e9', padding: '2px 6px', borderRadius: 2 }}>
                                    <Text style={{ color: '#fff', fontSize: 10 }}>120 FPS (84-120)</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </Content>

                {/* RIGHT SIDEBAR: Parameters & Annotations */}
                <Sider width={320} style={{ background: '#fff', borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <Space>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4f46e5' }} />
                            <Text strong>1 右手从置物架抓取药品到药房工作台</Text>
                        </Space>
                        <Row gutter={8} style={{ marginTop: 12 }}>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>开始帧</Text>
                                <InputNumber size="small" defaultValue={0} style={{ width: '100%' }} />
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>结束帧</Text>
                                <InputNumber size="small" defaultValue={108} style={{ width: '100%' }} />
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>总共</Text>
                                <InputNumber size="small" defaultValue={109} disabled style={{ width: '100%' }} />
                            </Col>
                        </Row>
                    </div>

                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <Space>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#06b6d4' }} />
                            <Text strong>2 左手从桌子抓取叉子到盘子右侧</Text>
                        </Space>
                        <Row gutter={8} style={{ marginTop: 12 }}>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>开始帧</Text>
                                <InputNumber size="small" defaultValue={108} style={{ width: '100%' }} />
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>结束帧</Text>
                                <InputNumber size="small" defaultValue={190} style={{ width: '100%' }} />
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>总共</Text>
                                <InputNumber size="small" defaultValue={83} disabled style={{ width: '100%' }} />
                            </Col>
                        </Row>
                    </div>

                    <div style={{ padding: '12px 16px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>区域帧管理</Text>
                        <Button type="text" size="small" icon={<SettingOutlined />} />
                    </div>
                    {/* Empty space for more management tools */}
                    <div style={{ flex: 1, background: '#fff' }} />
                </Sider>

            </Layout>

            {/* BOTTOM CONTROLS & TIMELINE */}
            <Footer style={{ background: '#e2e8f0', padding: 0, height: 120, display: 'flex', flexDirection: 'column', borderTop: '1px solid #cbd5e1' }}>
                <Timeline />

                {/* Playback Controls Bar */}
                <div style={{ height: 64, background: '#e2e8f0', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>

                    {/* Time stats */}
                    <Space size="large" style={{ width: 240 }}>
                        <Text style={{ fontSize: 14 }}>Time：<Text strong>0.000</Text></Text>
                        <Text style={{ fontSize: 14 }}>Frame：<Text strong>0</Text></Text>
                    </Space>

                    {/* Media Controls */}
                    <Space size="middle" style={{ background: '#f1f5f9', padding: '6px 16px', borderRadius: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Button type="text" shape="circle" icon={<FastBackwardOutlined />} />
                        <Button type="text" shape="circle" icon={<StepBackwardOutlined />} />
                        <Button
                            type="text"
                            shape="circle"
                            icon={isPlaying ? <PauseCircleOutlined style={{ fontSize: 24, color: '#3b82f6' }} /> : <PlayCircleOutlined style={{ fontSize: 24, color: '#3b82f6' }} />}
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{ width: 40, height: 40 }}
                        />
                        <Button type="text" shape="circle" icon={<StepForwardOutlined />} />
                        <Button type="text" shape="circle" icon={<FastForwardOutlined />} />
                    </Space>

                    {/* Action Buttons (Quality judging) */}
                    <Space size="middle" style={{ width: 240, justifyContent: 'flex-end' }}>
                        <Button shape="round" style={{ background: '#10b981', color: '#fff', border: 'none', width: 70 }}>优秀</Button>
                        <Button shape="round" style={{ background: '#3b82f6', color: '#fff', border: 'none', width: 70 }}>良好</Button>
                        <Button shape="round" style={{ background: '#ef4444', color: '#fff', border: 'none', width: 70 }}>不合格</Button>
                        <Divider type="vertical" />
                        <Button type="text" icon={<SyncOutlined />} />
                        <Select defaultValue="1x" bordered={false} style={{ width: 70 }} suffixIcon={<CaretRightOutlined />}>
                            <Select.Option value="0.5x">0.5 x</Select.Option>
                            <Select.Option value="1x">1 x</Select.Option>
                            <Select.Option value="2x">2 x</Select.Option>
                        </Select>
                    </Space>

                </div>
            </Footer>
        </Layout>
    );
}

