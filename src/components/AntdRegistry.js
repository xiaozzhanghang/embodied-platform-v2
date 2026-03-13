'use client';

import React from 'react';
import { ConfigProvider, App } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export default function AntdRegistry({ children }) {
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{ 
                token: { 
                    colorPrimary: '#1a73e8', // Google Blue as the global brand primary color
                    colorInfo: '#1a73e8',
                    colorSuccess: '#10b981', // Emerald green
                    colorWarning: '#f59e0b', // Amber orange
                    colorError: '#ef4444',   // Rose red
                    borderRadius: 6,         // Standardized crisp border radius
                    colorLink: '#1a73e8',
                    fontFamily: `-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif`,
                },
                components: {
                    Card: {
                        borderRadiusLG: 10,
                        boxShadowTertiary: '0 1px 4px rgba(0,0,0,0.06)',
                    },
                    Button: {
                        controlHeightLG: 40,
                        paddingInlineLG: 24,
                    },
                    Input: {
                        controlHeightLG: 32,
                        borderRadius: 6,
                    },
                    Select: {
                        controlHeightLG: 32,
                        borderRadius: 6,
                    },
                    Table: {
                        headerBg: '#fafafa',
                        headerColor: '#888',
                        headerBorderRadius: 0,
                        rowHoverBg: '#fafcff',
                    }
                }
            }}
        >
            <App>{children}</App>
        </ConfigProvider>
    );
}
