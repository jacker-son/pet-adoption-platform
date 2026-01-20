# OAuth 配置指南

您的 Supabase 项目回调 URL：
```
https://abkxbimdairmuhdkxvwt.supabase.co/auth/v1/callback
```

---

## GitHub OAuth 配置

### 步骤 1：在 GitHub 创建 OAuth 应用

1. 打开 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击左侧 **OAuth Apps**
3. 点击 **New OAuth App**
4. 填写表单：
   - **Application name**: `宠物领养平台` (或您喜欢的名字)
   - **Homepage URL**: `http://localhost:3000` (开发环境)
   - **Authorization callback URL**: `https://abkxbimdairmuhdkxvwt.supabase.co/auth/v1/callback`
5. 点击 **Register application**
6. 复制 **Client ID**
7. 点击 **Generate a new client secret**，复制 **Client Secret**

### 步骤 2：在 Supabase 配置 GitHub

1. 打开 [Supabase Dashboard - Auth Providers](https://supabase.com/dashboard/project/abkxbimdairmuhdkxvwt/auth/providers)
2. 找到 **GitHub** 并展开
3. 开启 **Enable GitHub**
4. 填入刚才复制的 **Client ID** 和 **Client Secret**
5. 点击 **Save**

---

## Google OAuth 配置

### 步骤 1：创建 Google Cloud 项目

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击顶部项目选择器 → **New Project**
3. 项目名称：`Pet Adoption Platform`
4. 点击 **Create**

### 步骤 2：配置 OAuth 同意屏幕

1. 进入 [OAuth 同意屏幕](https://console.cloud.google.com/apis/credentials/consent)
2. 选择 **External**，点击 **Create**
3. 填写：
   - **App name**: `宠物领养平台`
   - **User support email**: 选择您的邮箱
   - **Developer contact email**: 填您的邮箱
4. 点击 **Save and Continue**（后续页面也点击继续直到完成）

### 步骤 3：创建 OAuth 凭据

1. 进入 [Credentials 页面](https://console.cloud.google.com/apis/credentials)
2. 点击 **+ Create Credentials** → **OAuth client ID**
3. 选择 **Web application**
4. 名称：`Supabase Auth`
5. **Authorized redirect URIs**：添加 `https://abkxbimdairmuhdkxvwt.supabase.co/auth/v1/callback`
6. 点击 **Create**
7. 复制 **Client ID** 和 **Client Secret**

### 步骤 4：在 Supabase 配置 Google

1. 打开 [Supabase Dashboard - Auth Providers](https://supabase.com/dashboard/project/abkxbimdairmuhdkxvwt/auth/providers)
2. 找到 **Google** 并展开
3. 开启 **Enable Google**
4. 填入 **Client ID** 和 **Client Secret**
5. 点击 **Save**

---

## 验证配置

配置完成后，启动项目测试：

```bash
cd pet-adoption-platform
npm run dev
```

访问 http://localhost:3000/auth/login 测试 OAuth 登录。

> **提示**：Google OAuth 在测试模式下只允许您添加的测试用户登录。如需所有人都能登录，需要在 Google Cloud Console 发布应用。
