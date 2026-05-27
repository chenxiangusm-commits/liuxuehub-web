# LiuxueHub - 留学选校平台

面向中国学生的留学选校、查校、申请面试和求职AI平台。

## 项目结构

```
liuxuehub-web/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 首页
│   │   ├── programs/     # 专业搜索页
│   │   ├── schools/      # 学校详情页
│   │   ├── favorites/    # 选校清单页
│   │   └── ai/           # AI工具页
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数和数据访问
│   └── types/            # TypeScript 类型定义
├── database/             # 数据库文件（上级目录）
└── ...
```

## 功能特性

- ✅ **专业搜索** - 3263+专业，支持多种筛选条件
- ✅ **学校详情** - 查看学校信息和开设专业
- ✅ **专业详情** - 完整的专业信息和官方链接
- ✅ **选校清单** - 收藏感兴趣的专业（localStorage）
- ✅ **AI工具入口** - 为未来AI功能预留

## 筛选条件

- 地区筛选（中国香港、中国澳门、新加坡、澳大利亚）
- 学历筛选（本科/硕士）
- 学校筛选
- QS排名筛选（1-50、51-100、101-200、201+）
- 关键词筛选（专业、语言、学费）

## 快速开始

### 安装依赖

```bash
cd liuxuehub-web
npm install
```

### 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 数据说明

项目使用 `database/master_database.json` 作为数据源，包含：
- 58所学校
- 3263个专业
- 覆盖4个地区

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **数据**: JSON (静态数据)
- **状态**: localStorage (收藏功能)

## 未来规划

- [ ] 接入 Supabase 数据库
- [ ] 用户认证系统
- [ ] AI 选校推荐
- [ ] 面试模拟
- [ ] 简历上传和分析
- [ ] 会员系统
