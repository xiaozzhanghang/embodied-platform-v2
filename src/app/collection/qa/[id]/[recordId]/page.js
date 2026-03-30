'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Button, Slider, Typography, Modal, Timeline, Steps, Card, Space, Tag, Input, Badge, message, Popover, Select, Radio, Tooltip, Divider, Progress } from 'antd';
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
const TaskStep = ({ id, number, title, status, isActive, onClick, progress, time, initialStart, initialEnd, annotations = [], annotationMode, onAddRange, onAddPoint, onAddBox, onDeleteAnno, allowedTools = ['point', 'range', 'box'] }) => {
  const [startFrame, setStartFrame] = useState(initialStart);
  const [endFrame, setEndFrame] = useState(initialEnd);
  const getStatusIcon = () => {
    if (status === 'done') return <CheckCircleFilled style={{ color: '#52c41a' }} />;
    if (isActive) return <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', border: '2px solid #fff' }} />;
    return <InfoCircleOutlined style={{ color: '#bfbfbf' }} />;
  };

  return (
    <div 
      onClick={status !== 'done' ? onClick : undefined}
      style={{ 
        padding: '12px 16px', 
        background: isActive ? '#1890ff' : '#fff', 
        borderRadius: 12, 
        marginBottom: 12,
        border: isActive ? 'none' : '1px solid #f0f0f0',
        boxShadow: isActive ? '0 8px 16px rgba(24, 144, 255, 0.25)' : 'none',
        transition: 'all 0.3s ease',
        cursor: status !== 'done' ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isActive ? 12 : 0 }}>
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
        {isActive && <Text style={{ color: '#fff', fontSize: 13 }}>{time}</Text>}
        {!isActive && <div style={{ display: 'flex', alignItems: 'center' }}>{getStatusIcon()}</div>}
      </div>

      {isActive && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, marginTop: 8 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 2 }}>开始帧</Text>
              <Input size="small" value={startFrame} onChange={(e) => setStartFrame(e.target.value)} style={{ width: 60, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', textAlign: 'center', borderColor: 'transparent' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 2 }}>结束帧</Text>
              <Input size="small" value={endFrame} onChange={(e) => setEndFrame(e.target.value)} style={{ width: 60, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', textAlign: 'center', borderColor: 'transparent' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 2 }}>总共</Text>
              <Input size="small" value={Math.max(0, (parseInt(endFrame) || 0) - (parseInt(startFrame) || 0) + 1)} style={{ width: 60, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', textAlign: 'center' }} readOnly />
            </div>
          </div>
          
          {allowedTools.includes('range') && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Button 
                size="small" 
                type={annotationMode === 'range' ? 'primary' : 'default'} 
                style={{ flex: 1, borderColor: annotationMode === 'range' ? '#1890ff' : 'rgba(255,255,255,0.4)', color: '#fff', background: annotationMode === 'range' ? '#1890ff' : 'transparent', fontSize: 12 }} 
                icon={<SwapOutlined />} 
                onClick={(e) => { e.stopPropagation(); onAddRange(); }}
              >
                {annotationMode === 'range' ? '请在底部时间轴拖拽' : '提取异常时段'}
              </Button>
            </div>
          )}
          {(allowedTools.includes('box') || allowedTools.includes('point')) && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {allowedTools.includes('box') && (
                <Button size="small" type={annotationMode === 'box' ? 'primary' : 'default'} style={{ flex: 1, borderColor: annotationMode === 'box' ? '#1890ff' : 'rgba(255,255,255,0.4)', color: '#fff', background: annotationMode === 'box' ? '#1890ff' : 'transparent', fontSize: 12 }} icon={<BorderOutlined />} onClick={(e) => { e.stopPropagation(); onAddBox(); }}>{annotationMode === 'box' ? '请在画面框选' : '异常区域框'}</Button>
              )}
              {allowedTools.includes('point') && (
                <Button size="small" type={annotationMode === 'point' ? 'primary' : 'default'} style={{ flex: 1, borderColor: annotationMode === 'point' ? '#1890ff' : 'rgba(255,255,255,0.4)', color: '#fff', background: annotationMode === 'point' ? '#1890ff' : 'transparent', fontSize: 12 }} icon={<PushpinOutlined />} onClick={(e) => { e.stopPropagation(); onAddPoint(); }}>{annotationMode === 'point' ? '请点选画面' : '异常定位点'}</Button>
              )}
            </div>
          )}

          {annotations.length > 0 && (
             <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 6, padding: '8px 12px' }}>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, display: 'block', marginBottom: 6, fontWeight: 500 }}>区域帧管理 (异常记录)</Text>
                {annotations.map(anno => (
                  <div key={anno.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: anno.color }} />
                      <Text style={{ color: '#fff', fontSize: 11 }}>{anno.label}</Text>
                    </div>
                    <Space size={8}>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>第{anno.frame}帧</Text>
                      <DeleteOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onDeleteAnno(anno.id); }} />
                    </Space>
                  </div>
                ))}
             </div>
          )}

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


