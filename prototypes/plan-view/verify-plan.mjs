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
const photoFrameImageBlock = styles.match(/\.photoFrame img\s*{[^}]*}/s)?.[0] ?? '';
const hotspotBlock = styles.match(/\.hotspot\s*{[^}]*}/s)?.[0] ?? '';
const smallHotspotBlock = styles.match(/@media \(max-width: 620px\)\s*{[\s\S]*?\.hotspot\s*{[^}]*}/)?.[0] ?? '';
const hotspotMap = new Map((content.hotspots ?? []).map((hotspot) => [hotspot.id, hotspot]));
const roomMap = new Map((content.rooms ?? []).map((room) => [room.id, room]));
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
  if (hotspot.personId) {
    const person = content.people.find((entry) => entry.id === hotspot.personId);
    return resolvePhoto(person);
  }
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
check('tutankhamun person uses high quality mask photo', photoCatalog.get(content.people.find((person) => person.id === 'tutankhamun')?.photoId)?.src === './assets/tutankhamun/golden-mask.jpg');
check('all hotspots have icon and sidebar photos', content.hotspots.every((hotspot) => localPhotoExists(resolveHotspotPhoto(hotspot))));
check('people linked from details are direct map hotspots', ['carter', 'carnarvon', 'egyptian-workers', 'tutankhamun', 'ankhesenamon'].every((personId) => content.hotspots.some((hotspot) => hotspot.personId === personId)));
check('hotspots avoid room title corners', [
  ['first-step', 12, 50],
  ['howard-carter', 13, 32],
  ['lord-carnarvon', 17, 31],
  ['egyptian-workers-hotspot', 20, 35],
  ['sealed-doorway', 24, 47],
  ['ankhesenamon-person', 72, 29],
  ['golden-throne', 69, 47],
  ['annex-doorway', 58, 66],
  ['senet', 51, 77],
  ['young-king-death', 80, 64],
  ['anubis-shrine', 86, 31],
  ['canopic-equipment', 92, 32]
].every(([id, x, y]) => hotspotMap.get(id)?.x === x && hotspotMap.get(id)?.y === y));
check('plan topology follows attached KV62 floor plan', roomMap.get('corridor')?.x > roomMap.get('entrance')?.x && roomMap.get('antechamber')?.x > roomMap.get('corridor')?.x && roomMap.get('burial')?.y > roomMap.get('antechamber')?.y && roomMap.get('annex')?.x < roomMap.get('burial')?.x && Math.abs((roomMap.get('annex')?.y ?? 0) - (roomMap.get('burial')?.y ?? 0)) < 4 && roomMap.get('treasury')?.x > roomMap.get('antechamber')?.x && roomMap.get('treasury')?.y < roomMap.get('antechamber')?.y);
check('room labels match attached floor plan terms', roomMap.get('entrance')?.label === 'Schodiště' && roomMap.get('corridor')?.label === 'Sestupná chodba' && roomMap.get('annex')?.label === 'Sklad' && roomMap.get('treasury')?.label === 'Boční komora');
check('hotspot renderer uses thumbnail images', /hotspotImage/.test(app) && !/button\.textContent = hotspot\.label/.test(app));
check('intro keeps title and entry button text only', content.meta?.intro?.title === 'Hrobka Tutanchamona' && content.meta?.intro?.enterLabel === 'Vstoupit' && !content.meta.intro.kicker && !content.meta.intro.text);
check('intro uses full-screen map iframe instead of photo', content.meta?.intro?.mapUrl === 'https://mapy.com/s/gekudunaku' && /id="introMap"/.test(index) && /introMap\.src = meta\.intro\.mapUrl/.test(app) && !/introSky|--intro-photo|meta\.intro\.photo|tomb-entrance/.test(index + app + JSON.stringify(content)));
check('intro entry uses dedicated button', /id="introEnter"/.test(index) && /introEnter\.addEventListener\('click', enterPlan\)/.test(app) && !/intro\.addEventListener\('click', enterPlan\)/.test(app));
check('intro removed drawn entrance elements', !/class="cliffWall"|class="tombEntrance"|class="stairCut"|class="sun"/.test(index));
check('detail panel has no fact list UI', !/factList|renderFacts/.test(index + app));
check('detail source label opens source modal', /buildSourcesIndexLink\('Zdroje:'\)/.test(app) && /href = '#sourcesOverlay'/.test(app) && /openSources\(\)/.test(app));
check('photo captions use concise linked source labels', /photo\.caption} Zdroj:/.test(app) && /getPhotoSourceLabel\(photo\)/.test(app) && !/Stránka fotky|photo\.credit|photo\.license/.test(app));
check('photo metadata omits attribution prose', !/credit|license|stránka souboru|atribucí autora|Licence podle|Public domain podle|CC0 podle|sourceLabel": "Commons"/.test(JSON.stringify(content)));
check('sources modal is presentation style', Array.isArray(content.sourcePresentation?.groups) && content.sourcePresentation.groups.length >= 3 && /sourcePresentation/.test(app + styles) && /buildSourceLinkLine/.test(app) && !/sourceItem|repeat\(auto-fit/.test(app + styles));
check('sources modal has links without explanatory paragraphs', !content.sourcePresentation?.intro && !content.sourcePresentation?.note && content.sourcePresentation.groups.every((group) => !group.body) && !/sourceIntro|sourceNote|group\.body/.test(app + styles));
check('frontend hides numeric source shortcuts', !/\$\{source\.id\}:|buildLink\(source\.url, source\.id\)/.test(app));
check('room overview hotspots share room details', hotspotMap.get('kv62-comparison')?.detailRoomId === 'corridor' && hotspotMap.get('first-glimpse')?.detailRoomId === 'antechamber' && hotspotMap.get('storage-supplies')?.detailRoomId === 'annex' && /hotspot\.detailRoomId/.test(app));
check('detail selections write route hashes', /updateRouteHash\('room', room\.id\)/.test(app) && /updateRouteHash\('hotspot', hotspot\.id\)/.test(app) && /updateRouteHash\('person', person\.id\)/.test(app));
check('route hashes reopen selected details', /applyRouteFromHash\(\)/.test(app) && /parseRouteHash/.test(app) && /window\.addEventListener\('hashchange', handleRouteChange\)/.test(app) && /window\.addEventListener\('popstate', handleRouteChange\)/.test(app) && /route\.type === 'room'/.test(app) && /route\.type === 'hotspot'/.test(app) && /route\.type === 'person'/.test(app));
check('detail panel has no cross-link chips', !/relatedPeople|relatedPersonIds|personChip|renderRelatedPeople/.test(index + app + styles + JSON.stringify(content)));
check('topbar has no variant eyebrow', !/modeEyebrow|variantTitle|Půdorysná prohlídka/.test(index + app + JSON.stringify(content)));
check('detail panel has no kicker or subtitle UI', !/detailKicker|detailMeta|class="meta"|artifact\.short|getRoomTitle|Předsíň plná výbavy|Vozy a jejich části v předsíni/.test(index + app + JSON.stringify(content)));
check('layout has no left sidebar or footer UI', !/mapPanel|roomList|renderRoomList|bottomBar|statusText|artifactStrip|artifactSlot|renderArtifactStrip/.test(index + app));
check('plan canvas is plain black without frame grid', /background:\s*#000;/.test(planCanvasBlock) && !/border:|border-radius:|background-size|box-shadow|linear-gradient/.test(planCanvasBlock));
check('detail sidebar can scroll in fixed viewport', /height:\s*100vh;/.test(workspaceBlock) && /overflow:\s*auto;/.test(detailPanelBlock) && /max-height:\s*100%;/.test(detailPanelBlock) && !/100vh\s*-\s*108px/.test(planCanvasBlock));
check('sidebar photos keep original aspect ratio', /height:\s*auto;/.test(photoFrameImageBlock) && !/aspect-ratio|object-fit:\s*cover/.test(photoFrameImageBlock));
check('map bubbles use fixed square dimensions', /--hotspot-size:\s*42px;/.test(hotspotBlock) && /width:\s*var\(--hotspot-size\);/.test(hotspotBlock) && /height:\s*var\(--hotspot-size\);/.test(hotspotBlock) && /min-width:\s*var\(--hotspot-size\);/.test(hotspotBlock) && /min-height:\s*var\(--hotspot-size\);/.test(hotspotBlock) && /--hotspot-size:\s*34px;/.test(smallHotspotBlock) && !/aspect-ratio:\s*1;/.test(hotspotBlock));
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
