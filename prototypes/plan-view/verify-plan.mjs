import fs from 'node:fs';
import path from 'node:path';

const root = new URL('.', import.meta.url);
const contentPath = new URL('./data/content.json', root);
const appPath = new URL('./src/app.js', root);
const indexPath = new URL('./index.html', root);

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const app = fs.readFileSync(appPath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');
const checks = [];

function check(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
}

check('HTML loads modular app.js', /src="\.\/src\/app\.js"/.test(index));
check('app.js fetches external content.json', /fetch\('\.\/data\/content\.json'\)/.test(app));
check('content has editable rooms', Array.isArray(content.rooms) && content.rooms.length >= 6);
check('content has clickable hotspots', Array.isArray(content.hotspots) && content.hotspots.length >= 20);
check('content has at least 10 artifacts', Array.isArray(content.artifacts) && content.artifacts.length >= 10);
check('all artifact photos are local files', content.artifacts.every((artifact) => {
  const photoPath = artifact.photo?.src?.replace('./', '');
  return photoPath && fs.existsSync(path.join(root.pathname, photoPath));
}));
check('all artifact photos have source pages', content.artifacts.every((artifact) => artifact.photo?.sourceUrl?.startsWith('https://commons.wikimedia.org/wiki/File:')));
check('intro keeps only the title text', content.meta?.intro?.title === 'Hrobka Tutanchamona' && !content.meta.intro.kicker && !content.meta.intro.text);
check('intro uses the requested local photo', content.meta?.intro?.photo?.src === './assets/intro/tomb-entrance.jpg' && fs.existsSync(new URL('./assets/intro/tomb-entrance.jpg', root)));
check('intro removed drawn entrance elements', !/class="cliffWall"|class="tombEntrance"|class="stairCut"|class="sun"/.test(index));
check('app keeps factual copy out of JS', !/První schod ke vstupu|Zlatá pohřební maska|Howard Carter/.test(app));

const failed = checks.filter((entry) => !entry.ok);
for (const entry of checks) {
  console.log(`${entry.ok ? 'OK' : 'FAIL'} ${entry.name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
