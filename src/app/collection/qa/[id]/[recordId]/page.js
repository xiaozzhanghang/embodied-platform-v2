'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Space, Tag, Typography, Progress, Badge, Card, Divider } from 'antd';
import { 
  ArrowLeftOutlined, 
  CaretRightFilled, 
  StepBackwardOutlined, 
  StepForwardOutlined, 
  ExpandOutlined,
  PauseOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  StarFilled,
  CloseCircleOutlined,
  CompassOutlined,
  ControlOutlined,
  LineChartOutlined,
  MessageOutlined,
  YoutubeOutlined,
  PushpinOutlined,
  BorderOutlined,
  SwapOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Input, Tooltip, Popover } from 'antd';
import MainLayout from '@/components/MainLayout';
import Link from 'next/link';

const { Text, Title } = Typography;

// High-fidelity assets located in public/assets/qa
const ASSETS = {
  HAND_LEFT: '/assets/qa/hand_left.png',
  HAND_RIGHT: '/assets/qa/hand_right.png',
  HEAD_MAIN: '/assets/qa/head_main.png',
  IK_VIZ: '/assets/qa/ik_viz.png',
};

// Task Step component for the sidebar
const TaskStep = ({ number, title, status, isActive, progress = 0, time = '00:03:15' }) => {
  const getStatusIcon = () => {
    if (status === 'done') return <CheckCircleFilled style={{ color: '#52c41a' }} />;
    if (status === 'active') return <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', border: '2px solid #fff' }} />;
    return <InfoCircleOutlined style={{ color: '#bfbfbf' }} />;
  };

  return (
    <div style={{ 
      padding: '12px 16px', 
      background: isActive ? '#1890ff' : '#fff', 
      borderRadius: 12, 
      marginBottom: 12,
      border: isActive ? 'none' : '1px solid #f0f0f0',
      boxShadow: isActive ? '0 8px 16px rgba(24, 144, 255, 0.25)' : 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isActive ? 8 : 0 }}>
        <Space size={12}>
          <div style={{ 
            width: 24, height: 24, borderRadius: '50%', 
            background: isActive ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isActive ? '#fff' : '#8c8c8c', fontWeight: 600, fontSize: 13
          }}>
            {number}
          </div>
          <Text style={{ 
            color: isActive ? '#fff' : '#262626', 
            fontSize: 14, 
            fontWeight: 500,
            maxWidth: 180
          }} ellipsis>
            {title}
          </Text>
        </Space>
        <Space size={8}>
          {isActive && <Text style={{ color: '#fff', fontSize: 13 }}>{time}</Text>}
          <div style={{ display: 'flex', alignItems: 'center' }}>{getStatusIcon()}</div>
        </Space>
      </div>

      {isActive && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <Text style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 11, marginBottom: 8 }}>
            Active - {time}
          </Text>
          <Progress 
            percent={progress} 
            size="small" 
            showInfo={false} 
            strokeColor="#fff" 
            trailColor="rgba(255,255,255,0.2)" 
          />
        </motion.div>
      )}

      {!isActive && status === 'done' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: '#52c41a' }} />
      )}
    </div>
  );
};

