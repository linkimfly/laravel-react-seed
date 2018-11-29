# 在任何支持 Laravel 的运行环境上安装本项目开始使用


配置环境

安装 php 依赖
```
composer install
```

创建数据库


配置 .env 文件
```
cp .env.example .env

sudo vim .env

//然后按照实际情况配置
```

生成 laravel key
```
php artisan key:generate
```

执行迁移和Seeder
```
php artisan migrate --seed
```

访问
```
管理后台：

1. 路径 '/admin'
2. 需要登录，默认帐号：admin@qq.com，默认密码：admin
3. 仅id=1的用户可以登录后台（权限管理实现范例，查看Super中间件）
4. 使用了 Antd 和 React Router4 搭建了一个简单范例

前台：

1. 路径 '/home'
2. 需要登录，默认帐号：admin@qq.com，默认密码：admin
3. 包含了一个 React 的例子
4. 如果需要做移动端，可以使用 Antd Mobile
```

交流加QQ群：3113961
