# Skills Dashboard v2 开发路线图

> 📅 创建日期：2026-02-09
> 📝 状态：规划中

## 项目愿景

将 Skills Dashboard 从纯展示型页面升级为一个具有社区互动和个人工具功能的完整平台。

---

## 功能规划

### 🤝 社区互动功能

#### 1. 收藏系统
- 用户可收藏感兴趣的技能
- 收藏列表在个人主页展示
- 支持快速访问已收藏技能

#### 2. 评论讨论
- 在技能详情页添加评论区
- 用户可分享使用心得、提问交流
- 支持 Markdown 格式

#### 3. 技能组合分享
- 用户可创建并分享自己的技能配置
- 类似 dotfiles 的分享模式
- 其他用户可以一键复制技能组合

---

### 👤 个人工具功能

#### 1. 个人主页 (Profile)
- 展示用户收藏的技能
- 展示分享的技能组合
- 活动记录和贡献统计

#### 2. 技能推荐引擎
- 基于收藏和浏览习惯推荐相关技能
- 智能匹配相似用户的选择
- 发现你可能感兴趣的新技能

#### 3. 技能集管理
- 创建分类技能集合
- 例如："前端开发"、"AI 开发"、"数据分析"
- 支持公开或私有集合

---

## 技术方案

### 认证系统
- **方案**：NextAuth.js + GitHub OAuth
- **理由**：与开发者生态契合，用户无需额外注册

### 数据存储
- **方案**：Supabase (PostgreSQL)
- **理由**：Vercel 原生支持，零运维，免费额度充足

### 部署
- **平台**：Vercel
- **现状**：已部署

---

## 数据库设计（参考）

```sql
-- 用户表
users (
  id, github_id, username, avatar_url, 
  created_at, updated_at
)

-- 收藏表
favorites (
  id, user_id, skill_name, skill_owner, skill_repo,
  created_at
)

-- 评论表
comments (
  id, user_id, skill_name, content,
  created_at, updated_at
)

-- 技能组合表
skill_sets (
  id, user_id, name, description, is_public,
  created_at, updated_at
)

-- 技能组合详情表
skill_set_items (
  id, skill_set_id, skill_name, skill_owner, skill_repo,
  order_index
)
```

---

## 开发顺序建议

1. **Phase 1 - 基础设施**
   - [ ] 集成 NextAuth.js + GitHub OAuth
   - [ ] 设置 Supabase 数据库
   - [ ] 创建基础 API 路由

2. **Phase 2 - 收藏功能**
   - [ ] 实现收藏/取消收藏 API
   - [ ] 在技能卡片上添加收藏按钮
   - [ ] 创建"我的收藏"页面

3. **Phase 3 - 个人主页**
   - [ ] 创建用户 Profile 页面
   - [ ] 展示收藏列表
   - [ ] 添加用户设置

4. **Phase 4 - 评论系统**
   - [ ] 创建技能详情页
   - [ ] 实现评论 CRUD API
   - [ ] 评论区 UI 组件

5. **Phase 5 - 技能组合**
   - [ ] 技能集 CRUD
   - [ ] 分享功能
   - [ ] 一键导入

6. **Phase 6 - 推荐系统**
   - [ ] 收集用户行为数据
   - [ ] 实现推荐算法
   - [ ] 推荐展示 UI

---

## 备注

- 所有功能按需开发，不着急
- 优先保证现有功能稳定
- 有时间再逐步实现
