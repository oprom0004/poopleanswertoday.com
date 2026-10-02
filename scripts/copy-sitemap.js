import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexSitemap = path.join(distDir, 'sitemap-index.xml');
const singleSitemap = path.join(distDir, 'sitemap-0.xml');
const targetSitemap = path.join(distDir, 'sitemap.xml');

// Copy sitemap-0.xml (or sitemap-index.xml) as sitemap.xml
if (fs.existsSync(singleSitemap)) {
  fs.copyFileSync(singleSitemap, targetSitemap);
  console.log('✅ Successfully created dist/sitemap.xml from sitemap-0.xml');
} else if (fs.existsSync(indexSitemap)) {
  fs.copyFileSync(indexSitemap, targetSitemap);
  console.log('✅ Successfully created dist/sitemap.xml from sitemap-index.xml');
}