// --- Annotation Components ---


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
  const [annotationMode, setAnnotationMode] = useState(null); // 'point' | 'box' | 'range' | null
  const [annotations, setAnnotations] = useState([]);
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(106);
  const [activeStepId, setActiveStepId] = useState(2); // ID to track which step is active
  
  // Layout Modes
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'single'
  const [focusedCameraIndex, setFocusedCameraIndex] = useState(1);
  const [allowedTools] = useState(['point', 'range', 'box']); // Base configuration mock
  
  // Range dragging state
  const [isRangeDragging, setIsRangeDragging] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null); // { id, edge: 'start' | 'end' }

  const handleSetAnnotationMode = (mode) => {
    if (annotationMode === mode) {
      setAnnotationMode(null);
      setViewMode('grid');
    } else {
      setAnnotationMode(mode);
      if (mode === 'point' || mode === 'box') {
        setViewMode('single');
      } else {
        setViewMode('grid');
      }
      if (mode === 'range') message.info('提示: 请在底部蓝色时间轴上左右拖拽提取片段');
      if (mode === 'box') message.info('提示: 请在左侧视频画面上拖拽框选异常区域');
      if (mode === 'point') message.info('提示: 请在左侧视频画面上直接点击标记异常点');
    }
  };

  const handleAddAnnotation = (basicData) => {
    setEditingAnnotation({
      ...basicData,
      id: null,
      label: `异常标记 (步骤 ${activeStepId})`, // Prefill with step context
      color: '#ff4d4f', // Default red for errors
      stepId: activeStepId // Link to the current task step
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
  const onHandleMouseDown = (e, id, edge) => {
    e.stopPropagation();
    setResizeHandle({ id, edge });
  };

  const onRangeMouseDown = (e) => {
    if (annotationMode !== 'range') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setIsRangeDragging(true);
    setRangeStart(percent);
    setRangeEnd(percent);
  };

  const onRangeMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    
    if (isRangeDragging) {
      setRangeEnd(percent);
    } else if (resizeHandle) {
      const frame = Math.round(percent * 5.3); // Map percent to frame (max ~530)
      setAnnotations(annotations.map(a => {
        if (a.id === resizeHandle.id) {
          if (resizeHandle.edge === 'start') {
            return { ...a, start: Math.min(frame, a.end - 1) }; // Prevent crossing
          } else {
            return { ...a, end: Math.max(frame, a.start + 1) };
          }
        }
        return a;
      }));
    }
  };

  const onRangeMouseUp = () => {
    if (isRangeDragging) {
      setIsRangeDragging(false);
      if (rangeStart !== null && rangeEnd !== null && Math.abs(rangeStart - rangeEnd) > 2) {
        handleAddAnnotation({
          type: 'range',
          start: Math.round(Math.min(rangeStart, rangeEnd) * 5.3), // map to frames
          end: Math.round(Math.max(rangeStart, rangeEnd) * 5.3)
        });
      }
      setRangeStart(null);
      setRangeEnd(null);
    }
    if (resizeHandle) {
      setResizeHandle(null);
    }
  };

  // Add global mouse up listener for robustness when dragging out of bounds
  React.useEffect(() => {
    const handleMouseUp = () => {
      if (resizeHandle) setResizeHandle(null);
      if (isRangeDragging) onRangeMouseUp();
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [resizeHandle, isRangeDragging, rangeStart, rangeEnd]);

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

        {/* Dynamic Content Area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Main View Area */}
        {viewMode === 'grid' ? (
          <div style={{ 
            flex: 1, 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gridTemplateRows: '1fr 1fr', 
            gap: 16,
            padding: '16px 20px',
            overflowY: 'auto'
          }}>
             {[
              { id: 0, title: "左侧手部相机 (左)", bgUrl: ASSETS.HAND_LEFT, tag: 'HAND_L', isModel: false },
              { id: 1, title: "头部主视角 (主)", bgUrl: ASSETS.HEAD_MAIN, tag: 'HEAD_L', isModel: false },
              { id: 2, title: "右侧手部相机 (右)", bgUrl: ASSETS.HAND_RIGHT, tag: 'HAND_R', isModel: false },
              { id: 3, title: "机器人3D模型 (运动学)", bgUrl: ASSETS.IK_VIZ, tag: '3D_MODEL', isModel: true }
             ].map(cam => (
                <CameraView 
                  key={cam.id}
                  title={cam.title} 
                  bgUrl={cam.bgUrl} 
                  headerInfo={{ tag: cam.tag }} 
                  isModel={cam.isModel}
                  annotationMode={annotationMode}
                  annotations={annotations}
                  onAddAnnotation={handleAddAnnotation}
                  currentFrame={currentFrame}
                />
             ))}
          </div>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
             background: '#eaeff3'
          }}>
             <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'center' }}>
                <Radio.Group 
                  value={focusedCameraIndex} 
                  onChange={e => setFocusedCameraIndex(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                >
                  {[
                    { id: 0, title: "左侧手部相机 (左)", bgUrl: ASSETS.HAND_LEFT, tag: 'HAND_L', isModel: false },
                    { id: 1, title: "头部主视角 (主)", bgUrl: ASSETS.HEAD_MAIN, tag: 'HEAD_L', isModel: false },
                    { id: 2, title: "右侧手部相机 (右)", bgUrl: ASSETS.HAND_RIGHT, tag: 'HAND_R', isModel: false },
                    { id: 3, title: "机器人仿真 (运动学)", bgUrl: ASSETS.IK_VIZ, tag: '3D_MODEL', isModel: true }
                  ].map(cam => (
                    <Radio.Button key={cam.id} value={cam.id}>{cam.title.split(' ')[0]}</Radio.Button>
                  ))}
                </Radio.Group>
             </div>
             <div style={{ flex: 1, minHeight: 0, padding: 24 }}>
                {[
                  { id: 0, title: "左侧手部相机 (左)", bgUrl: ASSETS.HAND_LEFT, tag: 'HAND_L', isModel: false },
                  { id: 1, title: "头部主视角 (主)", bgUrl: ASSETS.HEAD_MAIN, tag: 'HEAD_L', isModel: false },
                  { id: 2, title: "右侧手部相机 (右)", bgUrl: ASSETS.HAND_RIGHT, tag: 'HAND_R', isModel: false },
                  { id: 3, title: "机器人3D模型 (运动学)", bgUrl: ASSETS.IK_VIZ, tag: '3D_MODEL', isModel: true }
                ][focusedCameraIndex] && (
                  <CameraView 
                    title={[
                      { id: 0, title: "左侧手部相机 (左)", bgUrl: ASSETS.HAND_LEFT, tag: 'HAND_L', isModel: false },
                      { id: 1, title: "头部主视角 (主)", bgUrl: ASSETS.HEAD_MAIN, tag: 'HEAD_L', isModel: false },
                      { id: 2, title: "右侧手部相机 (右)", bgUrl: ASSETS.HAND_RIGHT, tag: 'HAND_R', isModel: false },
                      { id: 3, title: "机器人3D模型 (运动学)", bgUrl: ASSETS.IK_VIZ, tag: '3D_MODEL', isModel: true }
                    ][focusedCameraIndex].title} 
                    bgUrl={[
                      { id: 0, title: "左侧手部相机 (左)", bgUrl: ASSETS.HAND_LEFT, tag: 'HAND_L', isModel: false },
                      { id: 1, title: "头部主视角 (主)", bgUrl: ASSETS.HEAD_MAIN, tag: 'HEAD_L', isModel: false },
                      { id: 2, title: "右侧手部相机 (右)", bgUrl: ASSETS.HAND_RIGHT, tag: 'HAND_R', isModel: false },
                      { id: 3, title: "机器人3D模型 (运动学)", bgUrl: ASSETS.IK_VIZ, tag: '3D_MODEL', isModel: true }
                    ][focusedCameraIndex].bgUrl} 
                    headerInfo={{ tag: [
                      { id: 0, title: "左侧手部相机 (左)", bgUrl: ASSETS.HAND_LEFT, tag: 'HAND_L', isModel: false },
                      { id: 1, title: "头部主视角 (主)", bgUrl: ASSETS.HEAD_MAIN, tag: 'HEAD_L', isModel: false },
                      { id: 2, title: "右侧手部相机 (右)", bgUrl: ASSETS.HAND_RIGHT, tag: 'HAND_R', isModel: false },
                      { id: 3, title: "机器人3D模型 (运动学)", bgUrl: ASSETS.IK_VIZ, tag: '3D_MODEL', isModel: true }
                    ][focusedCameraIndex].tag }} 
                    isModel={[
                      { id: 0, title: "左侧手部相机 (左)", bgUrl: ASSETS.HAND_LEFT, tag: 'HAND_L', isModel: false },
                      { id: 1, title: "头部主视角 (主)", bgUrl: ASSETS.HEAD_MAIN, tag: 'HEAD_L', isModel: false },
                      { id: 2, title: "右侧手部相机 (右)", bgUrl: ASSETS.HAND_RIGHT, tag: 'HAND_R', isModel: false },
                      { id: 3, title: "机器人3D模型 (运动学)", bgUrl: ASSETS.IK_VIZ, tag: '3D_MODEL', isModel: true }
                    ][focusedCameraIndex].isModel}
                    annotationMode={annotationMode}
                    annotations={annotations}
                    onAddAnnotation={handleAddAnnotation}
                    currentFrame={currentFrame}
                  />
                )}
             </div>
          </div>
        )}

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
           </div>

           <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 11, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>标注任务关键步骤</Text>
              </div>
              
              <TaskStep 
                id={1} number={1} title="移动到货架旁" status="done" 
                isActive={activeStepId === 1} 
                onClick={() => setActiveStepId(1)}
              />
              <TaskStep 
                id={2} number={2} title="执行物体抓取" status="active" 
                isActive={activeStepId === 2} 
                onClick={() => setActiveStepId(2)}
                progress={65} time="00:03:15"
                initialStart={51} initialEnd={108}
                annotations={annotations.filter(a => a.stepId === 2)}
                annotationMode={activeStepId === 2 ? annotationMode : null}
                onAddRange={() => handleSetAnnotationMode('range')}
                onAddPoint={() => handleSetAnnotationMode('point')}
                onAddBox={() => handleSetAnnotationMode('box')}
                onDeleteAnno={deleteAnnotation}
                allowedTools={allowedTools}
              />
              <TaskStep 
                id={3} number={3} title="提升并平稳转移" status="pending" 
                isActive={activeStepId === 3} 
                onClick={() => setActiveStepId(3)}
                initialStart={109} initialEnd={180}
                annotations={annotations.filter(a => a.stepId === 3)}
                annotationMode={activeStepId === 3 ? annotationMode : null}
                onAddRange={() => handleSetAnnotationMode('range')}
                onAddPoint={() => handleSetAnnotationMode('point')}
                onAddBox={() => handleSetAnnotationMode('box')}
                onDeleteAnno={deleteAnnotation}
                allowedTools={allowedTools}
              />
              <TaskStep 
                id={4} number={4} title="精准放置到容器" status="pending" 
                isActive={activeStepId === 4} 
                onClick={() => setActiveStepId(4)}
                initialStart={181} initialEnd={250}
                annotations={annotations.filter(a => a.stepId === 4)}
                annotationMode={activeStepId === 4 ? annotationMode : null}
                onAddRange={() => handleSetAnnotationMode('range')}
                onAddPoint={() => handleSetAnnotationMode('point')}
                onAddBox={() => handleSetAnnotationMode('box')}
                onDeleteAnno={deleteAnnotation}
                allowedTools={allowedTools}
              />
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
              style={{ flex: 1, height: 4, background: '#f0f0f0', borderRadius: 2, margin: '0 32px', position: 'relative', cursor: annotationMode === 'range' ? 'col-resize' : 'default' }}
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
                      position: 'absolute',
                      height: 32,
                      top: -14,
                      borderRadius: 4,
                      opacity: 0.85,
                      left: `${anno.start / 5.3}%`, 
                      width: `${(anno.end - anno.start) / 5.3}%`, 
                      backgroundColor: anno.color 
                    }}
                  >
                     <span style={{ 
                       position: 'absolute',
                       top: -24,
                       left: 0,
                       padding: '2px 6px', 
                       background: 'rgba(0,0,0,0.7)', 
                       color: '#fff', 
                       borderRadius: 4, 
                       fontSize: 10, 
                       whiteSpace: 'nowrap' 
                     }}>
                       {anno.label}
                     </span>
                     {/* Left Drag Handle */}
                     <div 
                       style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', background: 'rgba(255,255,255,0.4)', borderRight: `1px solid rgba(0,0,0,0.1)`, zIndex: 10, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} 
                       onMouseDown={(e) => onHandleMouseDown(e, anno.id, 'start')}
                     />
                     {/* Right Drag Handle */}
                     <div 
                       style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', background: 'rgba(255,255,255,0.4)', borderLeft: `1px solid rgba(0,0,0,0.1)`, zIndex: 10, borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
                       onMouseDown={(e) => onHandleMouseDown(e, anno.id, 'end')}
                     />
                  </div>
               ))}

               {/* Range Dragging Preview */}
               {isRangeDragging && rangeStart !== null && rangeEnd !== null && (
                 <div 
                   className="range-drag-preview"
                   style={{
                     left: `${Math.min(rangeStart, rangeEnd)}%`,
                     width: `${Math.abs(rangeStart - rangeEnd)}%`,
                     position: 'absolute',
                     top: -2,
                     height: 8,
                     background: 'rgba(24, 144, 255, 0.5)',
                     borderRadius: 2
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
            </Space>
         </div>
      </div>
      </div>
    </MainLayout>
  );
}
