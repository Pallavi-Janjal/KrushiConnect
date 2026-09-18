import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'dist');
const destDir = path.join(process.cwd(), 'server', 'public');

if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('✅ Copied dist/ to server/public for production serving');
}
