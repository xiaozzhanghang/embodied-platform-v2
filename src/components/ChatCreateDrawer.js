"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CheckOutlined, AudioOutlined } from '@ant-design/icons';

// 字段映射与风险定义
const FIELD_LABELS = {
  taskName: '任务名称', template: '匹配模板', count: '采集数量',
  scene: '场景分类', device: '设备型号', mode: '采集模式',
  remote: '遥操类型', purpose: '任务用途'
};
const FIELD_RISK = { taskName: 'warn', device: 'warn' };

export default function ChatCreateDrawer({ isOpen, onClose, onFillForm }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [animState, setAnimState] = useState(false); // 控制滑入滑出动画
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // 每次打开时清空上次对话，并重置状态
      setMessages([{
        role: 'ai',
        text: '你好！我是 AI 任务助手。你可以通过下方输入框**打字**或点击**麦克风**说话，告诉我你要新建什么任务。',
        chips: ['超市货架整理，300条', '餐具摆放，500条', '工业物品分拣，1000条']
      }]);
      setParsedData(null);
      setInputValue('');
      
      setTimeout(() => setAnimState(true), 10);
    } else {
      setAnimState(false);
      setIsRecording(false);
      clearTimeout(timerRef.current);
    }
  }, [isOpen]);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 简单的正则解析（模拟 AI 后端处理）
  const mockAIParde = (text) => {
    let result = { taskName: null, template: null, count: null, scene: null, device: null, mode: null, remote: null, purpose: null };
    
    if (/超市|货架/.test(text)) { result.template = 'retail'; result.scene = 'Supermarket'; result.mode = 'WholeBody'; }
    else if (/餐具|摆放|桌面/.test(text)) { result.template = 'desk-clean'; result.scene = 'Household'; result.mode = 'WholeBody'; }
    else if (/分拣|工业/.test(text)) { result.template = 'sort'; result.scene = 'Factory'; result.mode = 'WholeBody'; }
    else if (/折叠|叠衣/.test(text)) { result.template = 'clothes-fold'; result.scene = 'Household'; result.mode = 'WholeBody'; }
    
    const countMatch = text.match(/([零一二三四五六七八九十百千万\d]+)\s*条/);
    if (countMatch) {
      let num = parseInt(countMatch[1]);
      if (isNaN(num)) num = countMatch[1].includes('百') ? 100 : (countMatch[1].includes('千') ? 1000 : 50); // 极简处理
      result.count = num;
    }
    
    if (/RGB|rgb|彩色/.test(text)) result.device = 'galbot_2.2_RGB';
    else if (/galbot/.test(text) && /R/.test(text)) result.device = 'galbot_2.2_R';
    
    if (/VR|vr/.test(text)) result.remote = 'VR(VR)';
    else if (/Master|master|主从/.test(text)) result.remote = 'Master-slaveArm';
    
    if (/正式/.test(text)) result.purpose = 'OfficialCollection'; 
    else if (/测试|试验/.test(text)) result.purpose = 'Operational';
    
    const nameMatch = text.match(/新建[一个个]*([\u4e00-\u9fa5a-zA-Z0-9_\-]+?)(?:任务|，|,|$)/) || text.match(/建一个([\u4e00-\u9fa5a-zA-Z0-9_\-]+?)(?:任务|，|,|$)/);
    if (nameMatch) result.taskName = nameMatch[1] + '任务';

    result.ready = true; 
    return result;
  };

  const handleSend = async (textToSend, isVoice = false) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setMessages(prev => [...prev, { role: 'user', text, isVoice }]);
    setIsLoading(true);

    setTimeout(() => {
      const newParsed = { ...parsedData, ...mockAIParde(text) };
      Object.keys(newParsed).forEach(k => (newParsed[k] == null) && delete newParsed[k]);
      
      setParsedData(newParsed);

      let replyText = newParsed.ready 
        ? '好的，信息已提取，请核对右侧卡片，无误后点击下方按钮填入表单。' 
        : '已识别主要信息。还需要确认缺失的字段，请补充一下？';
        
      if (!newParsed.taskName) {
        replyText = '已识别主要信息。还需要确认：任务名称，请补充一下？';
      }

      setMessages(prev => [...prev, {
        role: 'ai',
        text: replyText,
        parsedFields: newParsed,
        chips: []
      }]);
      setIsLoading(false);
    }, 1200);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      clearTimeout(timerRef.current);
      // 模拟识别出的固定文本
      handleSend("帮我建一个超市货架整理的任务，数量300条，在正式环境去采集，用galbot RGB的设备操作。", true);
    } else {
      setIsRecording(true);
      timerRef.current = setTimeout(() => {
        setIsRecording(false);
        handleSend("帮我建一个超市货架整理的任务，数量300条，在正式环境去采集，用galbot RGB的设备操作。", true);
      }, 3000); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAutoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  const TPL_MAP = {
    'retail': '超市货架整理',
    'desk-clean': '桌面物品整理',
    'sort': '工业物品分拣',
    'clothes-fold': '折叠衣物'
  };

  if (!isOpen && !animState) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, pointerEvents: isOpen ? 'auto' : 'none' }}>
      <div 
        style={{ 
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', 
          opacity: animState ? 1 : 0, transition: 'opacity 0.3s ease' 
        }}
        onClick={onClose} 
      />

      <div 
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '100%', 
          background: '#fff', display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
          transform: animState ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#1677ff' }}>
              ✨
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>AI 智能建单</div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>对话或语音指令，<span style={{ fontWeight: 600 }}>AI</span> 自动提取字段</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: 'none', background: 'transparent', color: '#bfbfbf', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {/* 消息区域 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 24, background: '#fff' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div 
                style={
                  msg.role === 'ai' 
                  ? { background: '#1677ff', width: 32, height: 32, borderRadius: '50%', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } 
                  : { background: '#e6f4ff', width: 32, height: 32, borderRadius: '50%', color: '#1677ff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
                }
              >
                {msg.role === 'ai' ? 'AI' : '我'}
              </div>

              <div style={{ maxWidth: 290, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div 
                  style={
                    msg.role === 'ai'
                    ? { background: '#f5f5f5', color: '#333', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', fontSize: 13.5, lineHeight: 1.6 }
                    : { background: '#1677ff', color: '#fff', borderRadius: '16px 4px 16px 16px', padding: '12px 16px', fontSize: 13.5, lineHeight: 1.6 }
                  }
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                  {msg.isVoice && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: msg.role === 'user' ? '#e6f4ff' : '#8c8c8c', opacity: 0.8 }}>
                      <AudioOutlined /> 语音转录文本
                    </div>
                  )}
                </div>

                {msg.chips && msg.chips.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingLeft: 2 }}>
                    {msg.chips.map((chip, cIdx) => (
                      <button 
                        key={cIdx} 
                        onClick={() => handleSend(chip)}
                        className="chip-hover"
                        style={{ background: '#fff', border: '1px solid #91caff', color: '#1677ff', borderRadius: 20, padding: '4px 14px', fontSize: 12.5, cursor: 'pointer', transition: 'background 0.2s' }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {msg.parsedFields && Object.keys(msg.parsedFields).length > 1 && (
                  <div style={{ background: '#f8faff', border: '1px solid #e6f4ff', borderRadius: 12, padding: '16px 20px', marginTop: 12, width: 300, boxShadow: '0 2px 8px rgba(22,119,255,0.04)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1677ff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>📋</span> 已提取字段
                    </div>
                    {Object.keys(FIELD_LABELS).map(key => {
                      const val = msg.parsedFields[key];
                      if (key === 'ready') return null;
                      let display = val != null ? (key === 'count' ? `${val}条` : String(val)) : null;
                      if (key === 'template' && val) display = TPL_MAP[val] || val;
                      return (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #f0f0f0', fontSize: 13 }}>
                          <span style={{ color: '#8c8c8c' }}>{FIELD_LABELS[key]}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {display ? (
                              <>
                                <span style={{ fontWeight: 600, color: '#333' }}>{display}</span>
                                <CheckOutlined style={{ color: '#52c41a', fontSize: 12, fontWeight: 'bold' }} />
                              </>
                            ) : (
                              <span style={{ color: '#bfbfbf' }}>未识别</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ background: '#1677ff', width: 32, height: 32, borderRadius: '50%', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>AI</div>
              <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: 6, alignItems: 'center', height: 42 }}>
                <span className="dot-bounce" style={{ width: 6, height: 6, background: '#1677ff', borderRadius: '50%', animationDelay: '0s' }}></span>
                <span className="dot-bounce" style={{ width: 6, height: 6, background: '#1677ff', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                <span className="dot-bounce" style={{ width: 6, height: 6, background: '#1677ff', borderRadius: '50%', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 底部功能区 */}
        <div style={{ padding: '16px 24px 20px', borderTop: '0px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 12, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.03)' }}>
          
          {/* 确认填入按钮 */}
          {parsedData && Object.keys(parsedData).length > 0 && (
            <button 
              onClick={() => {
                onFillForm(parsedData);
                onClose();
              }}
              style={{ width: '100%', height: 44, background: '#1677ff', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <CheckOutlined /> 字段核对无误，填入表单 →
            </button>
          )}

          {/* 输入控制区 */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {/* 语音按钮 */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={toggleRecording}
                style={{ 
                  width: 42, height: 42, borderRadius: 8, 
                  background: isRecording ? '#ff4d4f' : '#f5f5f5', 
                  color: isRecording ? '#fff' : '#1677ff', 
                  border: isRecording ? 'none' : '1px solid #d9d9d9', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18,
                  position: 'relative', overflow: 'visible', transition: 'all 0.3s'
                }}
              >
                <AudioOutlined style={{ zIndex: 2 }} />
                {isRecording && <div className="ripple-effect"></div>}
              </button>
              {isRecording && (
                <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', padding: '6px 12px', borderRadius: 6, fontSize: 12, whiteSpace: 'nowrap', zIndex: 100 }}>
                  正在聆听...
                </div>
              )}
            </div>

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleAutoResize}
              placeholder={isRecording ? "正在语音输入..." : "打字描述任务，或者按左侧说话..."}
              style={{ flex: 1, maxHeight: 120, border: '1px solid #d9d9d9', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'none', lineHeight: 1.5, borderColor: isRecording ? '#ff4d4f' : (inputValue ? '#1677ff' : '#d9d9d9') }}
              rows={1}
              disabled={isRecording}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading || isRecording}
              style={{ width: 42, height: 42, borderRadius: 8, background: (!inputValue.trim() || isLoading || isRecording) ? '#bae0ff' : '#1677ff', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .chip-hover:hover { background: #e6f4ff !important; }
        @keyframes custom-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .dot-bounce { animation: custom-bounce 1s infinite ease-in-out; }
        @keyframes ripple {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(2.2); opacity: 0; }
        }
        .ripple-effect {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 8px; background: #ff4d4f;
            animation: ripple 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
