const fs = require('fs');
const path = require('path');

const baseDir = '/Users/zhangxiaozhang/Desktop/具身智能平台原型/prototype-v2/src/app';

const paths = [
    "/dashboard",
    "/collection/config",
    "/collection/tasks",
    "/workflow",
    "/annotation/objects",
    "/annotation/task-tags",
    "/annotation/object-tags",
    "/collection/devices",
    "/collection/collect",
    "/collection/qa",
    "/collection/templates",
    "/collection/taskbooks",
    "/data/raw",
    "/data/datasets",
    "/projects",
    "/workflow/list",
    "/workflow/nodes",
    "/workflow/tasks",
    "/annotation/projects",
    "/annotation/answer",
    "/annotation/review-list",
    "/annotation/acceptance",
    "/annotation/marketplace",
    "/annotation/stats",
    "/simulation/assets",
    "/settings/users",
    "/settings/tags",
    "/settings/download"
];

paths.forEach(p => {
    const fullPath = path.join(baseDir, p, 'page.js');
    if (!fs.existsSync(fullPath)) {
        console.log("Creating missing route:", fullPath);
        fs.mkdirSync(path.join(baseDir, p), { recursive: true });
        
        const title = p.split('/').pop().replace(/-/g, ' ').toUpperCase();
        const content = `import React from 'react';\nimport MainLayout from '@/components/MainLayout';\nimport { Empty } from 'antd';\n\nexport default function PlaceholderPage() {\n  return (\n    <MainLayout>\n      <div style={{ padding: 40, background: '#fff', borderRadius: 8, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n        <Empty description="${title} 模块暂未开放 (V2 规划区)" />\n      </div>\n    </MainLayout>\n  );\n}\n`;
        fs.writeFileSync(fullPath, content);
    }
});

// clean up self
fs.unlinkSync(__filename);
