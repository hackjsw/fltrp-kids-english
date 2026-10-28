// 手机访问用：HTTPS 开发服务器（端口 5181），跨平台设置环境变量
import { spawn } from 'node:child_process'

process.env.HTTPS = '1'
spawn('npx', ['vite', '--host'], { stdio: 'inherit', shell: true, env: process.env })
