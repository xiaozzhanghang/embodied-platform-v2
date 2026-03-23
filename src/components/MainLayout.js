'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, Badge, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  TagsOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  ProjectOutlined,
  RobotOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  NodeIndexOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  FormOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DesktopOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  AimOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/workbench',
    icon: <DashboardOutlined />,
    label: '工作台',
  },

  {
    key: 'tags',
    icon: <TagsOutlined />,
    label: '标签管理',
    children: [
      { key: '/annotation/objects', icon: <AppstoreOutlined />, label: '物体库' },
      { key: '/annotation/task-tags', icon: <TagsOutlined />, label: '任务标签' },
      { key: '/annotation/object-tags', icon: <TagsOutlined />, label: '物体标签' },
    ],
  },
  {
    key: 'devices',
    icon: <RobotOutlined />,
    label: '设备管理',
    children: [
      { key: '/collection/device-types', icon: <AppstoreOutlined />, label: '设备类型' },
      { key: '/collection/device-list', icon: <DatabaseOutlined />, label: '设备列表' },
    ],
  },
  {
    key: 'collection',
    icon: <CloudUploadOutlined />,
    label: '数据采集',
    children: [
      { key: '/collection/tasks', icon: <ProjectOutlined />, label: '任务中心' },
      { key: '/collection/qa', icon: <AuditOutlined />, label: '数据质检' },
      { key: '/collection/templates', icon: <FormOutlined />, label: '任务模板' },
      { key: '/collection/taskbooks', icon: <ProjectOutlined />, label: '任务书' },
    ],
  },
  {
    key: 'data',
    icon: <DatabaseOutlined />,
    label: '数据管理',
    children: [
      { key: '/data/raw', icon: <FileSearchOutlined />, label: '原始数据' },
      { key: '/data/datasets', icon: <FolderOpenOutlined />, label: '数据集管理' },
    ],
  },
  {
    key: '/projects',
    icon: <AppstoreOutlined />,
    label: '项目管理',
  },
  {
    key: 'workflow',
    icon: <ApartmentOutlined />,
    label: '流程管理',
    children: [
      { key: '/workflow/list', icon: <NodeIndexOutlined />, label: '工作流列表' },
      { key: '/workflow/nodes', icon: <ToolOutlined />, label: '节点管理' },
      { key: '/workflow/tasks', icon: <ThunderboltOutlined />, label: '预设工具' },
    ],
  },
  {
    key: 'annotation',
    icon: <TagsOutlined />,
    label: '数据标注',
    children: [
      { key: '/annotation/projects', icon: <FormOutlined />, label: '标注管理' },
      { key: '/annotation/answer', icon: <AimOutlined />, label: '答题管理' },
      { key: '/annotation/review-list', icon: <AuditOutlined />, label: '审核管理' },
      { key: '/annotation/acceptance', icon: <CheckCircleOutlined />, label: '验收管理' },
    ],
  },
  {
    key: 'marketplace',
    icon: <ShoppingOutlined />,
    label: '任务广场',
    children: [
      { key: '/annotation/marketplace', icon: <ShoppingOutlined />, label: '题包列表' },
    ],
  },
  {
    key: 'stats',
    icon: <BarChartOutlined />,
    label: '统计管理',
    children: [
      { key: '/annotation/stats', icon: <BarChartOutlined />, label: '项目统计' },
    ],
  },
  {
    key: 'simulation',
    icon: <DesktopOutlined />,
    label: '仿真中心',
    children: [
      { key: '/simulation/assets', icon: <AppstoreOutlined />, label: '仿真资产管理' },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '系统设置',
    children: [
      { key: '/settings/users', icon: <TeamOutlined />, label: '系统用户管理' },
      { key: '/settings/tags', icon: <TagsOutlined />, label: '全局标签管理' },
      { key: '/settings/download', icon: <CloudUploadOutlined />, label: '下载中心' },
    ],
  },
];

const breadcrumbMap = {
  '/workbench': ['工作台'],
  '/dashboard': ['数据分析看板'],
  '/collection/device-types': ['设备管理', '设备类型'],
  '/collection/device-list': ['设备管理', '设备列表'],
  '/collection/tasks': ['数据采集', '任务中心'],
  '/collection/tasks/create': ['数据采集', '任务中心', '新建任务'],
  '/collection/qa': ['数据采集', '数据质检'],
  '/collection/templates': ['数据采集', '任务模板'],
  '/collection/taskbooks': ['数据采集', '任务书'],
  '/data/raw': ['数据管理', '原始数据'],
  '/data/datasets': ['数据管理', '数据集管理'],
  '/projects': ['项目管理'],
  '/workflow/list': ['流程管理', '工作流列表'],
  '/workflow/nodes': ['流程管理', '节点管理'],
  '/workflow/tasks': ['流程管理', '预设工具'],
  '/annotation/objects': ['标签管理', '物体库'],
  '/annotation/task-tags': ['标签管理', '任务标签'],
  '/annotation/object-tags': ['标签管理', '物体标签'],
  '/annotation/projects': ['数据标注', '标注管理'],
  '/annotation/answer': ['数据标注', '答题管理'],
  '/annotation/review-list': ['数据标注', '审核管理'],
  '/annotation/acceptance': ['数据标注', '验收管理'],
  '/annotation/marketplace': ['任务广场', '题包列表'],
  '/annotation/stats': ['统计管理', '项目统计'],
  '/simulation/assets': ['仿真中心', '仿真资产管理'],
  '/settings/users': ['系统设置', '系统用户管理'],
  '/settings/tags': ['系统设置', '全局标签管理'],
  '/settings/download': ['系统设置', '下载中心'],
};

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const crumbs = breadcrumbMap[pathname] || ['工作台'];

  const getOpenKeys = () => {
    // Build a reverse map from child key to parent key
    const parentMap = {};
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          parentMap[child.key] = item.key;
        });
      }
    });
    const parentKey = parentMap[pathname];
    return parentKey ? [parentKey] : [];
  };

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
      { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') {
        router.push('/login');
      }
    },
  };

  return (
    <Layout className="main-layout" style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        trigger={null}
        style={{
          background: '#001529',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div className="sidebar-logo">
          <div className="logo-square">
            <RobotOutlined />
          </div>
          {!collapsed && <span className="logo-text">具身智能数据平台</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => {
            if (key.startsWith('/')) {
              router.push(key);
            }
          }}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s', background: '#F1F2F5' }}>
        <Header className="header-bar" style={{ position: 'sticky', top: 0, zIndex: 90 }}>
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: 'pointer', color: '#001529' },
            })}
            <Breadcrumb
              items={[
                { title: '首页' },
                ...crumbs.map(c => ({ title: c })),
              ]}
            />
          </div>
          <div className="header-right">
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" style={{ backgroundColor: '#0f172a' }} icon={<UserOutlined />} />
                <Text>管理员</Text>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ background: '#F1F2F5' }}>
          <div className="content-wrapper fade-in-up">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
