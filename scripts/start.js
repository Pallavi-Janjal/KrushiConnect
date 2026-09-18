import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Check if running on Render or production environment
const isRender = !!process.env.RENDER || !!process.env.RENDER_SERVICE_ID || !!process.env.IS_PULL_REQUEST || process.env.NODE_ENV === 'production';
const hasServerBuild = fs.existsSync(path.join(process.cwd(), 'server', 'dist', 'server.js'));

if (isRender || hasServerBuild) {
  console.log('🚀 Running Production Server (Express + MongoDB Atlas + React build)');
  const proc = spawn('node', ['server/dist/server.js'], { stdio: 'inherit', shell: true });
  proc.on('exit', (code) => process.exit(code || 0));
} else {
  console.log('💻 Running in Development mode...');
  const proc = spawn('npx', ['concurrently', '-n', 'SERVER,CLIENT', '-c', 'blue,green', 'npm --prefix server run dev', 'vite --host 0.0.0.0'], { stdio: 'inherit', shell: true });
  proc.on('exit', (code) => process.exit(code || 0));
}
