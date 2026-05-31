import fs from 'node:fs';
import path from 'node:path';

const root = new URL('.', import.meta.url);
const contentPath = new URL('./data/content.json', root);
const appPath = new URL('./src/app.js', root);
const indexPath = new URL('./index.html', root);
const stylesPath = new URL('./styles.css', root);

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const app = fs.readFileSync(appPath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');
const styles = fs.readFileSync(stylesPath, 'utf8');
const photoCatalog = new Map((content.photos ?? []).map((photo) => [photo.id, photo]));
const workspaceBlock = styles.match(/\.workspace\s*{[^}]*}/s)?.[0] ?? '';
const detailPanelBlock = styles.match(/\.detailPanel\s*{[^}]*}/s)?.[0] ?? '';
const planCanvasBlock = styles.match(/\.planCanvas\s*{[^}]*}/s)?.[0] ?? '';
const hotspotMap = new Map((content.hotspots ?? []).map((hotspot) => [hotspot.id, hotspot]));
const checks = [];

function check(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
}

function localPhotoExists(photo) {
  const photoPath = photo?.src?.replace('./', '');
  return Boolean(photoPath && fs.existsSync(path.join(root.pathname, photoPath)));
}

function resolvePhoto(item) {
  if (!item) return null;
  if (item.photo) return item.photo;
  if (!item.photoId) return null;
  return photoCatalog.get(item.photoId) ?? null;
}

function resolveHotspotPhoto(hotspot) {
  if (hotspot.kind !== 'artifact') return resolvePhoto(hotspot);
  const artifact = content.artifacts.find((entry) => entry.id === hotspot.artifactId);
  return resolvePhoto(artifact);
}

check('HTML loads modular app.js', /src="\.\/src\/app\.js"/.test(index));
check('app.js fetches external content.json', /fetch\('\.\/data\/content\.json'\)/.test(app));
check('content has editable rooms', Array.isArray(content.rooms) && content.rooms.length >= 6);
check('content has clickable hotspots', Array.isArray(content.hotspots) && content.hotspots.length >= 20);
check('content has at least 10 artifacts', Array.isArray(content.artifacts) && content.artifacts.length >= 10);
check('all artifact photos are local files', content.artifacts.every((artifact) => localPhotoExists(resolvePhoto(artifact))));
check('all artifact photos have source pages', content.artifacts.every((artifact) => artifact.photo?.sourceUrl?.startsWith('https://commons.wikimedia.org/wiki/File:')));
check('shared photo catalog has local files', Array.isArray(content.photos) && content.photos.length >= 10 && content.photos.every(localPhotoExists));
check('shared photo catalog has source pages', content.photos.every((photo) => photo.sourceUrl?.startsWith('https://')));
check('all rooms have sidebar photos', content.rooms.every((room) => localPhotoExists(resolvePhoto(room))));
check('all people have sidebar photos', content.people.every((person) => localPhotoExists(resolvePhoto(person))));
check('all hotspots have icon and sidebar photos', content.hotspots.every((hotspot) => localPhotoExists(resolveHotspotPhoto(hotspot))));
check('hotspots avoid room title corners', [
  ['first-step', 13, 55],
  ['golden-throne', 59, 46],
  ['annex-doorway', 52, 62],
  ['senet', 56, 74],
  ['young-king-death', 89, 44],
  ['anubis-shrine', 78, 74],
  ['canopic-equipment', 85, 70]
].every(([id, x, y]) => hotspotMap.get(id)?.x === x && hotspotMap.get(id)?.y === y));
check('hotspot renderer uses thumbnail images', /hotspotImage/.test(app) && !/button\.textContent = hotspot\.label/.test(app));
check('intro keeps title and entry button text only', content.meta?.intro?.title === 'Hrobka Tutanchamona' && content.meta?.intro?.enterLabel === 'Vstoupit' && !content.meta.intro.kicker && !content.meta.intro.text);
check('intro uses full-screen map iframe instead of photo', content.meta?.intro?.mapUrl === 'https://mapy.com/s/gekudunaku' && /id="introMap"/.test(index) && /introMap\.src = meta\.intro\.mapUrl/.test(app) && !/introSky|--intro-photo|meta\.intro\.photo|tomb-entrance/.test(index + app + JSON.stringify(content)));
check('intro entry uses dedicated button', /id="introEnter"/.test(index) && /introEnter\.addEventListener\('click', enterPlan\)/.test(app) && !/intro\.addEventListener\('click', enterPlan\)/.test(app));
check('intro removed drawn entrance elements', !/class="cliffWall"|class="tombEntrance"|class="stairCut"|class="sun"/.test(index));
check('detail panel has no fact list UI', !/factList|renderFacts/.test(index + app));
check('detail source label opens source modal', /buildSourcesIndexLink\('Zdroje:'\)/.test(app) && /href = '#sourcesOverlay'/.test(app) && /openSources\(\)/.test(app));
check('sources modal is presentation style', Array.isArray(content.sourcePresentation?.groups) && content.sourcePresentation.groups.length >= 3 && /sourcePresentation/.test(app + styles) && /buildSourceLinkLine/.test(app) && !/sourceItem|repeat\(auto-fit/.test(app + styles));
check('topbar has no variant eyebrow', !/modeEyebrow|variantTitle|Půdorysná prohlídka/.test(index + app + JSON.stringify(content)));
check('detail panel has no kicker or subtitle UI', !/detailKicker|detailMeta|class="meta"|artifact\.short|getRoomTitle|Předsíň plná výbavy|Vozy a jejich části v předsíni/.test(index + app + JSON.stringify(content)));
check('layout has no left sidebar or footer UI', !/mapPanel|roomList|renderRoomList|bottomBar|statusText|artifactStrip|artifactSlot|renderArtifactStrip/.test(index + app));
check('plan canvas is plain black without frame grid', /background:\s*#000;/.test(planCanvasBlock) && !/border:|border-radius:|background-size|box-shadow|linear-gradient/.test(planCanvasBlock));
check('detail sidebar can scroll in fixed viewport', /height:\s*100vh;/.test(workspaceBlock) && /overflow:\s*auto;/.test(detailPanelBlock) && /max-height:\s*100%;/.test(detailPanelBlock) && !/100vh\s*-\s*108px/.test(planCanvasBlock));
check('content has no removed progress copy', !/Prohlédnuté|spodním pásu|artifactStrip/.test(JSON.stringify(content)));
check('default detail has no implementation copy', !/Klikací body v mapě|Texty, souřadnice|JSON souboru/.test(JSON.stringify(content.meta?.defaultDetail ?? {})));
check('content avoids source meta commentary', !/Zdroje jsou zvolené|práce nestála|obecném shrnutí|U snímků je důležité|dohledatelné autorství|původ a licence|v této variantě|v této verzi|mechanismu aplikace|content\.json|JSON souboru|není [^.!?]+, ale/.test(JSON.stringify(content)));
check('app keeps factual copy out of JS', !/První schod ke vstupu|Zlatá pohřební maska|Howard Carter/.test(app));

const failed = checks.filter((entry) => !entry.ok);
for (const entry of checks) {
  console.log(`${entry.ok ? 'OK' : 'FAIL'} ${entry.name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
