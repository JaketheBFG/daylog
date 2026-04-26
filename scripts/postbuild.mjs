// After Vite build, swap dist/index.html (React app) and dist/landing.html
// so that:
//   dist/index.html  = landing page (served at / on Vercel)
//   dist/app.html    = React app (served at /app via vercel.json rewrite)
import fs from 'fs';
import path from 'path';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
const appPath = path.join(dist, 'app.html');
const landingPath = path.join(dist, 'landing.html');

if (!fs.existsSync(landingPath)) {
  console.error('postbuild: dist/landing.html not found — was public/landing.html copied?');
  process.exit(1);
}

fs.renameSync(indexPath, appPath);
fs.renameSync(landingPath, indexPath);
console.log('postbuild: swapped index.html ↔ landing.html for Vercel');