// CameraView with Header Info bar
// CameraView with Header Info bar and Annotation Overlay
const CameraView = ({ 
  title, 
  height, 
  bgUrl, 
  headerInfo = {}, 
  isModel = false,
  annotationMode,
  annotations = [],
  onAddAnnotation,
  currentFrame = 106
}) => {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawStart, setDrawStart] = React.useState(null);
  const [drawCurrent, setDrawCurrent] = React.useState(null);
  const containerRef = React.useRef(null);

  const handleMouseDown = (e) => {
    if (annotationMode !== 'box' || isModel) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawCurrent({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDrawCurrent({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (drawStart && drawCurrent) {
      const x = Math.min(drawStart.x, drawCurrent.x);
      const y = Math.min(drawStart.y, drawCurrent.y);
      const width = Math.abs(drawStart.x - drawCurrent.x);
      const height = Math.abs(drawStart.y - drawCurrent.y);
      if (width > 1 && height > 1) {
        onAddAnnotation({
          type: 'box',
          x, y, width, height,
          frame: currentFrame
        });
      }
    }
    setDrawStart(null);
    setDrawCurrent(null);
  };

  const handleClick = (e) => {
    if (annotationMode !== 'point' || isModel || isDrawing) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onAddAnnotation({
      type: 'point',
      x, y,
      frame: currentFrame
    });
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 12, 
      overflow: 'hidden', 
      height: height || '100%', 
      position: 'relative',
      border: '1px solid #f0f0f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Instrument Header */}
      <div style={{ 
        padding: '4px 12px', 
        background: '#fafafa', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Space size={8}>
          <Text strong style={{ color: '#434343', fontSize: 11, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
            {title}
          </Text>
          <Divider type="vertical" style={{ margin: '0 4px' }} />
          {!isModel && (
            <Space size={4}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4d4f', boxShadow: '0 0 4px #ff4d4f' }} />
              <Text style={{ fontSize: 10, color: '#8c8c8c', whiteSpace: 'nowrap' }}>录制中</Text>
            </Space>
          )}
          {isModel && (
            <Space size={4}>
              <CompassOutlined style={{ color: '#1890ff', fontSize: 11 }} />
              <Tag color="processing" bordered={false} style={{ fontSize: 9, height: 16, lineHeight: '15px', borderRadius: 4, margin: 0, padding: '0 4px', background: '#e6f7ff', color: '#1890ff' }}>3D实时</Tag>
            </Space>
          )}
          <Text style={{ fontSize: 10, color: '#8c8c8c', whiteSpace: 'nowrap' }}>{isModel ? '状态:' : '帧率:'} <span style={{ color: '#262626', fontWeight: 600 }}>{isModel ? '已连接' : '30'}</span></Text>
          <Text style={{ fontSize: 10, color: '#8c8c8c', whiteSpace: 'nowrap' }}>{isModel ? '关节:' : '时间:'} <span style={{ color: '#262626', fontWeight: 600 }}>{isModel ? '1-7 激活' : '00:03:45:12'}</span></Text>
        </Space>
        <Space size={12}>
           <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Text type="secondary" style={{ fontSize: 10, marginRight: 4, whiteSpace: 'nowrap' }}>{isModel ? '设置' : '时间戳'}</Text>
              <CaretRightFilled style={{ fontSize: 7, color: '#bfbfbf', transform: 'rotate(90deg)' }} />
           </div>
           <FullscreenOutlined style={{ color: '#bfbfbf', fontSize: 14, cursor: 'pointer' }} />
        </Space>
      </div>

      {/* View Content */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className={`annotation-overlay-container ${annotationMode && !isModel ? `cursor-${annotationMode === 'point' ? 'crosshair' : 'cell'}` : ''}`}
        style={{ 
          flex: 1, 
          background: isModel ? '#000' : '#0a0a0a',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.95,
          pointerEvents: 'none'
        }} />
        
        {/* Annotation Layers */}
        {!isModel && (
          <div className="annotation-overlay" style={{ pointerEvents: 'none' }}>
            {annotations.map(anno => {
              if (anno.type === 'point') {
                return (
                  <div 
                    key={anno.id} 
                    className="annotation-point" 
                    style={{ left: `${anno.x}%`, top: `${anno.y}%`, backgroundColor: anno.color }}
                  >
                    <div className="annotation-point-label">{anno.label}</div>
                  </div>
                );
              }
              if (anno.type === 'box') {
                return (
                  <div 
                    key={anno.id} 
                    className="annotation-box" 
                    style={{ 
                      left: `${anno.x}%`, 
                      top: `${anno.y}%`, 
                      width: `${anno.width}%`, 
                      height: `${anno.height}%`,
                      borderColor: anno.color
                    }}
                  >
                    <div className="annotation-box-label" style={{ backgroundColor: anno.color }}>{anno.label}</div>
                  </div>
                );
              }
              return null;
            })}

            {/* Drawing Preview */}
            {isDrawing && drawStart && drawCurrent && (
              <div 
                className="annotation-drawing-preview"
                style={{
                  left: `${Math.min(drawStart.x, drawCurrent.x)}%`,
                  top: `${Math.min(drawStart.y, drawCurrent.y)}%`,
                  width: `${Math.abs(drawStart.x - drawCurrent.x)}%`,
                  height: `${Math.abs(drawStart.y - drawCurrent.y)}%`
                }}
              />
            )}
          </div>
        )}

        {/* 3D Viewer Specific Controls Overlay */}
        {isModel && (
          <>
            <div style={{ 
              position: 'absolute', 
              top: 20, 
              right: 20, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 12,
              zIndex: 10 
            }}>
               <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  <ExpandOutlined style={{ fontSize: 14 }} />
               </div>
               <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  <ControlOutlined style={{ fontSize: 14 }} />
               </div>
               <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  <LineChartOutlined style={{ fontSize: 14 }} />
               </div>
            </div>
            {/* Axis indicator */}
            <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>
               <div style={{ width: 40, height: 40, position: 'relative' }}>
                  <div style={{ position: 'absolute', width: 20, height: 2, background: '#f5222d', left: 20, top: 20 }} />
                  <div style={{ position: 'absolute', height: 20, width: 2, background: '#52c41a', left: 20, top: 0 }} />
                  <div style={{ position: 'absolute', height: 16, width: 16, border: '1.5px solid #1890ff', borderRadius: '50%', left: 12, top: 12, borderRightColor: 'transparent', borderTopColor: 'transparent', transform: 'rotate(20deg)' }} />
                  <Text style={{ position: 'absolute', color: '#f5222d', fontSize: 9, right: -4, top: 16 }}>X</Text>
                  <Text style={{ position: 'absolute', color: '#52c41a', fontSize: 9, left: 18, top: -12 }}>Y</Text>
                  <Text style={{ position: 'absolute', color: '#1890ff', fontSize: 9, left: 6, bottom: -4 }}>Z</Text>
               </div>
            </div>
          </>
        )}

        {/* Label Overlay - Sleek Badge */}
        <div style={{ 
          position: 'absolute', 
          top: 12, 
          left: 12,
          backgroundColor: 'rgba(0,0,0,0.45)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          padding: '2px 8px',
          border: '1px solid rgba(255,255,255,0.12)',
          zIndex: 5
        }}>
           <Text style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>{headerInfo.tag || (isModel ? '3D_机器人模型' : '活跃视图')}</Text>
        </div>
 
         {isModel && (
           <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 5 }}>
              <div style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Text style={{ color: '#fff', fontSize: 10 }}>运行环境: RT-Kinematics v2.4 (激活)</Text>
              </div>
              <div style={{ padding: '4px 10px', background: 'rgba(24, 144, 255, 0.4)', backdropFilter: 'blur(4px)', borderRadius: 4, border: '1px solid rgba(24, 144, 255, 0.2)' }}>
                <Text style={{ color: '#fff', fontSize: 10 }}>末端误差: 0.12mm | 负载: 45%</Text>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

// --- New Annotation Components ---

const AnnotationToolbar = ({ mode, setMode }) => (
  <div className="annotation-toolbar">
    <div className="annotation-toolbar-title">标注工具栏</div>
    <div className="annotation-tool-group">
      <Tooltip title="点标注 (点击视频)">
        <div 
          className={`annotation-tool-btn ${mode === 'point' ? 'active' : ''}`}
          onClick={() => setMode(mode === 'point' ? null : 'point')}
        >
          <PushpinOutlined className="tool-icon" />
          <span className="tool-label">点标注</span>
        </div>
      </Tooltip>
      <Tooltip title="时段标注 (在时间轴上拖拽)">
        <div 
          className={`annotation-tool-btn ${mode === 'range' ? 'active' : ''}`}
          onClick={() => setMode(mode === 'range' ? null : 'range')}
        >
          <SwapOutlined className="tool-icon" />
          <span className="tool-label">时段标注</span>
        </div>
      </Tooltip>
      <Tooltip title="框标注 (拖拽视频画面)">
        <div 
          className={`annotation-tool-btn ${mode === 'box' ? 'active' : ''}`}
          onClick={() => setMode(mode === 'box' ? null : 'box')}
        >
          <BorderOutlined className="tool-icon" />
          <span className="tool-label">框标注</span>
        </div>
      </Tooltip>
    </div>
  </div>
);

const AnnotationList = ({ annotations, onDelete, onSelectItem }) => (
  <div className="annotation-list" style={{ marginTop: 24 }}>
    <div className="annotation-list-title">
      标注数据
      <span className="annotation-list-count">{annotations.length}</span>
    </div>
    {annotations.length === 0 ? (
      <div className="annotation-empty">
        <YoutubeOutlined className="annotation-empty-icon" />
        <div>目前暂无任何标注数据</div>
      </div>
    ) : (
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {annotations.map(anno => (
          <div key={anno.id} className="annotation-item" onClick={() => onSelectItem(anno)}>
            <div className="annotation-item-dot" style={{ color: anno.color, backgroundColor: anno.color }} />
            <div className="annotation-item-info">
              <div className="annotation-item-label">{anno.label}</div>
              <div className="annotation-item-meta">
                {anno.type === 'range' ? `第 ${anno.start}-${anno.end} 帧` : `第 ${anno.frame} 帧`}
                {anno.type === 'point' && ` • 坐标 (${Math.round(anno.x)}, ${Math.round(anno.y)})`}
              </div>
            </div>
            <DeleteOutlined 
              className="annotation-item-delete" 
              onClick={(e) => { e.stopPropagation(); onDelete(anno.id); }} 
            />
          </div>
        ))}
      </div>
    )}
  </div>
);

const AnnotationPopover = ({ annotation, onSave, onCancel }) => {
  const [label, setLabel] = React.useState(annotation.label || '');
  const [color, setColor] = React.useState(annotation.color || '#1890ff');
  const colors = ['#1890ff', '#52c41a', '#f5222d', '#722ed1', '#faad14', '#13c2c2'];

  return (
    <div className="annotation-popover" style={{ 
      left: annotation.type === 'range' ? '50%' : `${annotation.x}%`, 
      top: annotation.type === 'range' ? 'auto' : `${annotation.y}%`,
      bottom: annotation.type === 'range' ? 80 : 'auto',
      transform: annotation.type === 'range' ? 'translateX(-50%)' : 'none'
    }}>
      <div className="annotation-popover-title">
        {annotation.id ? '编辑' : '新建'} {annotation.type === 'range' ? '时段标注' : annotation.type === 'point' ? '点标注' : '框标注'}
      </div>
      <input 
        autoFocus
        className="annotation-popover-input"
        placeholder="请输入标注标签内容..."
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSave({ ...annotation, label, color })}
      />
      <div className="annotation-popover-colors">
        {colors.map(c => (
          <div 
            key={c}
            className={`annotation-color-swatch ${color === c ? 'selected' : ''}`}
            style={{ backgroundColor: c, color: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <div className="annotation-popover-actions">
        <Button size="small" onClick={onCancel}>取消</Button>
        <Button size="small" type="primary" onClick={() => onSave({ ...annotation, label, color })}>保存标注</Button>
      </div>
    </div>
  );
};

export default function AdvancedAuditPage() {
  const { id, recordId } = useParams();
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  // --- Annotation State ---
  const [annotationMode, setAnnotationMode] = useState(null); // 'point' | 'range' | 'box' | null
  const [annotations, setAnnotations] = useState([]);
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(106);
  const [isRangeDragging, setIsRangeDragging] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  const handleAddAnnotation = (basicData) => {
    setEditingAnnotation({
      ...basicData,
      id: null,
      label: '',
      color: '#1890ff'
    });
  };

  const saveAnnotation = (anno) => {
    if (!anno.label.trim()) return;
    if (anno.id) {
      setAnnotations(annotations.map(a => a.id === anno.id ? anno : a));
    } else {
      setAnnotations([...annotations, { ...anno, id: Date.now() }]);
    }
    setEditingAnnotation(null);
    setAnnotationMode(null);
  };

  const deleteAnnotation = (id) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  // Range dragging logic for footer timeline
  const onRangeMouseDown = (e) => {
    if (annotationMode !== 'range') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setIsRangeDragging(true);
    setRangeStart(percent);
    setRangeEnd(percent);
  };

  const onRangeMouseMove = (e) => {
    if (!isRangeDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setRangeEnd(percent);
  };

  const onRangeMouseUp = () => {
    if (!isRangeDragging) return;
    setIsRangeDragging(false);
    if (Math.abs(rangeStart - rangeEnd) > 2) {
      handleAddAnnotation({
        type: 'range',
        start: Math.round(Math.min(rangeStart, rangeEnd) * 5.3), // map to frames
        end: Math.round(Math.max(rangeStart, rangeEnd) * 5.3)
      });
    }
    setRangeStart(null);
    setRangeEnd(null);
  };

  return (
    <MainLayout>
      <div style={{ 
        height: 'calc(100vh - 64px)', 
        width: '100%', 
        background: '#f5f7fa', 
        display: 'flex', 
        flexDirection: 'column',
        color: '#262626',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
      }}>
        {/* Detail Header bar */}
        <div style={{ 
          padding: '12px 24px', 
          background: '#fff', 
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <Space size={16}>
            <Link href={`/collection/qa/${id}`}>
              <Button icon={<ArrowLeftOutlined />} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Title level={5} style={{ margin: 0 }}>质检审核: {recordId}</Title>
                <Tag color="blue">数据包: {id}</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>最后更新时间: 2026-03-23 10:23:45</Text>
            </div>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />}>重置视图</Button>
            <Button type="primary" icon={<CheckOutlined />}>完成抽检审核</Button>
          </Space>
        </div>

        {/* Editor Popover */}
        {editingAnnotation && (
          <AnnotationPopover 
            annotation={editingAnnotation} 
            onSave={saveAnnotation} 
            onCancel={() => setEditingAnnotation(null)} 
          />
        )}

        {/* 2x2 Grid Layout Content Area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Main 2x2 View Grid */}
        <div style={{ 
          flex: 1, 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gridTemplateRows: '1fr 1fr', 
          gap: 16,
          padding: '16px 20px',
          overflowY: 'auto'
        }}>
            <CameraView 
             title="左侧手部相机 (左)" 
             bgUrl={ASSETS.HAND_LEFT} 
             headerInfo={{ tag: 'HAND_L' }} 
             annotationMode={annotationMode}
             annotations={annotations}
             onAddAnnotation={handleAddAnnotation}
             currentFrame={currentFrame}
           />
           <CameraView 
             title="头部主视角相机 (左)" 
             bgUrl={ASSETS.HEAD_MAIN} 
             headerInfo={{ tag: 'HEAD_L' }} 
             annotationMode={annotationMode}
             annotations={annotations}
             onAddAnnotation={handleAddAnnotation}
             currentFrame={currentFrame}
           />
           <CameraView 
             title="右侧手部相机 (右)" 
             bgUrl={ASSETS.HAND_RIGHT} 
             headerInfo={{ tag: 'HAND_R' }} 
             annotationMode={annotationMode}
             annotations={annotations}
             onAddAnnotation={handleAddAnnotation}
             currentFrame={currentFrame}
           />
           <CameraView 
             title="机器人3D模型 (运动学)" 
             bgUrl={ASSETS.IK_VIZ} 
             isModel={true} 
             headerInfo={{ tag: '3D_MODEL' }} 
           />
        </div>

        {/* Right Column - Sidebar */}
        <div style={{ 
          width: 380, 
          background: '#fff', 
          borderLeft: '1px solid #e8e8e8',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.02)'
        }}>
           <div style={{ padding: '24px 24px 12px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => router.back()}
                  style={{ marginRight: 12 }}
                />
                <Text strong style={{ fontSize: 18, color: '#262626' }}>{recordId}</Text>
              </div>

              {/* Annotation Toolbar */}
              <AnnotationToolbar mode={annotationMode} setMode={setAnnotationMode} />
           </div>

           <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
              <AnnotationList 
                annotations={annotations} 
                onDelete={deleteAnnotation} 
                onSelectItem={(anno) => setEditingAnnotation(anno)} 
              />
              <div className="sidebar-section-divider" />
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ fontSize: 11, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>标注任务关键步骤</Text>
              </div>
              <TaskStep number={1} title="移动到货架旁" status="done" />
              <TaskStep number={2} title="执行物体抓取" status="active" isActive={true} progress={65} time="00:03:15" />
              <TaskStep number={3} title="提升并平稳转移" status="pending" />
              <TaskStep number={4} title="精准放置到容器" status="pending" />
           </div>

           {/* Audit Result Panel */}
           <div style={{ padding: '24px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <Text strong style={{ fontSize: 12, color: '#8c8c8c', display: 'block', marginBottom: 16, letterSpacing: '0.05em' }}>质检最终结论</Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                 <Card hoverable size="small" styles={{ body: { padding: '12px 0', textAlign: 'center' } }} style={{ borderRadius: 12, border: '1px solid #1890ff', background: '#f0f9ff' }}>
                    <StarFilled style={{ fontSize: 20, color: '#1890ff', marginBottom: 8 }} />
                    <Text strong style={{ display: 'block', fontSize: 11, color: '#1890ff' }}>优秀</Text>
                 </Card>
                 <Card hoverable size="small" styles={{ body: { padding: '12px 0', textAlign: 'center' } }} style={{ borderRadius: 12 }}>
                    <CheckOutlined style={{ fontSize: 20, color: '#8c8c8c', marginBottom: 8 }} />
                    <Text strong style={{ display: 'block', fontSize: 11, color: '#595959' }}>符合要求</Text>
                 </Card>
                 <Card hoverable size="small" styles={{ body: { padding: '12px 0', textAlign: 'center' } }} style={{ borderRadius: 12 }}>
                    <ExclamationCircleOutlined style={{ fontSize: 20, color: '#8c8c8c', marginBottom: 8 }} />
                    <Text strong style={{ display: 'block', fontSize: 11, color: '#595959' }}>审核失败</Text>
                 </Card>
              </div>
           </div>
        </div>
      </div>

      {/* Unified Footer */}
      <div style={{ 
        height: 64, 
        background: '#fff', 
        borderTop: '1px solid #e8e8e8', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 24px',
        zIndex: 20
      }}>
         <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: '#595959', fontFamily: 'monospace', fontWeight: 600, width: 140 }}>00:03:45 / 00:05:30</Text>
            
            <div 
              style={{ flex: 1, height: 4, background: '#f0f0f0', borderRadius: 2, margin: '0 32px', position: 'relative', cursor: annotationMode === 'range' ? 'pointer' : 'default' }}
              onMouseDown={onRangeMouseDown}
              onMouseMove={onRangeMouseMove}
              onMouseUp={onRangeMouseUp}
            >
               <div style={{ width: '65%', height: '100%', background: '#1890ff', borderRadius: 2 }} />
               <div style={{ position: 'absolute', left: '64%', top: -6, width: 16, height: 16, background: '#fff', borderRadius: '50%', border: '4px solid #1890ff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'grab' }} />
               
               {/* Rendering Annotations on Timeline */}
               {annotations.filter(a => a.type === 'range').map(anno => (
                  <div 
                    key={anno.id} 
                    className="range-segment" 
                    style={{ 
                      left: `${anno.start / 5.3}%`, 
                      width: `${(anno.end - anno.start) / 5.3}%`, 
                      backgroundColor: anno.color 
                    }}
                  >
                    <span className="range-segment-label">{anno.label}</span>
                  </div>
               ))}

               {/* Range Dragging Preview */}
               {isRangeDragging && rangeStart !== null && rangeEnd !== null && (
                 <div 
                   className="range-drag-preview"
                   style={{
                     left: `${Math.min(rangeStart, rangeEnd)}%`,
                     width: `${Math.abs(rangeStart - rangeEnd)}%`
                   }}
                 />
               )}

               {[10, 30, 50, 90].map(l => (
                  <div key={l} style={{ position: 'absolute', left: `${l}%`, top: -14, textAlign: 'center' }}>
                    <div style={{ background: '#52c41a', height: 12, width: 24, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckOutlined style={{ color: '#fff', fontSize: 8 }} />
                    </div>
                    <Text style={{ fontSize: 9, color: '#8c8c8c', marginTop: 1, display: 'block' }}>pass</Text>
                  </div>
               ))}
            </div>

            <Space size={24} style={{ marginLeft: 32 }}>
               <Text style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>播放</Text>
               <Space size={16}>
                 <StepBackwardOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }} />
                 <Text style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>前一帧</Text>
                 <Text style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>后一帧</Text>
                 <StepForwardOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }} />
               </Space>
               <Divider type="vertical" />
               <Text style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>倍速播放</Text>
               <Text 
                 style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer', color: annotationMode ? '#1890ff' : 'inherit' }}
                 onClick={() => setAnnotationMode(annotationMode ? null : 'point')}
               >
                 标注模式
               </Text>
            </Space>
         </div>
      </div>
      </div>
    </MainLayout>
  );
}
